import { AFFILIATE_PLACEHOLDER, cloneDemoProducts } from "./demoProducts.js";
import { SHORT_URLS } from "./foodwishes-shorts.generated.js";
import { youtubeIdFromUrl, youtubeThumbUrl } from "./youtube.js";

export const CREATOR = {
  id: "foodwishes",
  handle: "Food Wishes",
  displayName: "Food Wishes",
  avatarInitials: "FW",
  bio: "YouTube recipe shorts · shop ingredients from each post",
  youtubeChannel: "https://www.youtube.com/@foodwishes/shorts",
};

function metaForIndex(index) {
  return { title: `Recipe ${index + 1}`, blurb: "", macros: "" };
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
  const meta = metaForIndex(index);
  const products = cloneDemoProducts();
  const timedCuesSec = buildTimedCuesSec(products.map((p) => p.id));

  return {
    id: `foodwishes_${index + 1}`,
    creatorId: CREATOR.id,
    youtubeUrl: shortUrl,
    youtubeVideoId: videoId,
    feedThumb: videoId ? youtubeThumbUrl(videoId) : "/assets/feed-tile-fallback.jpg",
    title: meta.title,
    author: CREATOR.displayName,
    blurb: meta.blurb,
    macros: meta.macros,
    shopUrl: AFFILIATE_PLACEHOLDER,
    products,
    timedCuesSec,
  };
}

export const POSTS = SHORT_URLS.map(buildPost);

export function getPostById(id) {
  return POSTS.find((p) => p.id === id) || null;
}

export function getDefaultPost() {
  return POSTS[0];
}

export function getPostsForCreator(creatorId) {
  return POSTS.filter((p) => p.creatorId === creatorId);
}
