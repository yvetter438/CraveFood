/**
 * Public creator demo: c/?slug=jalalsamfit
 * Sets feed filters + profile copy, then renders the shared grid from feed.js.
 */
(function initCreatorPage() {
  const grid = document.getElementById("feedGrid");
  if (!grid || typeof POSTS === "undefined" || typeof getCreatorBySlug !== "function") return;

  const params = new URLSearchParams(location.search);
  let slug = params.get("slug");
  let creator = slug ? getCreatorBySlug(slug) : null;
  if (!creator) {
    creator = getDefaultCreator();
    if (!creator) return;
    history.replaceState({}, "", `?slug=${encodeURIComponent(creator.id)}`);
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
})();
