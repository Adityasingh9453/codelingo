import { DatabaseSync } from "node:sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath =
  process.env.NODE_ENV === "production"
    ? "/tmp/codelingo.db"
    : path.join(__dirname, "codelingo.db");

const db = new DatabaseSync(dbPath);
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

// ── Schema ─────────────────────────────────────────────────────────────────
db.exec(`
  -- Multi-user learners table (email + hashed password)
  CREATE TABLE IF NOT EXISTS learners (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    name              TEXT    NOT NULL,
    email             TEXT    NOT NULL UNIQUE,
    password_hash     TEXT    NOT NULL DEFAULT '',
    xp                INTEGER NOT NULL DEFAULT 0,
    hearts            INTEGER NOT NULL DEFAULT 5,
    streak            INTEGER NOT NULL DEFAULT 0,
    last_active_date  TEXT,
    created_at        TEXT    NOT NULL DEFAULT (date('now'))
  );

  -- lesson_progress is now per-user (learner_id FK)
  CREATE TABLE IF NOT EXISTS lesson_progress (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    learner_id   INTEGER NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    lesson_id    TEXT    NOT NULL,
    track_id     TEXT    NOT NULL,
    stars        INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT,
    UNIQUE(learner_id, lesson_id)
  );
`);

// ── Migration: if old single-row schema exists (id=1, no email col),
//    add the missing columns so existing data isn't lost.
//    This runs once and is idempotent.
try {
  db.exec(`ALTER TABLE learners ADD COLUMN email TEXT NOT NULL DEFAULT 'legacy@codelingo.app';`);
} catch (_) { /* column already exists — fine */ }
try {
  db.exec(`ALTER TABLE learners ADD COLUMN name TEXT NOT NULL DEFAULT 'Player';`);
} catch (_) { /* already exists */ }
try {
  db.exec(`ALTER TABLE learners ADD COLUMN password_hash TEXT NOT NULL DEFAULT '';`);
} catch (_) { /* already exists */ }
try {
  db.exec(`ALTER TABLE learners ADD COLUMN created_at TEXT NOT NULL DEFAULT (date('now'));`);
} catch (_) { /* already exists */ }
try {
  db.exec(`ALTER TABLE lesson_progress ADD COLUMN learner_id INTEGER NOT NULL DEFAULT 1;`);
  db.exec(`ALTER TABLE lesson_progress ADD COLUMN id INTEGER;`);
} catch (_) { /* already exists */ }

export default db;
