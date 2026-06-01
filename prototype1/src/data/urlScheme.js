/**
 * Canonical URL helpers (mirrors /lib/url-scheme.mjs for the Vite app).
 */

export const SITE_ORIGIN = "https://crave.food";
export const PROTOTYPE_BASE = "/prototype1";

export function recipePath(creatorId, recipeSlug) {
  return `/c/${encodeURIComponent(creatorId)}/${encodeURIComponent(recipeSlug)}`;
}

export function creatorHubPath(creatorId) {
  return `/c/${encodeURIComponent(creatorId)}`;
}

export function canonicalRecipeUrl(creatorId, recipeSlug) {
  return `${SITE_ORIGIN}${recipePath(creatorId, recipeSlug)}`;
}

export function prototypeRecipePath(creatorId, recipeSlug) {
  return `${PROTOTYPE_BASE}${recipePath(creatorId, recipeSlug)}`;
}

export function prototypeCreatorHubPath(creatorId) {
  return `${PROTOTYPE_BASE}${creatorHubPath(creatorId)}`;
}

/** Router basename: '' when served at canonical /c/foodwishes/* (Vercel rewrite). */
export function routerBasename() {
  if (typeof window === "undefined") return PROTOTYPE_BASE;
  const p = window.location.pathname || "";
  if (p.startsWith("/c/foodwishes")) return "";
  return PROTOTYPE_BASE;
}

export function parseRecipePathname(pathname) {
  const p = pathname || "";
  const m = p.match(/(?:^|\/prototype1)(\/c\/([^/]+)\/([^/]+))\/?$/);
  if (!m) return null;
  try {
    return {
      creatorId: decodeURIComponent(m[2]),
      recipeSlug: decodeURIComponent(m[3]),
    };
  } catch {
    return { creatorId: m[2], recipeSlug: m[3] };
  }
}

export function parseCreatorHubPathname(pathname) {
  const p = pathname || "";
  const m = p.match(/(?:^|\/prototype1)(\/c\/([^/]+))\/?$/);
  if (!m) return null;
  try {
    return { creatorId: decodeURIComponent(m[2]) };
  } catch {
    return { creatorId: m[2] };
  }
}
