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
// One row per learner. We keep this simple (single local learner) for now,
// but the shape already supports multiple users if you add real auth later.
db.exec(`
  CREATE TABLE IF NOT EXISTS learners (
    id INTEGER PRIMARY KEY CHECK (id = 1), -- single local learner, always id=1
    xp INTEGER NOT NULL DEFAULT 0,
    hearts INTEGER NOT NULL DEFAULT 5,
    streak INTEGER NOT NULL DEFAULT 0,
    last_active_date TEXT
  );

  CREATE TABLE IF NOT EXISTS lesson_progress (
    lesson_id TEXT PRIMARY KEY,
    track_id TEXT NOT NULL,
    stars INTEGER NOT NULL DEFAULT 0,      -- 0 = not started, 1-3 = completed with score
    completed_at TEXT
  );

  INSERT OR IGNORE INTO learners (id, xp, hearts, streak, last_active_date)
  VALUES (1, 0, 5, 0, NULL);
`);

export default db;
