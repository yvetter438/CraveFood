/** HTML helpers for static SEO pages. */

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function robotsContent(indexable) {
  return indexable ? "index, follow" : "noindex, follow";
}

export function postIndexable(meta, creatorClaimed) {
  return Boolean(creatorClaimed || meta.claimed || meta.hasUniqueShopCopy);
}

export function hubIndexable(metaList, creatorClaimed) {
  if (creatorClaimed) return true;
  return metaList.some((m) => m.hasUniqueShopCopy);
}

export function jsonLdScript(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}
