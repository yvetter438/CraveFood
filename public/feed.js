/**
 * Link-in-bio style grid — 3 posts per row, links to p/index.html?id=…&creator=… when filtered (creator page).
 * Optional: window.CRAVE_FEED_CREATOR_ID filters by post.creatorId (creator pages).
 * Optional: window.CRAVE_POST_LINK_PREFIX (e.g. "../" from /c/) prepends post links, poster, and video paths.
 */

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** After decode, seek to a time that usually has picture (0s is often black on phones). */
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
  const posterUrl = postLinkPrefix + "assets/feed-tile-poster.svg";

  const posts = getPostsForFeed();
  grid.innerHTML = "";
  if (posts.length === 0) {
    grid.innerHTML = '<li class="feed-cell feed-cell--empty" role="status">No posts for this creator yet.</li>';
    return;
  }

  posts.forEach((post) => {
    const li = document.createElement("li");
    li.className = "feed-cell";
    let href = `${postLinkPrefix}p/index.html?id=${encodeURIComponent(post.id)}`;
    if (typeof window.CRAVE_FEED_CREATOR_ID === "string" && window.CRAVE_FEED_CREATOR_ID) {
      const slug = post.creatorId || window.CRAVE_FEED_CREATOR_ID;
      if (slug) {
        href += `&creator=${encodeURIComponent(slug)}`;
      }
    }
    const fileUrl = escapeHtml(postLinkPrefix + post.videoFile);
    const posterEnc = escapeHtml(posterUrl);
    li.innerHTML = `
      <a class="feed-tile" href="${href}">
        <div class="feed-tile-media">
          <video
            class="feed-tile-video"
            src="${fileUrl}"
            poster="${posterEnc}"
            muted
            defaultMuted
            playsinline
            loop
            preload="auto"
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
    if (video) {
      video.muted = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
    }

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
        if (!video.getAttribute("src") && !video.currentSrc) return;
        try {
          video.pause();
        } catch (_d) {}
        try {
          if (Number.isFinite(video.duration) && video.duration > 0) {
            video.currentTime = THUMB_SEEK_S;
          } else {
            video.currentTime = 0;
          }
        } catch (_e) {}
      };
      media.addEventListener("pointerdown", startPress);
      media.addEventListener("pointerup", endPress);
      media.addEventListener("pointercancel", endPress);
    }
  });

  primeFeedThumbnails();
}

/**
 * Mobile + desktop: load each mp4, seek to a still frame, pause.
 * The static `poster` shows immediately so tiles are never a black void while bytes arrive.
 */
function primeFeedThumbnails() {
  const vids = document.querySelectorAll("#feedGrid .feed-tile-video");
  vids.forEach((v) => {
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");

    v.addEventListener("error", () => {
      v.dataset.thumbReady = "1";
    });

    const runStill = () => {
      if (v.dataset.stillArmed === "1" || v.dataset.thumbReady === "1") return;
      v.dataset.stillArmed = "1";
      v.addEventListener(
        "seeked",
        () => {
          try {
            v.pause();
          } catch (_a) {}
          v.dataset.thumbReady = "1";
          try {
            v.removeAttribute("poster");
          } catch (_b) {}
        },
        { once: true }
      );
      try {
        v.currentTime = THUMB_SEEK_S;
      } catch (_c) {
        v.dataset.thumbReady = "1";
        v.removeAttribute("poster");
      }
    };

    v.addEventListener("loadeddata", runStill, { once: true });
    v.addEventListener("canplay", runStill, { once: true });
    if (v.readyState >= 2) {
      requestAnimationFrame(() => runStill());
    }
  });
}

if (!window.CRAVE_DEFER_FEED) {
  renderFeed();
}
