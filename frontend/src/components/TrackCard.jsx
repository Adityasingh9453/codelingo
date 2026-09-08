import { useNavigate } from "react-router-dom";

export default function TrackCard({ track }) {
  const navigate = useNavigate();
  const pct = track.totalLessons
    ? Math.round((track.completedLessons / track.totalLessons) * 100)
    : 0;

  return (
    <button
      onClick={() => navigate(`/track/${track.id}`)}
      className="group relative flex flex-col items-start gap-3 rounded-xl border border-line bg-surface p-5 text-left transition-all hover:-translate-y-0.5 hover:border-transparent"
      style={{ "--track-color": track.color }}
    >
      {/* left edge accent, like a PCB module connector */}
      <span
        className="absolute left-0 top-4 bottom-4 w-1 rounded-full"
        style={{ backgroundColor: track.color }}
      />
      <div className="pl-2">
        <h3 className="font-display text-xl font-semibold text-offwhite">{track.name}</h3>
        <p className="mt-1 font-mono text-xs text-muted">// {track.tagline}</p>
      </div>

      <div className="w-full pl-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-raised">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: track.color }}
          />
        </div>
        <p className="mt-1.5 font-mono text-[11px] text-muted">
          {track.completedLessons}/{track.totalLessons} lessons
        </p>
      </div>
    </button>
  );
}
