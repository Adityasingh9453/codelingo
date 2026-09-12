import { useMemo } from "react";

// ── Confetti ──────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = [
  "#F5C242", "#6FCF63", "#6C8CFF", "#F2A65A",
  "#E2725B", "#58CC02", "#1CB0F6", "#EDEDEF",
];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 1.6,
        dur: 2.4 + Math.random() * 2,
        size: 7 + Math.random() * 9,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        isCircle: i % 3 !== 0,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? "50%" : "3px",
            animation: `confetti-fall ${p.dur}s ${p.delay}s ease-in both`,
          }}
        />
      ))}
    </div>
  );
}

// ── Headline copy based on star count ─────────────────────────────────────────
const HEADLINES = [
  { stars: 3, title: "PERFECT! 🎉",    sub: "Flawless run! You're a coding machine!" },
  { stars: 2, title: "GREAT JOB! 💪",  sub: "Strong work! Keep pushing forward!" },
  { stars: 1, title: "GOOD EFFORT! 🚀", sub: "Every lesson makes you sharper!" },
  { stars: 0, title: "YOU FINISHED! 🙌", sub: "Completion counts. Come back stronger!" },
];

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, borderColor, bgColor, textColor, delay }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 rounded-2xl border-2 py-5 px-3"
      style={{
        borderColor,
        backgroundColor: bgColor,
        animation: `slide-up-fade 0.45s ${delay}s ease-out both`,
      }}
    >
      <span
        className="font-mono text-xs font-bold tracking-widest"
        style={{ color: textColor }}
      >
        {label}
      </span>
      <span
        className="font-display text-2xl font-black"
        style={{ color: textColor }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function LessonComplete({
  result,
  correctCount,
  totalQuestions,
  elapsedSecs,
  color,
  onClaim,
}) {
  const { stars, xpEarned } = result;
  const accuracy =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const mins = Math.floor(elapsedSecs / 60);
  const secs = elapsedSecs % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;

  const headline = HEADLINES.find((h) => h.stars === stars) || HEADLINES[3];

  const accuracyLabel = accuracy === 100 ? "PERFECT" : accuracy >= 90 ? "GREAT" : accuracy >= 70 ? "GOOD" : "OKAY";

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-between bg-ink px-5 py-8 overflow-y-auto">
      <Confetti />

      {/* ── TOP: mascot + stars + headline ── */}
      <div
        className="flex flex-col items-center gap-3 mt-2"
        style={{ animation: "bounce-in 0.65s ease-out both" }}
      >
        {/* Mascot bubble */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 148,
            height: 148,
            background: `radial-gradient(circle at 38% 38%, ${color}44, ${color}11)`,
            border: `3px solid ${color}55`,
            animation: "float-bob 3s ease-in-out infinite",
            boxShadow: `0 0 40px ${color}33`,
          }}
        >
          <span style={{ fontSize: 84, lineHeight: 1, display: "block" }}>🤖</span>
        </div>

        {/* Stars */}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              style={{
                fontSize: 34,
                animation: `slide-up-fade 0.4s ${s * 0.1}s ease-out both`,
                filter:
                  s <= stars
                    ? "drop-shadow(0 0 10px #F5C242)"
                    : "grayscale(1) opacity(0.25)",
                color: s <= stars ? "#F5C242" : "#4A4D5E",
              }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Text */}
        <div
          className="text-center px-4"
          style={{ animation: "slide-up-fade 0.45s 0.25s ease-out both" }}
        >
          <h1 className="font-display text-3xl font-black text-offwhite leading-tight">
            {headline.title}
          </h1>
          <p className="mt-1 font-body text-sm text-muted">{headline.sub}</p>
        </div>
      </div>

      {/* ── MIDDLE: stat cards ── */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        <StatCard
          label="TOTAL XP"
          value={`⚡ ${xpEarned}`}
          borderColor="#F5C24266"
          bgColor="#F5C24211"
          textColor="#F5C242"
          delay={0.45}
        />
        <StatCard
          label={accuracyLabel}
          value={`🎯 ${accuracy}%`}
          borderColor="#6FCF6366"
          bgColor="#6FCF6311"
          textColor="#6FCF63"
          delay={0.55}
        />
        <StatCard
          label="TIME"
          value={`⏱ ${timeStr}`}
          borderColor="#6C8CFF66"
          bgColor="#6C8CFF11"
          textColor="#6C8CFF"
          delay={0.65}
        />
      </div>

      {/* ── BOTTOM: CLAIM button ── */}
      <div
        className="w-full max-w-sm"
        style={{ animation: "slide-up-fade 0.45s 0.75s ease-out both" }}
      >
        <button
          onClick={onClaim}
          className="w-full rounded-2xl py-4 font-display text-lg font-black tracking-widest text-white transition-transform hover:scale-[1.03] active:scale-95"
          style={{
            backgroundColor: color,
            boxShadow: `0 4px 16px ${color}44`,
          }}
        >
          CLAIM XP
        </button>
      </div>
    </div>
  );
}
