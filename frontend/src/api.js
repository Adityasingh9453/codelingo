const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getTracks: () => request("/tracks"),
  getTrack: (trackId) => request(`/tracks/${trackId}`),
  getLesson: (lessonId) => request(`/lessons/${lessonId}`),
  completeLesson: (lessonId, payload) =>
    request(`/lessons/${lessonId}/complete`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  loseHeart: () => request("/hearts/lose", { method: "POST" }),
  refillHearts: () => request("/hearts/refill", { method: "POST" }),
};
