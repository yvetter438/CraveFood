import { AFFILIATE_PLACEHOLDER, cloneDemoProducts } from "./demoProducts.js";
import { youtubeIdFromUrl, youtubeThumbUrl } from "./youtube.js";

export const CREATOR = {
  id: "foodwishes",
  handle: "Food Wishes",
  displayName: "Food Wishes",
  avatarInitials: "FW",
  bio: "YouTube recipe shorts · shop ingredients from each post",
  youtubeChannel: "https://www.youtube.com/@FoodWishes",
};

const SHORT_URLS = [
  "https://www.youtube.com/shorts/KCnkc3Y0AOU",
  "https://www.youtube.com/shorts/d54NanBJV4w",
  "https://www.youtube.com/shorts/vgZ3SGKPv2o",
  "https://www.youtube.com/shorts/CA976Ydz3aM",
  "https://www.youtube.com/shorts/a_DxrtG5gxU",
];

/** Per-short copy; leave `blurb` / `macros` empty to hide those lines on the player. */
const SHORT_META = [
  { title: "Chef John's quick tip", blurb: "", macros: "" },
  { title: "Weeknight dinner idea", blurb: "", macros: "" },
  { title: "Comfort food short", blurb: "", macros: "" },
  { title: "Kitchen essential", blurb: "", macros: "" },
  { title: "Food Wishes short", blurb: "", macros: "" },
];

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
  const meta = SHORT_META[index] || SHORT_META[SHORT_META.length - 1];
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
