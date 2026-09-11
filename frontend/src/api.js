const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api";

const TOKEN_KEY = "cl_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { headers, ...options });

  if (res.status === 401) {
    // Token expired — clear local auth and reload to login
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("cl_user");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  register: (name, email, password) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => request("/auth/me"),

  // ── Leaderboard ────────────────────────────────────────────────────────────
  getLeaderboard: () => request("/leaderboard"),

  // ── Tracks & Lessons ───────────────────────────────────────────────────────
  getTracks:    ()           => request("/tracks"),
  getTrack:     (trackId)    => request(`/tracks/${trackId}`),
  getLesson:    (lessonId)   => request(`/lessons/${lessonId}`),
  completeLesson: (lessonId, payload) =>
    request(`/lessons/${lessonId}/complete`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  loseHeart:   () => request("/hearts/lose",   { method: "POST" }),
  refillHearts: () => request("/hearts/refill", { method: "POST" }),
};
