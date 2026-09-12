import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import TopBar from "../components/TopBar.jsx";
import Footer from "../components/Footer.jsx";

// XP → Level helper
function xpToLevel(xp) {
  const level = Math.floor(xp / 100) + 1;
  const progress = xp % 100;
  return { level, progress };
}

// Short label for track icon badge
const TRACK_LABELS = {
  html: "HTM",
  css: "CSS",
  js: "JS",
  c: "C",
  cpp: "C++",
  python: "Py",
  java: "Java",
};
function trackLabel(t) {
  return TRACK_LABELS[t.id] ?? t.name.slice(0, 3);
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, delay = 0 }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 rounded-2xl border-2 py-5 px-3"
      style={{
        borderColor: `${color}44`,
        backgroundColor: `${color}0D`,
        animation: `slide-up-fade 0.45s ${delay}s ease-out both`,
      }}
    >
      <span style={{ fontSize: 28 }}>{icon}</span>
      <span className="font-display text-2xl font-black" style={{ color }}>
        {value}
      </span>
      <span className="font-mono text-xs text-muted tracking-wider">{label}</span>
    </div>
  );
}

// ── Leaderboard row ────────────────────────────────────────────────────────────
function LeaderRow({ user, rank, isSelf }) {
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors"
      style={{
        backgroundColor: isSelf ? "#58CC0215" : "transparent",
        border: isSelf ? "1px solid #58CC0244" : "1px solid transparent",
        animation: `slide-up-fade 0.4s ${rank * 0.05}s ease-out both`,
      }}
    >
      <span className="w-7 text-center font-mono text-sm text-muted">
        {medal || `#${rank}`}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-offwhite truncate">
          {user.name} {isSelf && <span className="text-xp text-xs">(you)</span>}
        </p>
        <p className="font-mono text-xs text-muted">🔥 {user.streak} day streak</p>
      </div>
      <span
        className="font-mono text-sm font-bold"
        style={{ color: "#F5C242" }}
      >
        ⚡ {user.xp} XP
      </span>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [learner, setLearner]       = useState(null);
  const [tracks, setTracks]         = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([api.me(), api.getTracks(), api.getLeaderboard()])
      .then(([meRes, tracksRes, lbRes]) => {
        setLearner(meRes.learner);
        setTracks(tracksRes.tracks);
        setLeaderboard(lbRes.leaderboard);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <p className="font-mono text-sm text-muted animate-pulse">Loading…</p>
      </div>
    );
  }

  const { level, progress } = xpToLevel(learner?.xp || 0);
  const myRank = leaderboard.findIndex((u) => u.id === learner?.id) + 1;

  return (
    <div className="min-h-screen bg-ink">
      <TopBar learner={learner} />

      <main className="mx-auto max-w-2xl px-6 py-8 space-y-8">

        {/* ── Header ── */}
        <div
          className="flex items-center justify-between"
          style={{ animation: "slide-up-fade 0.4s ease-out both" }}
        >
          <div>
            <p className="font-body text-xs text-muted uppercase tracking-wide">Your Stats</p>
            <h1 className="font-display text-2xl font-black text-offwhite mt-0.5">
              Hey, {learner?.name?.split(" ")[0]} 👋
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl border border-line px-4 py-2 font-mono text-xs text-muted hover:text-danger hover:border-danger/40 transition-colors"
          >
            Log out
          </button>
        </div>

        {/* ── Level + XP bar ── */}
        <div
          className="rounded-2xl border border-line bg-surface p-5"
          style={{ animation: "slide-up-fade 0.4s 0.1s ease-out both" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-mono text-xs text-muted">LEVEL</p>
              <p className="font-display text-3xl font-black text-xp">{level}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs text-muted">TOTAL XP</p>
              <p className="font-display text-xl font-black text-yellow-400">
                ⚡ {learner?.xp}
              </p>
            </div>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-raised">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #58CC02, #89E219)",
                boxShadow: "0 0 8px #5CB85C44",
              }}
            />
          </div>
          <p className="mt-1.5 text-right font-mono text-xs text-muted">
            {progress} / 100 XP to Level {level + 1}
          </p>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon="🔥" label="STREAK"  value={`${learner?.streak}d`}  color="#FF9600" delay={0.15} />
          <StatCard icon="♥"  label="HEARTS"  value={learner?.hearts}         color="#EF5D5D" delay={0.2} />
          <StatCard icon="🏆" label="RANK"    value={myRank > 0 ? `#${myRank}` : "—"} color="#6C8CFF" delay={0.25} />
        </div>

        {/* ── Track progress ── */}
        <div style={{ animation: "slide-up-fade 0.4s 0.3s ease-out both" }}>
          <h2 className="font-display text-lg font-bold text-offwhite mb-3">
            📚 Track Progress
          </h2>
          <div className="space-y-3">
            {tracks.map((t) => {
              const pct = t.totalLessons > 0
                ? Math.round((t.completedLessons / t.totalLessons) * 100)
                : 0;
              return (
                <div
                  key={t.id}
                  onClick={() => navigate(`/track/${t.id}`)}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 cursor-pointer hover:border-muted transition-colors"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-xs font-black text-ink"
                    style={{ backgroundColor: t.color }}
                  >
                    {trackLabel(t)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-display font-semibold text-offwhite">{t.name}</p>
                      <p className="font-mono text-xs text-muted">
                        {t.completedLessons}/{t.totalLessons}
                      </p>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-raised">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: t.color }}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-xs text-muted">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Leaderboard ── */}
        <div style={{ animation: "slide-up-fade 0.4s 0.4s ease-out both" }}>
          <h2 className="font-display text-lg font-bold text-offwhite mb-3">
            🏆 Leaderboard
          </h2>
          <div className="rounded-2xl border border-line bg-surface overflow-hidden">
            {leaderboard.length === 0 ? (
              <p className="px-5 py-6 text-center font-body text-sm text-muted">
                No one here yet — be the first to earn XP!
              </p>
            ) : (
              <div className="divide-y divide-line">
                {leaderboard.map((u, i) => (
                  <LeaderRow
                    key={u.id}
                    user={u}
                    rank={i + 1}
                    isSelf={u.id === learner?.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Continue learning CTA ── */}
        <div style={{ animation: "slide-up-fade 0.4s 0.5s ease-out both" }}>
          <button
            onClick={() => navigate("/")}
            className="w-full rounded-2xl py-4 font-display text-base font-black tracking-wide text-ink transition-transform hover:scale-[1.02] active:scale-95"
            style={{ backgroundColor: "#5CB85C", boxShadow: "0 4px 14px #5CB85C33" }}
          >
            Continue Learning →
          </button>
        </div>

      </main>
      <Footer />
    </div>
  );
}
