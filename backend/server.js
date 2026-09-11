import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import db from "./db.js";
import { generateToken, requireAuth } from "./auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const content = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "lessons.json"), "utf-8")
);

const app = express();
app.use(cors());
app.use(express.json());

// ── Helpers ────────────────────────────────────────────────────────────────

function getLearner(id) {
  return db.prepare("SELECT id, name, email, xp, hearts, streak, last_active_date, created_at FROM learners WHERE id = ?").get(id);
}

function getProgressMap(learnerId) {
  const rows = db
    .prepare("SELECT lesson_id, stars FROM lesson_progress WHERE learner_id = ?")
    .all(learnerId);
  const map = {};
  for (const row of rows) map[row.lesson_id] = row.stars;
  return map;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// Safe public shape (no password hash)
function publicLearner(learner) {
  if (!learner) return null;
  const { password_hash, ...safe } = learner;
  return safe;
}

// ── Auth routes ────────────────────────────────────────────────────────────

// POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email, and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  const existing = db.prepare("SELECT id FROM learners WHERE email = ?").get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const hash = await bcrypt.hash(password, 10);
  const stmt = db.prepare(
    "INSERT INTO learners (name, email, password_hash) VALUES (?, ?, ?)"
  );
  const result = stmt.run(name.trim(), email.toLowerCase(), hash);
  const learner = getLearner(result.lastInsertRowid);
  const token = generateToken(learner.id);

  res.status(201).json({ token, learner: publicLearner(learner) });
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required." });
  }

  const learner = db.prepare("SELECT * FROM learners WHERE email = ?").get(email.toLowerCase());
  if (!learner) {
    return res.status(401).json({ error: "No account found with this email." });
  }

  const match = await bcrypt.compare(password, learner.password_hash || "");
  if (!match) {
    return res.status(401).json({ error: "Incorrect password." });
  }

  const token = generateToken(learner.id);
  res.json({ token, learner: publicLearner(getLearner(learner.id)) });
});

// GET /api/auth/me — returns current user profile
app.get("/api/auth/me", requireAuth, (req, res) => {
  const learner = getLearner(req.userId);
  if (!learner) return res.status(404).json({ error: "User not found." });
  res.json({ learner: publicLearner(learner) });
});

// ── Leaderboard ────────────────────────────────────────────────────────────

// GET /api/leaderboard — top 20 users by XP (public, no auth required)
app.get("/api/leaderboard", (req, res) => {
  const rows = db
    .prepare(
      "SELECT id, name, xp, streak FROM learners ORDER BY xp DESC LIMIT 20"
    )
    .all();
  res.json({ leaderboard: rows });
});

// ── Track routes (protected) ────────────────────────────────────────────────

app.get("/api/tracks", requireAuth, (req, res) => {
  const progress = getProgressMap(req.userId);
  const tracks = content.tracks.map((t) => {
    const lessonIds = t.units.flatMap((u) => u.lessons.map((l) => l.id));
    const completed = lessonIds.filter((id) => (progress[id] || 0) > 0).length;
    return {
      id: t.id,
      name: t.name,
      tagline: t.tagline,
      color: t.color,
      totalLessons: lessonIds.length,
      completedLessons: completed,
    };
  });
  res.json({ tracks, learner: publicLearner(getLearner(req.userId)) });
});

app.get("/api/tracks/:trackId", requireAuth, (req, res) => {
  const track = content.tracks.find((t) => t.id === req.params.trackId);
  if (!track) return res.status(404).json({ error: "Track not found" });

  const progress = getProgressMap(req.userId);
  let previousCompleted = true;

  const units = track.units.map((u) => ({
    id: u.id,
    title: u.title,
    lessons: u.lessons.map((l) => {
      const stars = progress[l.id] || 0;
      const unlocked = previousCompleted;
      previousCompleted = stars > 0;
      return { id: l.id, title: l.title, questionCount: l.questions.length, stars, unlocked };
    }),
  }));

  res.json({ id: track.id, name: track.name, tagline: track.tagline, color: track.color, units });
});

app.get("/api/lessons/:lessonId", requireAuth, (req, res) => {
  for (const t of content.tracks) {
    for (const u of t.units) {
      const lesson = u.lessons.find((l) => l.id === req.params.lessonId);
      if (lesson) {
        return res.json({ ...lesson, trackId: t.id, trackName: t.name, trackColor: t.color });
      }
    }
  }
  res.status(404).json({ error: "Lesson not found" });
});

app.post("/api/lessons/:lessonId/complete", requireAuth, (req, res) => {
  const { correctCount, totalQuestions, trackId } = req.body;
  if (typeof correctCount !== "number" || typeof totalQuestions !== "number") {
    return res.status(400).json({ error: "correctCount and totalQuestions are required numbers" });
  }

  const ratio = totalQuestions > 0 ? correctCount / totalQuestions : 0;
  const stars = ratio === 1 ? 3 : ratio >= 0.7 ? 2 : ratio > 0 ? 1 : 0;
  const xpEarned = correctCount * 10 + (stars === 3 ? 20 : 0);

  const learner = getLearner(req.userId);
  const today = todayISO();
  let newStreak = learner.streak;
  if (learner.last_active_date !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    newStreak = learner.last_active_date === yesterday ? learner.streak + 1 : 1;
  }

  const existing = db
    .prepare("SELECT stars FROM lesson_progress WHERE learner_id = ? AND lesson_id = ?")
    .get(req.userId, req.params.lessonId);
  const bestStars = Math.max(stars, existing?.stars || 0);

  db.prepare(
    `INSERT INTO lesson_progress (learner_id, lesson_id, track_id, stars, completed_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(learner_id, lesson_id) DO UPDATE SET stars = excluded.stars, completed_at = excluded.completed_at`
  ).run(req.userId, req.params.lessonId, trackId, bestStars, new Date().toISOString());

  db.prepare(
    "UPDATE learners SET xp = xp + ?, streak = ?, last_active_date = ? WHERE id = ?"
  ).run(xpEarned, newStreak, today, req.userId);

  res.json({ stars, xpEarned, learner: publicLearner(getLearner(req.userId)) });
});

app.post("/api/hearts/lose", requireAuth, (req, res) => {
  const learner = getLearner(req.userId);
  const hearts = Math.max(0, learner.hearts - 1);
  db.prepare("UPDATE learners SET hearts = ? WHERE id = ?").run(hearts, req.userId);
  res.json({ hearts });
});

app.post("/api/hearts/refill", requireAuth, (req, res) => {
  db.prepare("UPDATE learners SET hearts = 5 WHERE id = ?").run(req.userId);
  res.json({ hearts: 5 });
});

// ── Start ──────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ CodeLingo API running at http://localhost:${PORT}`);
});
