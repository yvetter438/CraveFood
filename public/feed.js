/**
 * Link-in-bio style grid — 3 posts per row, links to p/index.html?id=…&creator=… when filtered (creator page).
 * Optional: window.CRAVE_FEED_CREATOR_ID filters by post.creatorId (creator pages).
 * Optional: window.CRAVE_POST_LINK_PREFIX (e.g. "../" from /c/) prepends post links and video src paths.
 */

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Seek past black first frame on many mobile decoders. */
const THUMB_SEEK_S = 0.12;

function getPostsForFeed() {
  if (typeof window.CRAVE_FEED_CREATOR_ID === "string" && window.CRAVE_FEED_CREATOR_ID) {
    return POSTS.filter((p) => p.creatorId === window.CRAVE_FEED_CREATOR_ID);
  }
  return POSTS;
}

function renderFeed() {
  const grid = document.getElementById("feedGrid");
  if (!grid || typeof POSTS === "undefined") return;

  const postLinkPrefix = typeof window.CRAVE_POST_LINK_PREFIX === "string" ? window.CRAVE_POST_LINK_PREFIX : "";

  const posts = getPostsForFeed();
  grid.innerHTML = "";
  if (posts.length === 0) {
    grid.innerHTML = '<li class="feed-cell feed-cell--empty" role="status">No posts for this creator yet.</li>';
    return;
  }

  posts.forEach((post) => {
    const li = document.createElement("li");
    li.className = "feed-cell";
    // Explicit p/index.html so static hosts (serve, Vercel static, etc.) resolve reliably
    let href = `${postLinkPrefix}p/index.html?id=${encodeURIComponent(post.id)}`;
    if (typeof window.CRAVE_FEED_CREATOR_ID === "string" && window.CRAVE_FEED_CREATOR_ID) {
      const slug = post.creatorId || window.CRAVE_FEED_CREATOR_ID;
      if (slug) {
        href += `&creator=${encodeURIComponent(slug)}`;
      }
    }
    li.innerHTML = `
      <a class="feed-tile" href="${href}">
        <div class="feed-tile-media">
          <video
            class="feed-tile-video"
            src="${escapeHtml(postLinkPrefix + post.videoFile)}"
            muted
            playsinline
            loop
            preload="metadata"
          ></video>
          <div class="feed-tile-shade" aria-hidden="true"></div>
          <span class="feed-tile-play" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
        <p class="feed-tile-title">${escapeHtml(post.title)}</p>
      </a>
    `;
    grid.appendChild(li);

    const tile = li.querySelector(".feed-tile");
    const video = li.querySelector(".feed-tile-video");
    const media = li.querySelector(".feed-tile-media");

    tile.addEventListener("click", () => {
      if (window.posthog) {
        window.posthog.capture("feed_tile_clicked", {
          post_id: post.id,
          post_title: post.title,
          creator_id: post.creatorId || "",
        });
      }
    });

    if (media && video) {
      let pressPointerId = null;
      const startPress = (e) => {
        if (e.button > 0) return;
        pressPointerId = e.pointerId;
        if (media.setPointerCapture) {
          try {
            media.setPointerCapture(e.pointerId);
          } catch (_err) {}
        }
        video.muted = true;
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        video.play().catch(() => {});
      };
      const endPress = (e) => {
        if (e.pointerId !== pressPointerId) return;
        pressPointerId = null;
        if (media.releasePointerCapture) {
          try {
            media.releasePointerCapture(e.pointerId);
          } catch (_err) {}
        }
        video.pause();
        try {
          video.currentTime = THUMB_SEEK_S;
        } catch (_e) {}
      };
      media.addEventListener("pointerdown", startPress);
      media.addEventListener("pointerup", endPress);
      media.addEventListener("pointercancel", endPress);
    }
  });

  /* Still thumbnail in view, no autoplay. Press and hold to preview. */
  initFeedThumbnails();
}

function showStillThumbnailFrame(video) {
  if (video.dataset.thumbFrame === "1" || !video) return;
  const finish = () => {
    try {
      video.pause();
    } catch (_a) {}
    video.dataset.thumbFrame = "1";
  };
  const seek = () => {
    video.addEventListener(
      "seeked",
      () => {
        finish();
      },
      { once: true }
    );
    try {
      video.currentTime = THUMB_SEEK_S;
    } catch (_b) {
      finish();
    }
  };
  if (video.readyState >= 2) {
    seek();
  } else {
    video.addEventListener("loadeddata", () => seek(), { once: true });
  }
}

function initFeedThumbnails() {
  const vids = document.querySelectorAll("#feedGrid .feed-tile-video");
  if (vids.length === 0) return;

  vids.forEach((v) => {
    v.muted = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
  });

  if (!("IntersectionObserver" in window)) {
    vids.forEach((v) => showStillThumbnailFrame(v));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const v = entry.target;
        showStillThumbnailFrame(v);
        io.unobserve(v);
      });
    },
    { root: null, rootMargin: "80px 0px", threshold: 0.01 }
  );
  vids.forEach((v) => io.observe(v));
}

if (!window.CRAVE_DEFER_FEED) {
  renderFeed();
}
