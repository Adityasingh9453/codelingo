/**
 * CodeLingo Sound Engine
 * All sounds are synthesized via the Web Audio API — no files needed.
 */

let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  // Resume if suspended (browser autoplay policy)
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function master(gain = 0.6) {
  const c = getCtx();
  const g = c.createGain();
  g.gain.value = gain;
  g.connect(c.destination);
  return g;
}

function osc(type, freq, startTime, duration, gainNode, vol = 0.5) {
  const c = getCtx();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, startTime);
  g.gain.setValueAtTime(vol, startTime);
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  o.connect(g);
  g.connect(gainNode);
  o.start(startTime);
  o.stop(startTime + duration);
}

/** ✅ Correct answer — bright, two-note ascending chime */
export function playCorrect() {
  const c = getCtx();
  const m = master(0.55);
  const now = c.currentTime;
  osc("sine", 523.25, now, 0.25, m, 0.5);       // C5
  osc("sine", 783.99, now + 0.12, 0.35, m, 0.6); // G5
}

/** ❌ Wrong answer — low descending buzz */
export function playWrong() {
  const c = getCtx();
  const m = master(0.5);
  const now = c.currentTime;
  // Two-tone buzzer going down
  osc("sawtooth", 220, now, 0.15, m, 0.4);
  osc("sawtooth", 150, now + 0.15, 0.25, m, 0.45);
}

/** 🏆 Lesson complete — celebratory fanfare */
export function playLessonComplete() {
  const c = getCtx();
  const m = master(0.5);
  const now = c.currentTime;
  const melody = [
    [523.25, 0.0],   // C5
    [659.25, 0.12],  // E5
    [783.99, 0.24],  // G5
    [1046.5, 0.38],  // C6
  ];
  for (const [freq, delay] of melody) {
    osc("sine", freq, now + delay, 0.3, m, 0.55);
  }
}

/** 💔 Heart lost — soft descending thud */
export function playHeartLost() {
  const c = getCtx();
  const m = master(0.45);
  const now = c.currentTime;
  osc("triangle", 300, now, 0.1, m, 0.5);
  osc("triangle", 180, now + 0.1, 0.3, m, 0.6);
}

/** 🖱️ Button / UI click — subtle, quick tap */
export function playClick() {
  const c = getCtx();
  const m = master(0.3);
  const now = c.currentTime;
  osc("sine", 880, now, 0.08, m, 0.4);
}
