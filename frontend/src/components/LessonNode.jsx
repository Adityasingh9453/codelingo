import { useNavigate } from "react-router-dom";

const STAR_CHARS = ["", "★☆☆", "★★☆", "★★★"];

export default function LessonNode({ lesson, color, index, isLast }) {
  const navigate = useNavigate();
  const align = index % 2 === 0 ? "self-start" : "self-end";
  const locked = !lesson.unlocked;

  return (
    <div className={`relative flex w-1/2 flex-col items-center ${align}`}>
      <button
        disabled={locked}
        onClick={() => navigate(`/lesson/${lesson.id}`)}
        className={`flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-2 font-display text-sm font-semibold transition-transform ${
          locked
            ? "cursor-not-allowed border-line bg-surface text-muted"
            : "border-transparent text-ink hover:scale-105 active:scale-95"
        }`}
        style={locked ? {} : { backgroundColor: color }}
      >
        {locked ? "🔒" : lesson.stars > 0 ? "✓" : index + 1}
      </button>
      <p className="mt-2 max-w-[8rem] text-center font-body text-xs text-offwhite">
        {lesson.title}
      </p>
      {lesson.stars > 0 && (
        <p className="font-mono text-[10px] text-yellow-400">{STAR_CHARS[lesson.stars]}</p>
      )}
      {!isLast && (
        <span
          aria-hidden
          className="absolute top-20 h-16 w-8 border-b-2 border-dashed border-line"
          style={{
            [index % 2 === 0 ? "left" : "right"]: "2.4rem",
            borderRight: index % 2 === 0 ? "2px dashed #31333F" : "none",
            borderLeft: index % 2 !== 0 ? "2px dashed #31333F" : "none",
          }}
        />
      )}
    </div>
  );
}
