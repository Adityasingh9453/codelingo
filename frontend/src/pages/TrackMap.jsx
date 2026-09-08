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

  if (!track) return null;

  let globalIndex = 0;
  const allLessons = track.units.flatMap((u) => u.lessons);

  return (
    <div className="min-h-screen bg-ink">
      <TopBar learner={learner} onBack={() => navigate("/")} />

      <main className="mx-auto max-w-2xl px-5 py-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: track.color }} />
          <h1 className="font-display text-2xl font-bold text-offwhite">{track.name}</h1>
        </div>

        {track.units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <p className="mb-6 font-mono text-xs uppercase tracking-wide text-muted">
              {unit.title}
            </p>
            <div className="flex flex-col gap-14">
              {unit.lessons.map((lesson) => {
                const idx = globalIndex++;
                return (
                  <LessonNode
                    key={lesson.id}
                    lesson={lesson}
                    color={track.color}
                    index={idx}
                    isLast={idx === allLessons.length - 1}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
