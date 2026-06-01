import { DEMO_SHOP_TOAST, getOutboundShopUrl, postAllowsAffiliateOutbound } from "./affiliatePolicy.js";
import { trackShopLinkClick } from "./shopAnalytics.js";

/** @deprecated Use getOutboundShopUrl — respects affiliate policy. */
export function getProductShopUrl(post, product) {
  return getOutboundShopUrl(post, product);
}

export function openShopUrl(url) {
  if (!url) return false;
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}

/**
 * Track shop intent; open creator affiliate URL only when claim allows outbound links.
 * @returns {{ opened: boolean, tracked: boolean }}
 */
export function attemptShopLinkOpen(post, product, { source = "unknown" } = {}) {
  if (!post || !product) return { opened: false, tracked: false };

  const url = getOutboundShopUrl(post, product);
  const canOpen = Boolean(url);

  trackShopLinkClick({
    creatorId: post.creatorId,
    postId: post.id,
    postSlug: post.slug,
    productId: product.id,
    productName: product.name,
    source,
    outboundOpened: canOpen,
  });

  if (!canOpen) return { opened: false, tracked: true };
  return { opened: openShopUrl(url), tracked: true };
}

export function shopLinkButtonLabel() {
  return "Shop";
}

export function shopLinkAriaLabel(post) {
  return postAllowsAffiliateOutbound(post)
    ? "Open affiliate shop link in a new tab"
    : "Shop — tracked on demo profile; creator affiliate link goes live after claim";
}

export { DEMO_SHOP_TOAST };
