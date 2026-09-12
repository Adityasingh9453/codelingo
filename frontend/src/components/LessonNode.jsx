import { useNavigate } from "react-router-dom";

const OFFSETS = [0, 80, 130, 80, 0, -80, -130, -80]; // snake path horizontal offsets

export default function LessonNode({ lesson, color, index, isLast, totalLessons }) {
  const navigate = useNavigate();
  const locked = !lesson.unlocked;
  const done = lesson.stars > 0;

  // Zigzag horizontal offset for map-like snake path
  const xOffset = OFFSETS[index % OFFSETS.length];

  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        marginLeft: `calc(50% + ${xOffset}px - 48px)`,
        animation: `slide-up-fade 0.4s ${index * 0.07}s ease-out both`,
      }}
    >
      {/* ── Connector line upward (SVG curved path) ── */}
      {index > 0 && (
        <svg
          className="absolute"
          style={{ top: -72, left: "50%", transform: "translateX(-50%)", overflow: "visible" }}
          width="4"
          height="72"
          viewBox="0 0 4 72"
        >
          <line
            x1="2" y1="0" x2="2" y2="72"
            stroke={done ? color : "#2A3145"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={done ? "none" : "8 6"}
          />
        </svg>
      )}

      {/* ── Node button ── */}
      <button
        disabled={locked}
        onClick={() => navigate(`/lesson/${lesson.id}`)}
        className={`relative flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 font-display font-black transition-all duration-200 ${
          locked
            ? "cursor-not-allowed border-line bg-surface text-muted"
            : done
            ? "cursor-pointer border-white/20 text-ink hover:scale-110 active:scale-95"
            : "cursor-pointer border-white/30 text-ink hover:scale-110 active:scale-95"
        }`}
        style={
          locked
            ? { boxShadow: "none" }
            : {
                backgroundColor: color,
                boxShadow: `0 0 0 6px ${color}33, 0 8px 24px ${color}55`,
              }
        }
        aria-label={lesson.title}
      >
        {locked ? (
          <span className="text-3xl">🔒</span>
        ) : done ? (
          <span className="text-4xl">✦</span>
        ) : (
          <span className="text-3xl font-black" style={{ color: "#0D1117" }}>
            {index + 1}
          </span>
        )}

        {/* Pulse ring on active (next to complete) */}
        {!locked && !done && (
          <span
            className="pointer-events-none absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ backgroundColor: color }}
          />
        )}
      </button>

      {/* ── Stars ── */}
      <div className="mt-2 flex gap-0.5">
        {[1, 2, 3].map((s) => (
          <span
            key={s}
            className="text-sm"
            style={{ color: s <= lesson.stars ? "#F5C242" : "#2A3145" }}
          >
            ★
          </span>
        ))}
      </div>

      {/* ── Title ── */}
      <p
        className="mt-1 max-w-[9rem] text-center font-body text-xs font-medium leading-tight"
        style={{ color: locked ? "#4A5568" : "#E8EDF5" }}
      >
        {lesson.title}
      </p>
    </div>
  );
}
