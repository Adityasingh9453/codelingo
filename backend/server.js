import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const content = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "lessons.json"), "utf-8")
);

const app = express();
app.use(cors());
app.use(express.json());

// ---- helpers -------------------------------------------------------------

function getLearner() {
  return db.prepare("SELECT * FROM learners WHERE id = 1").get();
}

function getProgressMap() {
  const rows = db.prepare("SELECT lesson_id, stars FROM lesson_progress").all();
  const map = {};
  for (const row of rows) map[row.lesson_id] = row.stars;
  return map;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ---- routes ---------------------------------------------------------------

// All tracks with completion progress rolled up, for the home screen.
app.get("/api/tracks", (req, res) => {
  const progress = getProgressMap();
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
  res.json({ tracks, learner: getLearner() });
});

// Full unit/lesson map for one track, with per-lesson star progress + locking.
app.get("/api/tracks/:trackId", (req, res) => {
  const track = content.tracks.find((t) => t.id === req.params.trackId);
  if (!track) return res.status(404).json({ error: "Track not found" });

  const progress = getProgressMap();

  // A lesson is unlocked if it's the very first lesson, or the previous
  // lesson in the flattened sequence has been completed.
  const flatLessons = track.units.flatMap((u) => u.lessons);
  let previousCompleted = true;

  const units = track.units.map((u) => ({
    id: u.id,
    title: u.title,
    lessons: u.lessons.map((l) => {
      const stars = progress[l.id] || 0;
      const unlocked = previousCompleted;
      previousCompleted = stars > 0;
      return {
        id: l.id,
        title: l.title,
        questionCount: l.questions.length,
        stars,
        unlocked,
      };
    }),
  }));

  res.json({
    id: track.id,
    name: track.name,
    tagline: track.tagline,
    color: track.color,
    units,
  });
});

// A single lesson's full question set, ready for the question player.
app.get("/api/lessons/:lessonId", (req, res) => {
  for (const t of content.tracks) {
    for (const u of t.units) {
      const lesson = u.lessons.find((l) => l.id === req.params.lessonId);
      if (lesson) {
        return res.json({
          ...lesson,
          trackId: t.id,
          trackName: t.name,
          trackColor: t.color,
        });
      }
    }
  }
  res.status(404).json({ error: "Lesson not found" });
});

// Record the result of a finished lesson: awards XP, updates streak/hearts/stars.
app.post("/api/lessons/:lessonId/complete", (req, res) => {
  const { correctCount, totalQuestions, trackId } = req.body;
  if (typeof correctCount !== "number" || typeof totalQuestions !== "number") {
    return res.status(400).json({ error: "correctCount and totalQuestions are required numbers" });
  }

  const ratio = totalQuestions > 0 ? correctCount / totalQuestions : 0;
  const stars = ratio === 1 ? 3 : ratio >= 0.7 ? 2 : ratio > 0 ? 1 : 0;
  const xpEarned = correctCount * 10 + (stars === 3 ? 20 : 0); // bonus for a perfect lesson

  const learner = getLearner();
  const today = todayISO();
  let newStreak = learner.streak;
  if (learner.last_active_date !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    newStreak = learner.last_active_date === yesterday ? learner.streak + 1 : 1;
  }

  const existing = db
    .prepare("SELECT stars FROM lesson_progress WHERE lesson_id = ?")
    .get(req.params.lessonId);
  const bestStars = Math.max(stars, existing?.stars || 0);

  db.prepare(
    `INSERT INTO lesson_progress (lesson_id, track_id, stars, completed_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(lesson_id) DO UPDATE SET stars = excluded.stars, completed_at = excluded.completed_at`
  ).run(req.params.lessonId, trackId, bestStars, new Date().toISOString());

  db.prepare(
    "UPDATE learners SET xp = xp + ?, streak = ?, last_active_date = ? WHERE id = 1"
  ).run(xpEarned, newStreak, today);

  res.json({ stars, xpEarned, learner: getLearner() });
});

// Deduct a heart on a wrong answer (mirrors Duolingo's "lives" mechanic).
app.post("/api/hearts/lose", (req, res) => {
  const learner = getLearner();
  const hearts = Math.max(0, learner.hearts - 1);
  db.prepare("UPDATE learners SET hearts = ? WHERE id = 1").run(hearts);
  res.json({ hearts });
});

// Refill hearts (e.g. "practice to refill" or just a dev/reset button for now).
app.post("/api/hearts/refill", (req, res) => {
  db.prepare("UPDATE learners SET hearts = 5 WHERE id = 1").run();
  res.json({ hearts: 5 });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ CodeLingo API running at http://localhost:${PORT}`);
});
