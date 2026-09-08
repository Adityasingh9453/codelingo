import { useState } from "react";
import { playCorrect, playWrong } from "../sounds.js";

export default function QuestionCard({ question, color, onAnswered }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const isFillBlank = question.type === "fill_blank";
  const isCorrect = selected === question.answer;

  function choose(option) {
    if (revealed) return;
    const correct = option === question.answer;
    setSelected(option);
    setRevealed(true);
    if (correct) playCorrect();
    else playWrong();
    onAnswered(correct);
  }

  const promptParts = isFillBlank ? question.prompt.split("____") : null;

  return (
    <div className="mx-auto w-full max-w-lg">
      <p className="mb-4 font-body text-sm text-muted">
        {isFillBlank ? "Fill in the blank" : "Choose the correct answer"}
      </p>

      {isFillBlank ? (
        <pre className="mb-6 whitespace-pre-wrap rounded-xl border border-line bg-surface p-4 font-mono text-sm leading-relaxed text-offwhite">
          {promptParts[0]}
          <span
            className="mx-0.5 inline-block min-w-[3.5rem] rounded-md border-b-2 px-2 text-center font-semibold"
            style={{
              borderColor: color,
              backgroundColor: revealed ? (isCorrect ? "#6FCF6333" : "#EF5D5D33") : "#31333F55",
              color: revealed ? "#EDEDEF" : "transparent",
            }}
          >
            {selected || "____"}
          </span>
          {promptParts[1]}
        </pre>
      ) : (
        <p className="mb-6 font-display text-lg font-medium leading-snug text-offwhite">
          {question.prompt}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((option) => {
          const isSelected = selected === option;
          const showCorrect = revealed && option === question.answer;
          const showWrong = revealed && isSelected && option !== question.answer;
          return (
            <button
              key={option}
              disabled={revealed}
              onClick={() => choose(option)}
              className={`rounded-xl border-2 px-4 py-3 text-left font-mono text-sm transition-colors ${
                showCorrect
                  ? "border-xp bg-xp/10 text-xp"
                  : showWrong
                  ? "border-danger bg-danger/10 text-danger"
                  : "border-line bg-surface text-offwhite hover:border-muted"
              } ${revealed && !showCorrect && !showWrong ? "opacity-50" : ""}`}
            >
              {option === "" ? "(nothing)" : option}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div
          className={`mt-5 rounded-xl border p-4 text-sm ${
            isCorrect ? "border-xp/40 bg-xp/5 text-offwhite" : "border-danger/40 bg-danger/5 text-offwhite"
          }`}
        >
          <p className="font-display font-semibold">
            {isCorrect ? "Correct!" : `Not quite — the answer is "${question.answer || "(nothing)"}"`}
          </p>
          <p className="mt-1 text-muted">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
