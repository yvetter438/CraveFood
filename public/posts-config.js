/**
 * All recipe posts — used by feed, creator pages, and /p/ recipe view.
 * creatorId matches creators-config.js (future: account id).
 * shopUrl — optional recipe-level link: top "Shop now" and fallback when a product has no `affiliateUrl`. Opens in a new tab.
 * products[].affiliateUrl — optional per-item link. If set, that row’s "Open link" and cart "Shop" use it. If omitted, row falls back to `shopUrl`.
 * Batch "Shop now" in the cart: opens each unique URL among saved lines (staggered tabs). One saved item = one link.
 * Demo: `public/affiliate-placeholder.html` is the in-repo stand-in; replace with real partner URLs for production.
 * Timed cues: [start, end) in seconds; app normalizes to video duration on load.
 *
 * Demo mode: generic placeholder items (numbered icons, no photos); five rows per post unless you override `products`.
 * `detail` is the subline under each product name — indicates that Save / Shop opens a per-item affiliate link (MVP copy).
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

const AFFILIATE_PLACEHOLDER = "/affiliate-placeholder.html";

const DEMO_PRODUCTS = [
  {
    id: "demo_item_1",
    name: "Item 1",
    detail: "Affiliate link",
    price: 0,
    image: demoIconDataUrl(1),
    affiliateUrl: `${AFFILIATE_PLACEHOLDER}?p=demo_item_1&item=1`,
  },
  {
    id: "demo_item_2",
    name: "Item 2",
    detail: "Affiliate link",
    price: 0,
    image: demoIconDataUrl(2),
    affiliateUrl: `${AFFILIATE_PLACEHOLDER}?p=demo_item_2&item=2`,
  },
  {
    id: "demo_item_3",
    name: "Item 3",
    detail: "Affiliate link",
    price: 0,
    image: demoIconDataUrl(3),
    affiliateUrl: `${AFFILIATE_PLACEHOLDER}?p=demo_item_3&item=3`,
  },
  {
    id: "demo_item_4",
    name: "Item 4",
    detail: "Affiliate link",
    price: 0,
    image: demoIconDataUrl(4),
    affiliateUrl: `${AFFILIATE_PLACEHOLDER}?p=demo_item_4&item=4`,
  },
  {
    id: "demo_item_5",
    name: "Item 5",
    detail: "Affiliate link",
    price: 0,
    image: demoIconDataUrl(5),
    affiliateUrl: `${AFFILIATE_PLACEHOLDER}?p=demo_item_5&item=5`,
  },
];

function cloneDemoProducts() {
  return DEMO_PRODUCTS.map((p) => ({ ...p }));
}

/**
 * Three numbered videos per creator. Filenames: creatordemos/{filePrefix}_1..3.mp4
 * (filePrefix may include a leading underscore, e.g. _aussiefitness.)
 * idPrefix is the stable id segment for getPostById and affiliate links (e.g. aussiefitness, rahul_kamat).
 */
function threeNumberedCreatorPosts(creator) {
  const { creatorId, filePrefix, idPrefix, author } = creator;
  return [1, 2, 3].map((n) => ({
    id: `${idPrefix}_${n}`,
    creatorId,
    videoFile: `creatordemos/${filePrefix}_${n}.mp4`,
    title: `Recipe ${n}`,
    author,
    blurb: "Recipe demo with timed ingredients — save items and open affiliate links.",
    macros: "—",
    shopUrl: `${AFFILIATE_PLACEHOLDER}?scope=recipe&post=${idPrefix}_${n}`,
    products: cloneDemoProducts(),
  }));
}

/** Demo videos in /public/creatordemos/ — `videoFile` is path from site root. */
const POSTS = [
  {
    id: "honey_chili_crisp",
    creatorId: "jalalsamfit",
    videoFile: "creatordemos/jalalsamfit_honey_chili_crisp_chicken_bowl.mp4",
    title: "Honey chili crisp chicken bowl",
    author: "@jalalsamfit",
    blurb:
      "Savoury, sweet, a little spice — crispy chicken, seasoned rice, pineapple avo salsa.",
    macros: "575 cal · 48g protein · 52g carbs · 19g fat · Serves 5",
    shopUrl: `${AFFILIATE_PLACEHOLDER}?scope=recipe&post=honey_chili_crisp`,
    products: cloneDemoProducts(),
  },
  {
    id: "honey_garlic_chicken",
    creatorId: "jalalsamfit",
    videoFile: "creatordemos/jalalsamfit_honey_garlic_chicken_bowl.mp4",
    title: "Honey garlic chicken bowl",
    author: "@jalalsamfit",
    blurb: "Sticky honey garlic glaze over crispy chicken — great over rice with greens.",
    macros: "520 cal · 42g protein · 58g carbs · 14g fat · Serves 4",
    shopUrl: `${AFFILIATE_PLACEHOLDER}?scope=recipe&post=honey_garlic_chicken`,
    products: cloneDemoProducts(),
  },
  {
    id: "cheesy_bbq_potatoes",
    creatorId: "jalalsamfit",
    videoFile: "creatordemos/jalalsamfit_cheesy_BBQ_Chicken_Potatoes.mp4",
    title: "Cheesy BBQ chicken potatoes",
    author: "@jalalsamfit",
    blurb: "Loaded potatoes with BBQ chicken, melted cheese, and all the fixings.",
    macros: "640 cal · 35g protein · 48g carbs · 32g fat · Serves 4",
    shopUrl: `${AFFILIATE_PLACEHOLDER}?scope=recipe&post=cheesy_bbq_potatoes`,
    products: cloneDemoProducts(),
  },
  ...threeNumberedCreatorPosts({
    creatorId: "aussiefitness",
    filePrefix: "_aussiefitness",
    idPrefix: "aussiefitness",
    author: "@aussiefitness",
  }),
  ...threeNumberedCreatorPosts({
    creatorId: "eitan",
    filePrefix: "eitan",
    idPrefix: "eitan",
    author: "@eitan",
  }),
  ...threeNumberedCreatorPosts({
    creatorId: "exercise4cheatmeals",
    filePrefix: "exercise4cheatmeals",
    idPrefix: "exercise4cheatmeals",
    author: "@exercise4cheatmeals",
  }),
  ...threeNumberedCreatorPosts({
    creatorId: "kennybfischer",
    filePrefix: "kennybfischer",
    idPrefix: "kennybfischer",
    author: "@kennybfischer",
  }),
  ...threeNumberedCreatorPosts({
    creatorId: "rahul_kamat",
    filePrefix: "rahul__kamat",
    idPrefix: "rahul_kamat",
    author: "@rahul_kamat",
  }),
  ...threeNumberedCreatorPosts({
    creatorId: "shredhappens",
    filePrefix: "shredhappens",
    idPrefix: "shredhappens",
    author: "@shredhappens",
  }),
  ...threeNumberedCreatorPosts({
    creatorId: "stealth_health_life",
    filePrefix: "stealth_health_life",
    idPrefix: "stealth_health_life",
    author: "@stealth_health_life",
  }),
  ...threeNumberedCreatorPosts({
    creatorId: "theflexibledietinglifestyle",
    filePrefix: "theflexibledietinglifestyle",
    idPrefix: "theflexibledietinglifestyle",
    author: "@theflexibledietinglifestyle",
  }),
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
