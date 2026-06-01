import { cloneDemoProducts } from "./demoProducts.js";
import { SHORT_META, SHORT_URLS } from "./foodwishes-shorts.generated.js";
import { PILOT_CREATOR_ID } from "./pilotCreator.js";
import { youtubeIdFromUrl, youtubeThumbUrl } from "./youtube.js";

export const CREATOR = {
  id: PILOT_CREATOR_ID,
  handle: "Food Wishes",
  displayName: "Food Wishes",
  avatarInitials: "FW",
  bio: "YouTube recipe shorts · shop ingredients from each post",
  youtubeChannel: "https://www.youtube.com/@foodwishes/shorts",
  /** Creator-level claim; when true, hub + all posts may index (unless overridden per post). */
  claimed: false,
};

export function isUnclaimedDemoCreator(creator = CREATOR) {
  return Boolean(creator && !creator.claimed);
}

function buildTimedCuesSec(productIds) {
  const seg = 3.15;
  const gap = 0.12;
  return productIds.map((productId, i) => {
    const t0 = 0.4 + i * (seg + gap);
    return { productId, start: t0, end: t0 + seg };
  });
}

function buildPost(shortUrl, index) {
  const videoId = youtubeIdFromUrl(shortUrl);
  const meta = SHORT_META[index] ?? { title: `Recipe ${index + 1}`, blurb: "", macros: "" };
  const claimed = CREATOR.claimed || meta.claimed === true;
  const products = cloneDemoProducts().map((p) => ({
    ...p,
    affiliateUrl: claimed ? p.affiliateUrl : null,
  }));
  const timedCuesSec = buildTimedCuesSec(products.map((p) => p.id));

  return {
    id: `foodwishes_${index + 1}`,
    creatorId: CREATOR.id,
    slug: meta.slug || `recipe-${index + 1}`,
    youtubeUrl: shortUrl,
    youtubeVideoId: videoId || meta.videoId || null,
    feedThumb: videoId ? youtubeThumbUrl(videoId) : "/assets/feed-tile-fallback.jpg",
    title: meta.title,
    description: meta.description || meta.blurb || "",
    author: CREATOR.displayName,
    blurb: meta.blurb,
    macros: meta.macros,
    shopUrl: claimed ? meta.shopUrl || null : null,
    products,
    timedCuesSec,
    claimed: meta.claimed === true,
    hasUniqueShopCopy: meta.hasUniqueShopCopy === true,
  };
}

export const POSTS = SHORT_URLS.map(buildPost);

export function getPostById(id) {
  return POSTS.find((p) => p.id === id) || null;
}

export function getPostByCreatorAndSlug(creatorId, slug) {
  return POSTS.find((p) => p.creatorId === creatorId && p.slug === slug) || null;
}

export function getDefaultPost() {
  return POSTS[0];
}

export function getPostsForCreator(creatorId) {
  return POSTS.filter((p) => p.creatorId === creatorId);
}
