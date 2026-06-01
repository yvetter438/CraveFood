/**
 * When search engines may index Food Wishes (and future creator) pages.
 * See docs/UNCLAIMED-INDEXING-POLICY.md.
 */

export function postAllowsSearchIndexing(post) {
  if (!post) return false;
  return Boolean(post.claimed || post.hasUniqueShopCopy);
}

export function creatorHubAllowsSearchIndexing(creator, posts) {
  if (!creator) return false;
  if (creator.claimed) return true;
  return posts.some((p) => p.hasUniqueShopCopy);
}

export function robotsMetaContent(indexable) {
  return indexable ? "index, follow" : "noindex, follow";
}
