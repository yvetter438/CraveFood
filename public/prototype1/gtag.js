/**
 * Google Analytics 4 (gtag.js). Requires analytics-config.js first.
 * Set CRAVE_GA_MEASUREMENT_ID in Vercel / .env (injected at build).
 */
(function () {
  var id = window.CRAVE_GA_MEASUREMENT_ID;
  if (!id || typeof id !== "string" || !id.trim()) return;
  id = id.trim();

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.appendChild(s);

  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: true });

  window.craveGtagEvent = function craveGtagEvent(name, params) {
    if (!window.gtag) return;
    window.gtag("event", name, params || {});
  };
})();
