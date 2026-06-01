/**
 * Canonical URL scheme for Crave (creator hubs + recipe pages).
 * Used by import scripts, static generators, and the prototype app.
 */

export const SITE_ORIGIN = "https://crave.food";

/** App served under /prototype1/ until static recipe pages ship (Phase 1). */
export const PROTOTYPE_BASE = "/prototype1";

/**
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  const base =
    String(text)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/['']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80)
      .replace(/-+$/, "") || "recipe";
  return base;
}

/**
 * @param {string} title
 * @param {Map<string, number>} used — slug → count
 */
export function uniqueSlug(title, used) {
  const base = slugify(title);
  const n = used.get(base) || 0;
  const slug = n === 0 ? base : `${base}-${n + 1}`;
  used.set(base, n + 1);
  return slug;
}

/** Canonical path (no origin): /c/{creatorId}/{recipeSlug} */
export function recipePath(creatorId, recipeSlug) {
  return `/c/${encodeURIComponent(creatorId)}/${encodeURIComponent(recipeSlug)}`;
}

/** Canonical path: /c/{creatorId} */
export function creatorHubPath(creatorId) {
  return `/c/${encodeURIComponent(creatorId)}`;
}

/** Full canonical URL for SEO, sitemap, outreach email. */
export function canonicalRecipeUrl(creatorId, recipeSlug) {
  return `${SITE_ORIGIN}${recipePath(creatorId, recipeSlug)}`;
}

export function canonicalCreatorHubUrl(creatorId) {
  return `${SITE_ORIGIN}${creatorHubPath(creatorId)}`;
}

/**
 * Prototype implementation URL (interim until static HTML at canonical path).
 * @param {string} creatorId
 * @param {string} recipeSlug
 */
export function prototypeRecipePath(creatorId, recipeSlug) {
  return `${PROTOTYPE_BASE}${recipePath(creatorId, recipeSlug)}`;
}

export function prototypeCreatorHubPath(creatorId) {
  return `${PROTOTYPE_BASE}${creatorHubPath(creatorId)}`;
}

/**
 * Parse /c/{creatorId}/{recipeSlug} from pathname (with or without /prototype1 prefix).
 * @returns {{ creatorId: string, recipeSlug: string } | null}
 */
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

/**
 * Parse /c/{creatorId} hub (no recipe segment).
 * @returns {{ creatorId: string } | null}
 */
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
