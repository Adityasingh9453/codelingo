import { useNavigate, Link } from "react-router-dom";

// Mini pill component for each stat
function StatPill({ icon, value, color, title }) {
  return (
    <span
      title={title}
      className="flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-sm font-semibold"
      style={{
        color,
        borderColor: `${color}44`,
        backgroundColor: `${color}11`,
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

      {/* Stats + dashboard link */}
      {learner && (
        <div className="flex items-center gap-2">
          <StatPill icon="🔥" value={learner.streak}      color="#FF9600" title={`${learner.streak}-day streak`} />
          <StatPill icon="⚡" value={`${learner.xp} XP`} color="#F5C242" title="Total XP earned" />
          <StatPill icon="♥"  value={learner.hearts}      color="#EF5D5D" title="Hearts remaining" />
          <Link
            to="/dashboard"
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-sm transition-colors hover:border-xp hover:text-xp"
            title="Your Dashboard"
          >
            👤
          </Link>
        </div>
      )}
    </header>
  );
}
