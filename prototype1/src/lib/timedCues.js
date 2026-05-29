/** Ported from public/app.js — normalized cue windows for react-player currentTime. */

export function rebuildTimedCues(timedCuesSec, duration) {
  if (!duration || !Number.isFinite(duration) || duration < 0.1) return [];
  return timedCuesSec.map((c) => {
    const start = Math.min(1, Math.max(0, c.start / duration));
    const end = Math.min(1, Math.max(0, c.end / duration));
    return { productId: c.productId, start, end: Math.max(start + 0.002, end) };
  });
}

export function getActiveCue(timedCues, currentTime, duration) {
  if (!duration || !Number.isFinite(duration)) return null;
  const t = currentTime;
  return timedCues.find((c) => t >= c.start * duration && t < c.end * duration) || null;
}

export function isInInterIngredientGap(timedCues, t, duration) {
  if (!timedCues.length || !duration || !Number.isFinite(duration)) return false;
  if (timedCues.some((c) => t >= c.start * duration && t < c.end * duration)) return false;
  for (let i = 0; i < timedCues.length - 1; i += 1) {
    const endI = timedCues[i].end * duration;
    const startNext = timedCues[i + 1].start * duration;
    if (t >= endI && t < startNext) return true;
  }
  return false;
}
