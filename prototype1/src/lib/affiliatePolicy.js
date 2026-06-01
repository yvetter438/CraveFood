/**
 * Pre-claim: measure shop intent only — no outbound affiliate URLs.
 * Post-claim: open creator-configured links.
 * See docs/UNCLAIMED-AFFILIATE-POLICY.md
 */

import { CREATOR } from "../data/posts.js";

export function postAllowsAffiliateOutbound(post) {
  if (!post) return false;
  return Boolean(CREATOR.claimed || post.claimed);
}

/** URL to open in a new tab — null on unclaimed demos (no platform or placeholder monetization). */
export function getOutboundShopUrl(post, product) {
  if (!postAllowsAffiliateOutbound(post)) return null;
  if (!product) return post?.shopUrl || null;
  return product.affiliateUrl || post?.shopUrl || null;
}

export const DEMO_SHOP_TOAST =
  "Demo profile — shop clicks are tracked. Affiliate links go live when the creator claims.";
