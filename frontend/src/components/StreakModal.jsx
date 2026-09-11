// ── Week-day helper ────────────────────────────────────────────────────────────
// Returns an array of 7 objects for Mon–Sun of the current week,
// each marked as completed if it falls within the user's active streak window.
function getWeekDays(streak, lastActiveDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = lastActiveDate
    ? new Date(lastActiveDate + "T00:00:00")
    : null;
  if (lastActive) lastActive.setHours(0, 0, 0, 0);

  // Find the Monday of the current week
  const dow = today.getDay(); // 0 = Sunday
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));

  const NAMES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    const isToday = date.getTime() === today.getTime();
    const isFuture = date > today;

    let completed = false;
    if (lastActive && !isFuture) {
      const daysFromLastActive = Math.round(
        (lastActive.getTime() - date.getTime()) / 86_400_000
      );
      completed = daysFromLastActive >= 0 && daysFromLastActive < streak;
    }

    return { name: NAMES[i], isToday, isFuture, completed };
  });
}

// ── Day circle ────────────────────────────────────────────────────────────────
function DayCircle({ day, index }) {
  const { name, isToday, isFuture, completed } = day;

  const bg = completed
    ? "#FF9600"
    : isToday && !completed
    ? "#FF960022"
    : "#1C1E26";

  const border = completed || isToday ? "#FF9600" : "#31333F";

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-mono text-xs" style={{ color: isToday ? "#FF9600" : "#6B7280" }}>
        {name}
      </span>
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: 40,
          height: 40,
          backgroundColor: bg,
          border: `2.5px solid ${border}`,
          animation: completed
            ? `day-check 0.4s ${0.6 + index * 0.07}s ease-out both`
            : "none",
          opacity: completed ? 1 : isFuture ? 0.35 : 0.6,
        }}
      >
        {completed ? (
          <span style={{ fontSize: 18, color: "#fff", fontWeight: 900 }}>✓</span>
        ) : isFuture ? (
          <span style={{ fontSize: 12, color: "#6B7280" }}>—</span>
        ) : (
          <span style={{ fontSize: 10, color: "#FF9600" }}>·</span>
        )}
      </div>
    </div>
  );
}

// ── StreakModal ────────────────────────────────────────────────────────────────
export default function StreakModal({ learner, onContinue }) {
  const { streak = 0, last_active_date } = learner;
  const days = getWeekDays(streak, last_active_date);

  const speechText =
    streak >= 7
      ? `🏆 ${streak} day streak! You're on fire!`
      : streak >= 3
      ? `🔥 ${streak} days strong! Keep it up!`
      : streak === 1
      ? "Great start! Come back tomorrow to build your streak!"
      : "Start your streak — come back tomorrow!";

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-between bg-ink px-5 py-10">

      {/* Speech bubble */}
      <div
        className="relative rounded-2xl border border-line bg-surface px-6 py-3 text-center max-w-xs"
        style={{ animation: "slide-up-fade 0.4s ease-out both" }}
      >
        <p className="font-body text-sm text-offwhite">{speechText}</p>
        {/* Tail */}
        <span
          style={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            transform: "translate(-50%, 100%)",
            display: "block",
            width: 0,
            height: 0,
            borderLeft: "9px solid transparent",
            borderRight: "9px solid transparent",
            borderTop: "11px solid #1E2028",
          }}
        />
      </div>

      {/* Mascot + flame */}
      <div
        className="flex flex-col items-center"
        style={{ animation: "bounce-in 0.65s 0.1s ease-out both" }}
      >
        <div className="relative inline-flex">
          <span
            style={{
              fontSize: 90,
              lineHeight: 1,
              display: "block",
              animation: "float-bob 3s ease-in-out infinite",
            }}
          >
            🤖
          </span>
          <span
            style={{
              position: "absolute",
              top: -12,
              right: -14,
              fontSize: 44,
              animation: "float-bob 2.4s 0.4s ease-in-out infinite",
            }}
          >
            🔥
          </span>
        </div>

        {/* Big streak number */}
        <div style={{ animation: "streak-pop 0.7s 0.3s ease-out both" }}>
          <p
            className="font-display font-black text-center"
            style={{ fontSize: 100, lineHeight: 1, color: "#FF9600" }}
          >
            {streak}
          </p>
        </div>
        <p
          className="font-display text-2xl font-bold -mt-1"
          style={{ color: "#FF9600" }}
        >
          day streak
        </p>
      </div>

      {/* Week calendar */}
      <div
        className="flex gap-3 items-end"
        style={{ animation: "slide-up-fade 0.45s 0.55s ease-out both" }}
      >
        {days.map((d, i) => (
          <DayCircle key={d.name} day={d} index={i} />
        ))}
      </div>

      {/* CTA button */}
      <div
        className="w-full max-w-sm"
        style={{ animation: "slide-up-fade 0.45s 0.85s ease-out both" }}
      >
        <button
          onClick={onContinue}
          className="w-full rounded-2xl py-4 font-display text-lg font-black tracking-widest text-white transition-transform hover:scale-[1.03] active:scale-95"
          style={{
            backgroundColor: "#1CB0F6",
            boxShadow: "0 0 24px #1CB0F688, 0 6px 24px #1CB0F655",
          }}
        >
          I'M COMING BACK
        </button>
      </div>
    </div>
  );
}
