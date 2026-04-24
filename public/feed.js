/**
 * Link-in-bio style grid — 3 posts per row, links to p/index.html?id=…&creator=… when filtered (creator page).
 * Optional: window.CRAVE_FEED_CREATOR_ID filters by post.creatorId (creator pages).
 * Optional: window.CRAVE_POST_LINK_PREFIX (e.g. "../" from /c/) prepends post links, thumb, and video paths.
 *
 * iOS / WebKit: the video element composites as a black GPU layer until a frame is decoded, covering any
 * poster. We show a raster image (see posts-config `feedThumb`) first, attach `src` only when the tile
 * is near the viewport (IntersectionObserver) or on press, then fade the video in after `loadeddata` and
 * videoWidth > 0.
 */

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Nicer still on desktop / when enough data exists; on iOS it may be a no-op if range isn’t there yet. */
const THUMB_SEEK_S = 0.12;

function feedThumbDefault() {
  if (typeof FEED_THUMB_DEFAULT === "string" && FEED_THUMB_DEFAULT) {
    return FEED_THUMB_DEFAULT;
  }
  return "assets/feed-tile-fallback.jpg";
}

function getPostsForFeed() {
  if (typeof window.CRAVE_FEED_CREATOR_ID === "string" && window.CRAVE_FEED_CREATOR_ID) {
    return POSTS.filter((p) => p.creatorId === window.CRAVE_FEED_CREATOR_ID);
  }
  return POSTS;
}

function attachFeedVideoSource(video) {
  const u = video.dataset.feedSrc;
  if (!u || (video.getAttribute("src") && String(video.getAttribute("src")) === u)) {
    return;
  }
  video.setAttribute("src", u);
  try {
    video.load();
  } catch (_e) {}
}

function onFeedVideoDecoded(video, media) {
  if (!video || !media) return;
  if (video.videoWidth > 0) {
    media.classList.add("feed-tile-media--frame-ready");
    requestAnimationFrame(() => nudgeCurrentTimeToThumb(video));
  }
}

/**
 * @returns {() => void} disconnect
 */
function watchFeedVideoForDecode(video, media) {
  const done = () => onFeedVideoDecoded(video, media);
  const onData = () => {
    onFeedVideoDecoded(video, media);
  };
  video.addEventListener("loadeddata", onData, { once: true });
  video.addEventListener("error", done, { once: true });
  if (video.readyState >= 2) {
    requestAnimationFrame(done);
  }
  return function disconnect() {
    video.removeEventListener("loadeddata", onData);
    video.removeEventListener("error", done);
  };
}

let feedGridIo = null;
function getFeedGridObserver() {
  if (typeof IntersectionObserver === "undefined") return null;
  if (feedGridIo) return feedGridIo;
  feedGridIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const v = en.target;
          if (v && v.classList && v.classList.contains("feed-tile-video")) {
            attachFeedVideoSource(v);
          }
        }
      });
    },
    { root: null, rootMargin: "80px 0px", threshold: 0.01 }
  );
  return feedGridIo;
}

function observeFeedVideo(video) {
  const io = getFeedGridObserver();
  if (io) {
    try {
      io.observe(video);
    } catch (_e) {}
  } else {
    attachFeedVideoSource(video);
  }
}

function nudgeCurrentTimeToThumb(video) {
  if (video.videoWidth <= 0) return;
  if (!Number.isFinite(video.duration) || video.duration <= 0) return;
  try {
    const cap = Math.max(0, video.duration - 0.04);
    video.currentTime = Math.min(THUMB_SEEK_S, cap);
  } catch (_e) {}
}

function renderFeed() {
  const grid = document.getElementById("feedGrid");
  if (!grid || typeof POSTS === "undefined") return;

  const postLinkPrefix = typeof window.CRAVE_POST_LINK_PREFIX === "string" ? window.CRAVE_POST_LINK_PREFIX : "";
  const defThumb = feedThumbDefault();

  const posts = getPostsForFeed();
  if (feedGridIo) {
    document.querySelectorAll("#feedGrid .feed-tile-video").forEach((n) => {
      try {
        feedGridIo.unobserve(n);
      } catch (_e) {}
    });
  }
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
    const relVideo = String(post.videoFile || "").trim();
    const fileUrl = relVideo ? escapeHtml(postLinkPrefix + relVideo) : "";
    const relThumb = typeof post.feedThumb === "string" && post.feedThumb ? post.feedThumb : defThumb;
    const imgSrc = escapeHtml(postLinkPrefix + relThumb);
    li.innerHTML = `
      <a class="feed-tile" href="${href}">
        <div class="feed-tile-media">
          <img class="feed-tile-img" src="${imgSrc}" alt="" width="360" height="640" loading="lazy" decoding="async" />
          <video
            class="feed-tile-video"
            ${fileUrl ? `data-feed-src="${fileUrl}"` : ""}
            muted
            defaultMuted
            playsinline
            loop
            preload="none"
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

    if (media && video && fileUrl) {
      watchFeedVideoForDecode(video, media);
      observeFeedVideo(video);

      let pressPointerId = null;
      const startPress = (e) => {
        if (e.button > 0) return;
        pressPointerId = e.pointerId;
        if (media.setPointerCapture) {
          try {
            media.setPointerCapture(e.pointerId);
          } catch (_err) {}
        }
        attachFeedVideoSource(video);
        if (!video.getAttribute("src") && !video.currentSrc) {
          return;
        }
        video.muted = true;
        const playWhenReady = () => {
          const p = video.play();
          if (p && typeof p.catch === "function") {
            p.catch(() => {});
          }
        };
        if (video.readyState >= 2) {
          playWhenReady();
        } else {
          const onCanStart = () => {
            playWhenReady();
            video.removeEventListener("canplay", onCanStart);
            video.removeEventListener("loadeddata", onCanStart);
          };
          video.addEventListener("canplay", onCanStart, { once: true });
          video.addEventListener("loadeddata", onCanStart, { once: true });
        }
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
        if (video.videoWidth > 0) {
          nudgeCurrentTimeToThumb(video);
        }
      };
      media.addEventListener("pointerdown", startPress);
      media.addEventListener("pointerup", endPress);
      media.addEventListener("pointercancel", endPress);
    }
  });
}

if (!window.CRAVE_DEFER_FEED) {
  renderFeed();
}
