export function getProductShopUrl(post, product) {
  if (!product) return null;
  return product.affiliateUrl || post?.shopUrl || null;
}

export function openShopUrl(url) {
  if (!url) return false;
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}
