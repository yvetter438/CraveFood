/**
 * Creator profiles — public demo pages at c/?slug=…
 * Later: these rows map 1:1 to account records (same id/slug, richer fields).
 */

const CREATORS = [
  {
    id: "jalalsamfit",
    displayName: "Jalal",
    handle: "@jalalsamfit",
    bio: "Recipe videos · shop ingredients from each post",
    avatarInitial: "J",
  },
];

function getCreatorBySlug(slug) {
  if (!slug) return null;
  return CREATORS.find((c) => c.id === slug) || null;
}

function getDefaultCreator() {
  return CREATORS[0] || null;
}
