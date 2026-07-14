/**
 * Public creator demo: c/?slug=… e.g. jalalsamfit, kennybfischer (see creators-config.js)
 * Sets feed filters + profile copy, then renders the shared grid from feed.js.
 */
(function initCreatorPage() {
  const grid = document.getElementById("feedGrid");
  if (!grid || typeof POSTS === "undefined" || typeof getCreatorBySlug !== "function") return;

  /**
   * Vercel rewrites /c/eitan to c/index.html?slug=eitan server-side, but the browser
   * address bar often stays /c/eitan with no ?slug= — only parsing ?slug breaks and
   * falls back to the default creator. Prefer the path segment, then the query.
   */
  const pathM = (location.pathname || "").match(/\/c\/([^/]+)\/?$/);
  let slug = null;
  if (pathM) {
    const fromPath = decodeURIComponent(pathM[1]);
    if (fromPath && fromPath !== "index" && fromPath !== "index.html") {
      slug = fromPath;
    }
  }
  if (!slug) {
    slug = new URLSearchParams(location.search).get("slug");
  }

  let creator = slug ? getCreatorBySlug(slug) : null;
  if (!creator) {
    creator = getDefaultCreator();
    if (!creator) return;
    history.replaceState({}, "", `/c/${encodeURIComponent(creator.id)}`);
  }

  window.CRAVE_FEED_CREATOR_ID = creator.id;
  window.CRAVE_POST_LINK_PREFIX = "../";

  const titleEl = document.querySelector(".feed-handle");
  const bioEl = document.querySelector(".feed-bio");
  const avatarInner = document.querySelector(".feed-avatar-inner");
  if (titleEl) titleEl.textContent = creator.handle;
  if (bioEl) bioEl.textContent = creator.bio;
  if (avatarInner) {
    avatarInner.textContent =
      creator.avatarInitial ||
      (creator.displayName && creator.displayName.charAt(0).toUpperCase()) ||
      "?";
  }
  document.title = `${creator.handle} · Crave`;

  renderFeed();
  setupFeedSearch();
})();
