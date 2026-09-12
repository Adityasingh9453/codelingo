import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import LessonNode from "../components/LessonNode.jsx";
import { api } from "../api.js";

export default function TrackMap() {
  const { trackId } = useParams();
  const navigate = useNavigate();
  const [track, setTrack] = useState(null);
  const [learner, setLearner] = useState(null);

  useEffect(() => {
    api.getTrack(trackId).then(setTrack);
    api.getTracks().then((d) => setLearner(d.learner));
  }, [trackId]);

  if (!track) return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <p className="font-mono text-sm text-muted animate-pulse">Loading…</p>
    </div>
  );

  let globalIndex = 0;
  const allLessons = track.units.flatMap((u) => u.lessons);

  const completedCount = allLessons.filter((l) => l.stars > 0).length;
  const pct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-ink">
      <TopBar learner={learner} onBack={() => navigate("/")} />

      <main className="mx-auto max-w-lg px-4 pb-24">

        {/* ── Track Header ── */}
        <div
          className="sticky top-0 z-10 pt-6 pb-4"
          style={{
            background: "linear-gradient(to bottom, #0D1117 80%, transparent)",
            animation: "slide-up-fade 0.4s ease-out both",
          }}
        >
          {/* Color bar accent */}
          <div
            className="mb-4 h-1 w-20 rounded-full"
            style={{ backgroundColor: track.color }}
          />

          <div className="flex items-start justify-between">
            <div>
              <h1
                className="font-display text-3xl font-black text-offwhite"
                style={{ letterSpacing: "-0.5px" }}
              >
                {track.name}
              </h1>
              <p className="mt-1 font-body text-sm text-muted">{track.tagline}</p>
            </div>

            {/* Progress badge */}
            <div
              className="flex flex-col items-center justify-center rounded-2xl px-4 py-2 text-center"
              style={{
                backgroundColor: `${track.color}1A`,
                border: `1.5px solid ${track.color}44`,
              }}
            >
              <span
                className="font-display text-2xl font-black"
                style={{ color: track.color }}
              >
                {pct}%
              </span>
              <span className="font-mono text-[10px] text-muted uppercase tracking-wide">Done</span>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-raised">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, backgroundColor: track.color }}
            />
          </div>
          <p className="mt-1 font-mono text-[11px] text-muted">
            {completedCount} / {allLessons.length} lessons completed
          </p>
        </div>

        {/* ── Units & Lesson Map ── */}
        <div className="mt-6 space-y-14">
          {track.units.map((unit, unitIdx) => {
            const unitLessons = unit.lessons;
            return (
              <div key={unit.id}>
                {/* Unit banner */}
                <div
                  className="mb-10 flex items-center gap-3 rounded-2xl px-5 py-3"
                  style={{
                    backgroundColor: `${track.color}18`,
                    border: `1px solid ${track.color}30`,
                    animation: `slide-up-fade 0.4s ${unitIdx * 0.1}s ease-out both`,
                  }}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-black text-ink"
                    style={{ backgroundColor: track.color }}
                  >
                    {unitIdx + 1}
                  </div>
                  <div>
                    <p
                      className="font-mono text-[10px] uppercase tracking-widest"
                      style={{ color: track.color }}
                    >
                      Unit {unitIdx + 1}
                    </p>
                    <p className="font-display text-base font-bold text-offwhite leading-tight">
                      {unit.title}
                    </p>
                  </div>
                </div>

                {/* ── Lesson path (zigzag map) ── */}
                <div className="relative flex flex-col gap-20 pb-6">
                  {unitLessons.map((lesson) => {
                    const idx = globalIndex++;
                    return (
                      <LessonNode
                        key={lesson.id}
                        lesson={lesson}
                        color={track.color}
                        index={idx}
                        isLast={idx === allLessons.length - 1}
                        totalLessons={allLessons.length}
                      />
                    );
                  })}
                </div>

                {/* Unit completion divider */}
                {unitIdx < track.units.length - 1 && (
                  <div className="mt-10 flex items-center gap-3">
                    <div className="h-px flex-1 bg-line" />
                    <span className="font-mono text-[11px] text-muted uppercase tracking-widest">
                      Next Unit
                    </span>
                    <div className="h-px flex-1 bg-line" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── All done footer ── */}
        {pct === 100 && (
          <div
            className="mt-12 rounded-2xl p-6 text-center"
            style={{
              backgroundColor: `${track.color}1A`,
              border: `2px solid ${track.color}44`,
              animation: "bounce-in 0.6s ease-out both",
            }}
          >
            <p className="text-4xl mb-2">🏆</p>
            <p className="font-display text-xl font-black text-offwhite">Track Complete!</p>
            <p className="mt-1 font-body text-sm text-muted">
              You've mastered all {allLessons.length} lessons in {track.name}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
