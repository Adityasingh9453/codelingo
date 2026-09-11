import { useNavigate, Link } from "react-router-dom";

// On mobile: show only icon. On sm+: show icon + value text.
function StatPill({ icon, value, color, title }) {
  return (
    <span
      title={title}
      className="flex items-center gap-1 rounded-full border px-2 py-1 sm:px-3 font-mono text-xs sm:text-sm font-semibold"
      style={{
        color,
        borderColor: `${color}44`,
        backgroundColor: `${color}11`,
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      {/* Value text hidden on very small screens */}
      <span className="hidden xs:inline sm:inline">{value}</span>
    </span>
  );
}

export default function TopBar({ learner, onBack }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-ink/95 px-4 py-3 backdrop-blur">
      {/* Logo / back button */}
      <button
        onClick={onBack || (() => navigate("/"))}
        className="font-display text-base sm:text-lg font-semibold tracking-tight text-offwhite transition-colors hover:text-xp shrink-0"
      >
        {"<"}CodeLingo{"/>"}
      </button>

      {/* Stats + dashboard link */}
      {learner && (
        <div className="flex items-center gap-1.5 sm:gap-2 ml-2 min-w-0">
          <StatPill icon="🔥" value={learner.streak}      color="#FF9600" title={`${learner.streak}-day streak`} />
          <StatPill icon="⚡" value={`${learner.xp} XP`} color="#F5C242" title="Total XP earned" />
          <StatPill icon="♥"  value={learner.hearts}      color="#EF5D5D" title="Hearts remaining" />
          <Link
            to="/dashboard"
            className="ml-1 flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-sm transition-colors hover:border-xp hover:text-xp"
            title="Your Dashboard"
          >
            👤
          </Link>
        </div>
      )}
    </header>
  );
}
