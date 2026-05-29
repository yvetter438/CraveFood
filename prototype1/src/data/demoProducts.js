const AFFILIATE_PLACEHOLDER = "/affiliate-placeholder.html";

function demoIconDataUrl(n) {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><rect width="48" height="48" rx="12" fill="#3d2f48"/><text x="24" y="33" text-anchor="middle" fill="#e8c4b8" font-size="22" font-family="system-ui,sans-serif" font-weight="700">' +
    String(n) +
    "</text></svg>";
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

const DEMO_PRODUCTS = [
  { id: "demo_item_1", name: "Item 1", detail: "Affiliate link", price: 0, image: demoIconDataUrl(1), affiliateUrl: AFFILIATE_PLACEHOLDER },
  { id: "demo_item_2", name: "Item 2", detail: "Affiliate link", price: 0, image: demoIconDataUrl(2), affiliateUrl: AFFILIATE_PLACEHOLDER },
  { id: "demo_item_3", name: "Item 3", detail: "Affiliate link", price: 0, image: demoIconDataUrl(3), affiliateUrl: AFFILIATE_PLACEHOLDER },
  { id: "demo_item_4", name: "Item 4", detail: "Affiliate link", price: 0, image: demoIconDataUrl(4), affiliateUrl: AFFILIATE_PLACEHOLDER },
  { id: "demo_item_5", name: "Item 5", detail: "Affiliate link", price: 0, image: demoIconDataUrl(5), affiliateUrl: AFFILIATE_PLACEHOLDER },
];

export function cloneDemoProducts() {
  return DEMO_PRODUCTS.map((p) => ({ ...p }));
}

export { AFFILIATE_PLACEHOLDER };
