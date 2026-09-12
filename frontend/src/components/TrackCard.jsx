import { useNavigate } from "react-router-dom";

// ── Language logo SVGs ────────────────────────────────────────────────────────
const LOGOS = {
  c: (
    <svg viewBox="0 0 128 128" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
      <path fill="#03599C" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"/>
      <path fill="#03599C" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"/>
      <path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6z"/>
    </svg>
  ),
  cpp: (
    <svg viewBox="0 0 128 128" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
      <path fill="#9C033A" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"/>
      <path fill="#9C033A" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"/>
      <path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6zM102.7 64h-5.4v-5.4h-5.3V64h-5.3v5.3h5.3v5.4h5.3v-5.4h5.4V64zM121.7 64h-5.4v-5.4h-5.3V64h-5.3v5.3h5.3v5.4h5.3v-5.4h5.4V64z"/>
    </svg>
  ),
  python: (
    <svg viewBox="0 0 128 128" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
      <linearGradient id="py-a" x1="70.252" y1="1237.476" x2="170.659" y2="1151.089" gradientUnits="userSpaceOnUse" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)">
        <stop offset="0" stopColor="#5A9FD4"/>
        <stop offset="1" stopColor="#306998"/>
      </linearGradient>
      <linearGradient id="py-b" x1="209.474" y1="1098.811" x2="173.62" y2="1149.537" gradientUnits="userSpaceOnUse" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)">
        <stop offset="0" stopColor="#FFD43B"/>
        <stop offset="1" stopColor="#FFE873"/>
      </linearGradient>
      <path fill="url(#py-a)" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H27.544c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.833-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z"/>
      <path fill="url(#py-b)" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z"/>
    </svg>
  ),
  java: (
    <svg viewBox="0 0 128 128" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
      <path fill="#EA2D2E" d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969z"/>
      <path fill="#EA2D2E" d="M44.629 84.455s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"/>
      <path fill="#EA2D2E" d="M69.802 61.271c6.025 6.929-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z"/>
      <path fill="#EA2D2E" d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.095.171-4.45-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.897-9.468z"/>
      <path fill="#EA2D2E" d="M49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643z"/>
      <path fill="#EA2D2E" d="M76.781 55.664c23.463-12.167 12.611-23.86 5.041-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.831 23.74 0-.001.326-.292.467-.632z"/>
      <path fill="#EA2D2E" d="M66.525 0s12.898 12.906-12.238 32.76c-20.185 15.925-4.604 25.002-.007 35.396-11.76-10.61-20.392-19.962-14.588-28.666C48.37 28.046 73.744 21.198 66.525 0z"/>
      <path fill="#EA2D2E" d="M52.203 126.872c22.532 1.437 57.168-.8 57.982-11.495 0 0-1.575 4.043-18.648 7.249-19.374 3.63-43.259 3.209-57.404.872 0 .001 2.897 2.398 18.07 3.374z"/>
    </svg>
  ),
};

// Fallback: show first 2 chars of name styled
function FallbackIcon({ name, color }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl font-display text-xs font-black text-white"
      style={{ width: 44, height: 44, backgroundColor: color }}
    >
      {name.slice(0, 2)}
    </div>
  );
}

export default function TrackCard({ track }) {
  const navigate = useNavigate();
  const pct = track.totalLessons
    ? Math.round((track.completedLessons / track.totalLessons) * 100)
    : 0;

  const logo = LOGOS[track.id];

  return (
    <button
      onClick={() => navigate(`/track/${track.id}`)}
      className="group relative flex flex-col items-start gap-3 rounded-xl border border-line bg-surface p-5 text-left transition-all hover:-translate-y-0.5 hover:border-transparent hover:shadow-lg"
      style={{ "--track-color": track.color }}
    >
      {/* left edge accent */}
      <span
        className="absolute left-0 top-4 bottom-4 w-1 rounded-full"
        style={{ backgroundColor: track.color }}
      />

      <div className="pl-3 flex items-center gap-3">
        {/* Language logo */}
        <div
          className="flex items-center justify-center rounded-xl shrink-0 overflow-hidden"
          style={{
            width: 48,
            height: 48,
            backgroundColor: `${track.color}18`,
            border: `1.5px solid ${track.color}44`,
          }}
        >
          {logo || <FallbackIcon name={track.name} color={track.color} />}
        </div>

        <div>
          <h3 className="font-display text-xl font-semibold text-offwhite">{track.name}</h3>
          <p className="mt-0.5 font-mono text-xs text-muted">// {track.tagline}</p>
        </div>
      </div>

      <div className="w-full pl-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-raised">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: track.color }}
          />
        </div>
        <p className="mt-1.5 font-mono text-[11px] text-muted">
          {track.completedLessons}/{track.totalLessons} lessons · {pct}%
        </p>
      </div>
    </button>
  );
}
