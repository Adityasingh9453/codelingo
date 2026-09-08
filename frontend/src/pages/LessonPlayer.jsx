import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import QuestionCard from "../components/QuestionCard.jsx";
import { api } from "../api.js";
import { playHeartLost, playLessonComplete, playClick } from "../sounds.js";

export default function LessonPlayer() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [learner, setLearner] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [canAdvance, setCanAdvance] = useState(false);
  const [result, setResult] = useState(null); // set once the lesson is complete

  useEffect(() => {
    api.getLesson(lessonId).then(setLesson);
    api.getTracks().then((d) => setLearner(d.learner));
  }, [lessonId]);

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
      const res = await api.completeLesson(lessonId, {
        correctCount,
        totalQuestions: lesson.questions.length,
        trackId: lesson.trackId,
      });
      playLessonComplete();
      setResult(res);
      setLearner(res.learner);
    }
  }

  if (!lesson) return null;

  if (result) {
    return (
      <div className="min-h-screen bg-ink">
        <TopBar learner={learner} onBack={() => navigate(`/track/${lesson.trackId}`)} />
        <main className="mx-auto flex max-w-lg flex-col items-center px-5 py-20 text-center">
          <p className="font-mono text-sm text-muted">// lesson complete</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-offwhite">
            {"★".repeat(result.stars)}
            {"☆".repeat(3 - result.stars)}
          </h1>
          <p className="mt-4 font-body text-offwhite">
            {correctCount}/{lesson.questions.length} correct — you earned{" "}
            <span className="font-mono text-xp">+{result.xpEarned} XP</span>
          </p>
          <button
            onClick={() => navigate(`/track/${lesson.trackId}`)}
            className="mt-8 rounded-xl px-6 py-3 font-display font-semibold text-ink transition-transform hover:scale-105"
            style={{ backgroundColor: lesson.trackColor }}
          >
            Continue
          </button>
        </main>
      </div>
    );
  }

  const question = lesson.questions[qIndex];
  const progressPct = Math.round((qIndex / lesson.questions.length) * 100);

  return (
    <div className="min-h-screen bg-ink">
      <TopBar learner={learner} onBack={() => navigate(`/track/${lesson.trackId}`)} />

      <div className="mx-auto max-w-lg px-5 pt-6">
        <div className="h-2 w-full overflow-hidden rounded-full bg-raised">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progressPct}%`, backgroundColor: lesson.trackColor }}
          />
        </div>
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
            className="mt-6 w-full rounded-xl py-3 font-display font-semibold text-ink transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: lesson.trackColor }}
          >
            {qIndex + 1 < lesson.questions.length ? "Continue" : "Finish lesson"}
          </button>
        )}
      </main>
    </div>
  );
}
