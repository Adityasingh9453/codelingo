import { useNavigate } from "react-router-dom";

// Mini pill component for each stat
function StatPill({ icon, value, color, title, animate }) {
  return (
    <span
      title={title}
      className="flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-sm font-semibold transition-transform"
      style={{
        color,
        borderColor: `${color}44`,
        backgroundColor: `${color}11`,
        animation: animate ? "xp-bump 0.35s ease-out" : "none",
      }}
    >
      <span style={{ fontSize: 15 }}>{icon}</span>
      {value}
    </span>
  );
}

export default function TopBar({ learner, onBack }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-ink/95 px-5 py-3 backdrop-blur">
      {/* Logo / back button */}
      <button
        onClick={onBack || (() => navigate("/"))}
        className="font-display text-lg font-semibold tracking-tight text-offwhite transition-colors hover:text-xp"
      >
        {"<"}CodeLingo{"/>"}
      </button>

      {/* Stats pills */}
      {learner && (
        <div className="flex items-center gap-2">
          <StatPill
            icon="🔥"
            value={learner.streak}
            color="#FF9600"
            title={`${learner.streak}-day streak`}
          />
          <StatPill
            icon="⚡"
            value={`${learner.xp} XP`}
            color="#F5C242"
            title="Total XP earned"
          />
          <StatPill
            icon="♥"
            value={learner.hearts}
            color="#EF5D5D"
            title="Hearts remaining"
          />
        </div>
      )}
    </header>
  );
}
