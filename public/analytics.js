/**
 * PostHog: page views + autocapture. No-op if CRAVE_POSTHOG_KEY is empty.
 * Registers props: crave_page, creator_slug, post_id (for funnels and email follow-up).
 */
(function () {
  var key = window.CRAVE_POSTHOG_KEY;
  if (!key || typeof key !== "string" || !key.trim()) return;

  var host = (window.CRAVE_POSTHOG_API_HOST || "https://us.i.posthog.com").replace(/\/$/, "");

  function inferPage() {
    var p = (location.pathname || "").toLowerCase();
    if (p.indexOf("/p/") >= 0 || p.indexOf("p/index") >= 0) return "post";
    if (p.indexOf("/c/") >= 0) return "creator";
    if (p.indexOf("feed") >= 0) return "feed";
    if (p === "/" || p === "/index.html" || p.endsWith("/index.html") && p.indexOf("/c/") < 0 && p.indexOf("/p/") < 0) return "marketing";
    return "other";
  }

  function registerContext(p) {
    var q = new URLSearchParams(location.search);
    var creator_slug = q.get("slug") || "";
    if (!creator_slug) {
      var cm = (location.pathname || "").match(/\/c\/([^/]+)\/?$/);
      if (cm && cm[1] && cm[1] !== "index.html" && cm[1] !== "index") {
        try {
          creator_slug = decodeURIComponent(cm[1]);
        } catch (e) {
          creator_slug = cm[1];
        }
      }
    }
    var post_id = q.get("id") || "";
    if (!post_id) {
      var pm = (location.pathname || "").match(/\/p\/([^/]+)\/?$/);
      if (pm && pm[1] && pm[1] !== "index.html" && pm[1] !== "index") {
        try {
          post_id = decodeURIComponent(pm[1]);
        } catch (e2) {
          post_id = pm[1];
        }
      }
    }
    p.register({
      crave_page: inferPage(),
      creator_slug: creator_slug,
      post_id: post_id,
    });
  }

  // Pinned ESM build; ad blockers may still block.
  // Do not use `typeof import` here — in classic (non-module) scripts it is a syntax error.
  var moduleUrl = "https://esm.sh/posthog-js@1.216.0?bundle&target=es2020&deps=";
  import(moduleUrl)
    .then(function (m) {
      var posthog = m.default;
      if (!posthog || typeof posthog.init !== "function") return;
      posthog.init(key.trim(), {
        api_host: host,
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        disable_session_recording: true,
        persistence: "localStorage+cookie",
      });
      registerContext(posthog);
      window.posthog = posthog;
    })
    .catch(function (e) {
      console.warn("PostHog failed to load", e);
    });
})();
