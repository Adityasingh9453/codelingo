import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import QuestionCard from "../components/QuestionCard.jsx";
import LessonComplete from "../components/LessonComplete.jsx";
import StreakModal from "../components/StreakModal.jsx";
import { api } from "../api.js";
import { playHeartLost, playLessonComplete, playClick } from "../sounds.js";

// phase: "playing" → "claiming" → "streaking"
export default function LessonPlayer() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson]           = useState(null);
  const [learner, setLearner]         = useState(null);
  const [qIndex, setQIndex]           = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [canAdvance, setCanAdvance]   = useState(false);
  const [result, setResult]           = useState(null);
  const [phase, setPhase]             = useState("playing"); // "playing" | "claiming" | "streaking"

  // Timer — records the epoch ms when the lesson content first mounts
  const startTimeRef = useRef(null);
  const [elapsedSecs, setElapsedSecs] = useState(0);

  useEffect(() => {
    api.getLesson(lessonId).then(setLesson);
    api.getTracks().then((d) => setLearner(d.learner));
  }, [lessonId]);

  // Start the timer once the lesson data arrives
  useEffect(() => {
    if (lesson && !startTimeRef.current) {
      startTimeRef.current = Date.now();
    }
  }, [lesson]);

  async function handleAnswered(wasCorrect) {
    setCanAdvance(true);
    if (wasCorrect) {
      setCorrectCount((c) => c + 1);
    } else {
      playHeartLost();
      const { hearts } = await api.loseHeart();
      setLearner((l) => (l ? { ...l, hearts } : l));
    }
  }

  async function handleNext() {
    setCanAdvance(false);
    if (qIndex + 1 < lesson.questions.length) {
      setQIndex((i) => i + 1);
    } else {
      // Calculate elapsed seconds before making the API call
      const elapsed = Math.round((Date.now() - (startTimeRef.current || Date.now())) / 1000);
      setElapsedSecs(elapsed);

      const res = await api.completeLesson(lessonId, {
        correctCount,
        totalQuestions: lesson.questions.length,
        trackId: lesson.trackId,
      });
      playLessonComplete();
      setResult(res);
      setLearner(res.learner);
      setPhase("claiming");
    }
  }

  function handleClaim() {
    setPhase("streaking");
  }

  function handleContinue() {
    navigate(`/track/${lesson.trackId}`);
  }

  // ── Guard: lesson not loaded yet ──────────────────────────────────────────
  if (!lesson) return null;

  // ── Phase: CLAIMING (XP claim screen) ────────────────────────────────────
  if (phase === "claiming" && result) {
    return (
      <LessonComplete
        result={result}
        correctCount={correctCount}
        totalQuestions={lesson.questions.length}
        elapsedSecs={elapsedSecs}
        color={lesson.trackColor}
        onClaim={handleClaim}
      />
    );
  }

  // ── Phase: STREAKING (streak celebration screen) ──────────────────────────
  if (phase === "streaking" && result) {
    return (
      <StreakModal
        learner={result.learner}
        onContinue={handleContinue}
      />
    );
  }

  // ── Phase: PLAYING (normal question player) ───────────────────────────────
  const question = lesson.questions[qIndex];
  const progressPct = Math.round((qIndex / lesson.questions.length) * 100);

  return (
    <div className="min-h-screen bg-ink">
      <TopBar learner={learner} onBack={() => navigate(`/track/${lesson.trackId}`)} />

      {/* Progress bar */}
      <div className="mx-auto max-w-lg px-5 pt-6">
        <div className="h-2 w-full overflow-hidden rounded-full bg-raised">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, backgroundColor: lesson.trackColor }}
          />
        </div>
        <p className="mt-1.5 text-right font-mono text-xs text-muted">
          {qIndex + 1} / {lesson.questions.length}
        </p>
      </div>

      <main className="mx-auto max-w-lg px-5 py-10">
        <QuestionCard
          key={question.id}
          question={question}
          color={lesson.trackColor}
          onAnswered={handleAnswered}
        />

        {canAdvance && (
          <button
            onClick={() => { playClick(); handleNext(); }}
            className="mt-6 w-full rounded-xl py-3 font-display font-semibold text-ink transition-transform hover:scale-[1.02] active:scale-95"
            style={{ backgroundColor: lesson.trackColor }}
          >
            {qIndex + 1 < lesson.questions.length ? "Continue" : "Finish lesson"}
          </button>
        )}
      </main>
    </div>
  );
}
