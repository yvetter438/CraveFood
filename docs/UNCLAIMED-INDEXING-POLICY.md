# Unclaimed indexing policy

**Status:** Active (2026-05-29)  
**Scope:** Food Wishes pilot (`/c/foodwishes`, `/c/foodwishes/{recipeSlug}`) served by the prototype app.  
**Related:** [SEO-CLAIM-GTM-PLAN.md](./SEO-CLAIM-GTM-PLAN.md) Phase 0, [URL-SCHEME.md](./URL-SCHEME.md)

---

## Policy (locked)

Search engines should **not** index demo / unclaimed creator pages by default.

| Condition | `meta robots` | In sitemap (Phase 1) |
|-----------|---------------|----------------------|
| Unclaimed, no unique shop copy | `noindex, follow` | Omit |
| Creator **claimed** (`claimed: true`) | `index, follow` | Include |
| **Unique shop copy** on that recipe (`hasUniqueShopCopy: true`) | `index, follow` for that recipe | Include that URL |
| Creator hub | `index, follow` only if creator is claimed **or** any recipe has unique copy | Include hub when true |

**`follow`** — Crawlers may still discover links on the page (e.g. internal links to other recipes). We only block **indexing**, not crawling.

---

## Why

1. **Trust** — Pre-built Food Wishes pages are demos, not an official partnership. Avoid ranking for the creator’s recipe names before they opt in.
2. **Thin / duplicate content** — Pages are mostly YouTube embed + placeholder shop data. `noindex` until Tier A copy exists (Phase 2) avoids a spammy footprint.
3. **Claim incentive** — Flipping to `index, follow` after claim (or after adding real shop copy) is a clear benefit in outreach: *“Claim to go live in search.”*

---

## Implementation (this change)

### Data flags

Each row in `prototype1/src/data/foodwishes-shorts.generated.js` → `SHORT_META[]`:

```json
{
  "claimed": false,
  "hasUniqueShopCopy": false
}
```

Creator-level: `CREATOR.claimed` in `prototype1/src/data/posts.js` (default `false`).

Set by `scripts/import-youtube-shorts.mjs` on write. Preserve `true` values if you re-import with `--no-titles`.

### Runtime (prototype SPA)

| File | Role |
|------|------|
| `prototype1/index.html` | Default `<meta name="robots" content="noindex, follow">` before JS runs |
| `prototype1/src/lib/seoIndexing.js` | Rules: `postAllowsSearchIndexing`, `creatorHubAllowsSearchIndexing` |
| `prototype1/src/hooks/useRobotsMeta.js` | Updates `<meta name="robots">` on route/view change |
| `FeedPage.jsx` | Hub uses creator + posts flags |
| `PostPage.jsx` | Active recipe uses post flags |

### How to allow indexing later

**Full creator claim**

1. Set `CREATOR.claimed = true` in `posts.js` (or future account DB).
2. Set all `SHORT_META[].claimed = true` (or batch in import data).
3. Rebuild prototype; confirm robots → `index, follow` on hub and recipes.

**Single recipe (Tier A SEO, Phase 2)**

1. Add unique summary + ingredient copy on that recipe.
2. Set `hasUniqueShopCopy: true` for that row in `SHORT_META` only.
3. Rebuild; that recipe (and hub, if any recipe is indexable) becomes indexable.

**Static HTML (Phase 1)** — Static generator must read the same flags and emit matching `<meta name="robots">` and sitemap inclusion.

---

## Verification

1. Open `/prototype1/c/foodwishes` or a recipe URL → View source / Elements → `meta[name=robots]` should be `noindex, follow`.
2. Set one post’s `hasUniqueShopCopy: true` in generated data → rebuild → that post’s viewer should show `index, follow`.
3. Google Search Console: unclaimed URLs should not be submitted in sitemap until flags allow indexing.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-29 | Initial policy + prototype `noindex, follow` default; flags on `SHORT_META` and `CREATOR`. |
