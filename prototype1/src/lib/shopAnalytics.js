/**
 * Shop intent + claim CTA events (PostHog when configured).
 * PostHog loads async in public/analytics.js — events queue briefly until ready.
 */

const SHOP_EVENT = "shop_link_click";
const CLAIM_EVENT = "claim_cta_click";
const MAX_FLUSH_ATTEMPTS = 25;
const FLUSH_INTERVAL_MS = 120;

const pendingCaptures = [];

function flushPendingCaptures() {
  if (typeof window === "undefined" || !window.posthog?.capture) return false;
  while (pendingCaptures.length) {
    const { event, props } = pendingCaptures.shift();
    window.posthog.capture(event, props);
  }
  return true;
}

function captureWhenReady(event, props, attempt = 0) {
  if (typeof window === "undefined") return;

  if (window.posthog?.capture) {
    window.posthog.capture(event, props);
    flushPendingCaptures();
    return;
  }

  pendingCaptures.push({ event, props });

  if (attempt < MAX_FLUSH_ATTEMPTS) {
    setTimeout(() => captureWhenReady(event, props, attempt + 1), FLUSH_INTERVAL_MS);
  }
}

function dispatchCraveEvent(name, detail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function trackShopLinkClick({
  creatorId,
  postId,
  postSlug,
  productId,
  productName,
  source,
  outboundOpened,
}) {
  const payload = {
    creator_id: creatorId,
    post_id: postId,
    post_slug: postSlug || "",
    product_id: productId,
    product_name: productName || "",
    source: source || "unknown",
    outbound_opened: Boolean(outboundOpened),
    demo_profile: !outboundOpened,
  };

  captureWhenReady(SHOP_EVENT, payload);
  dispatchCraveEvent("crave:shop_link_click", payload);
  if (typeof window !== "undefined" && window.craveGtagEvent) {
    window.craveGtagEvent(SHOP_EVENT, payload);
  }
}

export function trackClaimCtaClick({ creatorId, location }) {
  const payload = {
    creator_id: creatorId,
    cta_location: location || "unknown",
  };
  captureWhenReady(CLAIM_EVENT, payload);
  dispatchCraveEvent("crave:claim_cta_click", payload);
  if (typeof window !== "undefined" && window.craveGtagEvent) {
    window.craveGtagEvent(CLAIM_EVENT, payload);
  }
}

/** True when PostHog is configured (key present) — init may still be in flight. */
export function isPostHogConfigured() {
  if (typeof window === "undefined") return false;
  const key = window.CRAVE_POSTHOG_KEY;
  return Boolean(key && typeof key === "string" && key.trim());
}
