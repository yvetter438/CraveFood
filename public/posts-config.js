/**
 * All recipe posts — used by feed, creator pages, and /p/ recipe view.
 * creatorId matches creators-config.js (future: account id).
 * shopUrl — optional; primary affiliate link (e.g. shop list). "Shop ingredients" opens it; cart uses it when set.
 * products[].affiliateUrl — optional per-item link; shown on cards / saved list / batch open.
 * Timed cues: [start, end) in seconds; app normalizes to video duration on load.
 *
 * Demo mode: generic placeholder items (numbered icons, no photos); beef tacos uses 4 rows, others use 5.
 *
 * Videos: drop files under media/<creatorSlug>/01.mp4 … 09.mp4 (or any names), then set
 * videoFile to that path from site root, e.g. "media/jalalsamfit/01.mp4".
 */

/** Simple numbered tile — SVG data URL, no network fetch */
function demoIconDataUrl(n) {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><rect width="48" height="48" rx="12" fill="#3d2f48"/><text x="24" y="33" text-anchor="middle" fill="#e8c4b8" font-size="22" font-family="system-ui,sans-serif" font-weight="700">' +
    String(n) +
    "</text></svg>";
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

const DEMO_PRODUCTS = [
  {
    id: "demo_item_1",
    name: "Item 1",
    detail: "Example ingredient",
    price: 0,
    image: demoIconDataUrl(1),
  },
  {
    id: "demo_item_2",
    name: "Item 2",
    detail: "Example ingredient",
    price: 0,
    image: demoIconDataUrl(2),
  },
  {
    id: "demo_item_3",
    name: "Item 3",
    detail: "Example ingredient",
    price: 0,
    image: demoIconDataUrl(3),
  },
  {
    id: "demo_item_4",
    name: "Item 4",
    detail: "Example ingredient",
    price: 0,
    image: demoIconDataUrl(4),
  },
  {
    id: "demo_item_5",
    name: "Item 5",
    detail: "Example ingredient",
    price: 0,
    image: demoIconDataUrl(5),
  },
];

function cloneDemoProducts() {
  return DEMO_PRODUCTS.map((p) => ({ ...p }));
}

/** Same demo rows as `cloneDemoProducts`, but only the first `n` (for timed-cue count). */
function cloneDemoProductsCount(n) {
  return DEMO_PRODUCTS.slice(0, n).map((p) => ({ ...p }));
}

/** Root-level videos in /public — keep `videoFile` in sync with these filenames. */
const POSTS = [
  {
    id: "honey_chili_crisp",
    creatorId: "jalalsamfit",
    videoFile: "jalalsamfit_honey_chili_crisp_chicken_bowl.mp4",
    title: "Honey chili crisp chicken bowl",
    author: "@jalalsamfit",
    blurb:
      "Savoury, sweet, a little spice — crispy chicken, seasoned rice, pineapple avo salsa.",
    macros: "575 cal · 48g protein · 52g carbs · 19g fat · Serves 5",
    shopUrl: "https://example.com/shop",
    products: cloneDemoProducts(),
  },
  {
    id: "honey_garlic_chicken",
    creatorId: "jalalsamfit",
    videoFile: "jalalsamfit_honey_garlic_chicken_bowl.mp4",
    title: "Honey garlic chicken bowl",
    author: "@jalalsamfit",
    blurb: "Sticky honey garlic glaze over crispy chicken — great over rice with greens.",
    macros: "520 cal · 42g protein · 58g carbs · 14g fat · Serves 4",
    shopUrl: "https://example.com/shop",
    products: cloneDemoProducts(),
  },
  {
    id: "cheesy_bbq_potatoes",
    creatorId: "jalalsamfit",
    videoFile: "jalalsamfit_cheesy_BBQ_Chicken_Potatoes.mp4",
    title: "Cheesy BBQ chicken potatoes",
    author: "@jalalsamfit",
    blurb: "Loaded potatoes with BBQ chicken, melted cheese, and all the fixings.",
    macros: "640 cal · 35g protein · 48g carbs · 32g fat · Serves 4",
    shopUrl: "https://example.com/shop",
    products: cloneDemoProducts(),
  },
  {
    id: "crispy_cheesy_beef_tacos",
    creatorId: "jalalsamfit",
    videoFile: "jalalsamfit_crispy_cheesy_beef_tacos.mp4",
    title: "Crispy cheesy beef tacos",
    author: "@jalalsamfit",
    blurb: "Crispy shells, seasoned beef, and plenty of melt — weeknight taco night.",
    macros: "580 cal · 28g protein · 38g carbs · 34g fat · Serves 4",
    shopUrl: "https://example.com/shop",
    // Four timed on-screen ingredient highlights (matches 4 demo slots for this video).
    products: cloneDemoProductsCount(4),
  },
];

function buildTimedCuesSec(productIds) {
  const seg = 3.15;
  const gap = 0.12;
  return productIds.map((productId, i) => {
    const t0 = 0.4 + i * (seg + gap);
    return { productId, start: t0, end: t0 + seg };
  });
}

POSTS.forEach((post) => {
  const order = post.products.map((p) => p.id);
  post.productOrder = order;
  post.timedCuesSec = buildTimedCuesSec(order);
});

function getPostById(id) {
  return POSTS.find((p) => p.id === id) || null;
}

function getDefaultPost() {
  return POSTS[0];
}
