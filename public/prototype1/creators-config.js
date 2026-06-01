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
  {
    id: "aussiefitness",
    displayName: "Aussie Fitness",
    handle: "@aussiefitness",
    bio: "Recipe videos · shop ingredients from each post",
    avatarInitial: "A",
  },
  {
    id: "eitan",
    displayName: "Eitan",
    handle: "@eitan",
    bio: "Recipe videos · shop ingredients from each post",
    avatarInitial: "E",
  },
  {
    id: "exercise4cheatmeals",
    displayName: "Exercise4Cheatmeals",
    handle: "@exercise4cheatmeals",
    bio: "Recipe videos · shop ingredients from each post",
    avatarInitial: "C",
  },
  {
    id: "kennybfischer",
    displayName: "Kenny B Fischer",
    handle: "@kennybfischer",
    bio: "Recipe videos · shop ingredients from each post",
    avatarInitial: "K",
  },
  {
    id: "rahul_kamat",
    displayName: "Rahul Kamat",
    handle: "@rahul_kamat",
    bio: "Recipe videos · shop ingredients from each post",
    avatarInitial: "R",
  },
  {
    id: "shredhappens",
    displayName: "Shred Happens",
    handle: "@shredhappens",
    bio: "Recipe videos · shop ingredients from each post",
    avatarInitial: "S",
  },
  {
    id: "stealth_health_life",
    displayName: "Stealth Health Life",
    handle: "@stealth_health_life",
    bio: "Recipe videos · shop ingredients from each post",
    avatarInitial: "S",
  },
  {
    id: "theflexibledietinglifestyle",
    displayName: "The Flexible Dieting Lifestyle",
    handle: "@theflexibledietinglifestyle",
    bio: "Recipe videos · shop ingredients from each post",
    avatarInitial: "F",
  },
];

function getCreatorBySlug(slug) {
  if (!slug) return null;
  return CREATORS.find((c) => c.id === slug) || null;
}

function getDefaultCreator() {
  return CREATORS[0] || null;
}
