export function youtubeIdFromUrl(url) {
  const s = String(url);
  const shorts = s.match(/shorts\/([a-zA-Z0-9_-]+)/);
  if (shorts) return shorts[1];
  const watch = s.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watch) return watch[1];
  return null;
}

export function shortsToWatchUrl(url) {
  const id = youtubeIdFromUrl(url);
  if (id) return `https://www.youtube.com/watch?v=${id}`;
  return url;
}

export function youtubeThumbUrl(videoId, quality = "hqdefault") {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}
