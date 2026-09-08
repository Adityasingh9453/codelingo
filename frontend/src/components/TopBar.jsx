import { useNavigate } from "react-router-dom";

export default function TopBar({ learner, onBack }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-ink/95 px-5 py-3 backdrop-blur">
      <button
        onClick={onBack || (() => navigate("/"))}
        className="font-display text-lg font-semibold tracking-tight text-offwhite hover:text-xp transition-colors"
      >
        {"<"}CodeLingo{"/>"}
      </button>
      {learner && (
        <div className="flex items-center gap-4 font-mono text-sm">
          <span className="flex items-center gap-1.5 text-orange-400" title="Day streak">
            🔥 {learner.streak}
          </span>
          <span className="flex items-center gap-1.5 text-xp" title="Experience points">
            ⚡ {learner.xp} XP
          </span>
          <span className="flex items-center gap-1.5 text-danger" title="Hearts remaining">
            ♥ {learner.hearts}
          </span>
        </div>
      )}
    </header>
  );
}
