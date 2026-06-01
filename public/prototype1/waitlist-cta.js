/**
 * Binds href + PostHog for compact waitlist links. Requires config.js and analytics.
 * Mark anchors with class `js-waitlist-cta` and optional `data-cta-location`.
 */
(function initWaitlistCtas() {
  const url =
    typeof window.CRAVE_WAITLIST_FORM_URL === "string" && window.CRAVE_WAITLIST_FORM_URL
      ? window.CRAVE_WAITLIST_FORM_URL
      : "";
  document.querySelectorAll("a.js-waitlist-cta").forEach(function (link) {
    if (url) {
      link.href = url;
    }
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.addEventListener("click", function () {
      if (window.posthog) {
        window.posthog.capture("waitlist_cta_clicked", {
          cta_location: link.getAttribute("data-cta-location") || "unknown",
        });
      }
    });
  });
})();
