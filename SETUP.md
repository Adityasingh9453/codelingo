# CodeLingo — Setup Guide

A Duolingo-style app for learning the basic syntax of C, C++, Python, and Java.
Two pieces run at the same time on your computer:

- **backend/** — a small server (Node + Express + SQLite) that stores lessons and your progress
- **frontend/** — the website you actually see and click around in (React)

They talk to each other over `localhost`, so nothing goes to the internet. Everything runs on your machine.

---

## 1. Install Node.js (one-time setup)

Node.js is what runs both the backend server and the frontend build tools.

1. Go to **https://nodejs.org**
2. Download the **LTS** version (the button on the left, currently 22.x) for your OS (Windows/Mac/Linux)
3. Run the installer, clicking "Next" through the defaults
4. Open a terminal:
   - **Windows:** press the Start key, type `cmd`, hit Enter (or use "PowerShell")
   - **Mac:** press `Cmd + Space`, type `Terminal`, hit Enter
5. Check it installed correctly by typing:
   ```
   node -v
   npm -v
   ```
   You should see version numbers (e.g. `v22.x.x` and `10.x.x`). If you see "command not found", restart your terminal, and if it still fails, restart your computer.

---

## 2. Get the project files

Unzip the `codelingo.zip` file you downloaded somewhere easy to find, like your Desktop. You should end up with a folder structured like this:

```
codelingo/
  backend/
  frontend/
  SETUP.md   <- this file
```

---

## 3. Run the backend (the server)

You need **two terminal windows open at the same time** for this project — one for the backend, one for the frontend. Let's do the backend first.

1. Open a terminal
2. Navigate into the backend folder. Replace the path below with wherever you unzipped it:
   ```
   cd Desktop/codelingo/backend
   ```
3. Install its dependencies (only needed once):
   ```
   npm install
   ```
   This downloads the small number of packages the server needs (Express, SQLite, CORS). It'll take under a minute.
4. Start the server:
   ```
   npm start
   ```
5. You should see:
   ```
   ✅ CodeLingo API running at http://localhost:4000
   ```
   **Leave this terminal window open** — closing it stops the server. A file called `codelingo.db` will appear in the backend folder the first time it runs; that's your local database (all your XP, streaks, and progress live in that one file).

---

## 4. Run the frontend (the website)

1. Open a **second, separate** terminal window (don't close the first one!)
2. Navigate into the frontend folder:
   ```
   cd Desktop/codelingo/frontend
   ```
3. Install its dependencies (only needed once):
   ```
   npm install
   ```
4. Start it:
   ```
   npm run dev
   ```
5. You'll see something like:
   ```
   ➜  Local:   http://localhost:5173/
   ```
6. Open that link (`http://localhost:5173`) in your web browser (Chrome, Firefox, etc). That's your app!

From now on, every time you want to work on or use the app, you just repeat steps 3–4 for the backend and 4 for the frontend (you can skip `npm install` after the first time) — two terminals, two `npm` commands, then open the browser link.

---

## 5. How it's organized (so you can extend it)

```
backend/
  server.js          <- API routes (list tracks, get a lesson, submit answers)
  db.js              <- SQLite database setup (progress, XP, hearts, streak)
  data/lessons.json   <- ALL the lesson content lives here as plain JSON
  codelingo.db        <- auto-created; your local save file

frontend/
  src/
    pages/
      Home.jsx         <- track selection screen
      TrackMap.jsx      <- the winding lesson path for one language
      LessonPlayer.jsx  <- runs through a lesson's questions
    components/
      QuestionCard.jsx  <- renders MCQ / fill-in-the-blank questions
      LessonNode.jsx    <- one node on the lesson path
      TrackCard.jsx     <- one language card on the home screen
      TopBar.jsx        <- XP / streak / hearts bar
    api.js              <- talks to the backend
```

### Adding your own lessons or questions

Everything a learner sees comes from **`backend/data/lessons.json`**. To add a new lesson, unit, or question, just add a new JSON entry following the existing pattern — no code changes needed. Two question types are supported:

```json
{
  "id": "unique-id",
  "type": "mcq",
  "prompt": "Which keyword declares a constant in C++?",
  "options": ["const", "final", "fixed", "static"],
  "answer": "const",
  "explanation": "const marks a variable as unmodifiable after initialization."
}
```

```json
{
  "id": "unique-id",
  "type": "fill_blank",
  "prompt": "int ____() {\n    return 0;\n}",
  "options": ["main", "void", "hello", "start"],
  "answer": "main",
  "explanation": "main() is the entry point of a C program."
}
```

For `fill_blank`, put `____` (4 underscores) exactly where the blank should appear in the code. Restart the backend (`Ctrl+C` then `npm start` again) after editing the JSON to pick up changes.

To add a whole new **track** (language), copy one of the existing track objects in `lessons.json` (like the `"c"` one) and change its `id`, `name`, `tagline`, `color`, and content. It'll automatically show up on the home screen — no frontend code changes needed.

---

## 6. Where things stand / good next steps

This version deliberately keeps things simple to get you running fast:

- **Single local learner** — there's no login system yet. Progress is stored in `backend/codelingo.db` for "whoever is using the browser." If you want real accounts later, you'd add a `users` table and a login flow (e.g. with a library like `passport` or `lucia-auth`), and tag `lesson_progress` rows with a `user_id`.
- **Questions are MCQ / fill-in-the-blank only** — no code actually executes. If you later want real code-running exercises (like HackerRank/LeetCode style), that needs a sandboxed execution service (e.g. Judge0, or Docker containers per submission) — that's a meaningfully bigger project, happy to help with it when you're ready.
- **Not deployed anywhere yet** — it only runs on your machine right now. When you're ready to put it online, the frontend (a static site) deploys easily to something like Vercel or Netlify, and the backend (Node + SQLite) deploys to something like Render or Railway. SQLite is fine for a solo project but you'd likely swap to Postgres if multiple real users start using it.

### Quick troubleshooting

| Problem | Fix |
|---|---|
| "command not found: npm" | Node.js isn't installed correctly — repeat step 1, then restart your terminal |
| Home page says "Couldn't reach the API" | The backend terminal isn't running, or you closed it — repeat step 3 |
| Port already in use | Something else is using port 4000 or 5173 — close other terminals running this project, or restart your computer |
| Changes to `lessons.json` don't show up | Stop the backend (`Ctrl+C` in its terminal) and run `npm start` again |
