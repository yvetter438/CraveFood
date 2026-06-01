# URL scheme (locked)

**Domain:** [https://crave.food](https://crave.food)  
**Status:** Locked 2026-05-29 — change only with intent (redirects, sitemap updates).  
**Related:** [SEO-CLAIM-GTM-PLAN.md](./SEO-CLAIM-GTM-PLAN.md)

---

## Patterns

| Resource | Canonical URL | Example |
|----------|---------------|---------|
| Creator hub | `{origin}/c/{creatorId}` | `https://crave.food/c/foodwishes` |
| Recipe (video + shop) | `{origin}/c/{creatorId}/{recipeSlug}` | `https://crave.food/c/foodwishes/how-to-slice-onions-with-fewer-tears` |
| Marketing home | `{origin}/` | `https://crave.food/` |

### Rules

- **`creatorId`** — Stable internal id (e.g. `foodwishes`, `jalalsamfit`). Lowercase, no spaces.
- **`recipeSlug`** — Derived from YouTube title via `slugify()`; unique per creator. **Public URL identifier** for SEO and sharing.
- **`youtubeVideoId`** — Stored in data for deduping and embeds; **not** required in the public URL.
- **Legacy post ids** — e.g. `foodwishes_24` remain in data for carts/analytics; URLs use `recipeSlug` instead.

### Slug generation

- Lowercase, hyphens, max ~80 chars  
- Collisions: append `-2`, `-3`, …  
- Implemented in `lib/url-scheme.mjs` and `scripts/import-youtube-shorts.mjs`

---

## Legacy URLs (existing demos)

| Pattern | Status |
|---------|--------|
| `/c/{slug}` → `c/index.html` | Unchanged for jalalsamfit-style creators in `creators-config.js` |
| `/p/{postId}` → `p/index.html` | Unchanged for production demo posts |
| `/feed.html` | Unchanged |

Food Wishes pilot uses the **new** `/c/foodwishes/{recipeSlug}` pattern only.

---

## Interim: prototype app

Until Phase 1 static HTML exists at canonical paths:

| Canonical (SEO target) | Working app URL today |
|------------------------|------------------------|
| `https://crave.food/c/foodwishes` | `https://crave.food/prototype1/c/foodwishes` (or canonical via Vercel rewrite) |
| `https://crave.food/c/foodwishes/{slug}` | Same — rewrite serves `prototype1/index.html`; router uses basename `""` |

**Vercel** (`vercel.json`): `/c/foodwishes` and `/c/foodwishes/:recipeSlug` rewrite to `/prototype1/index.html` (browser bar stays canonical).

**Local dev:** `npm run dev:prototype1` → `http://localhost:5173/prototype1/c/foodwishes/{slug}`

---

## Code references

| File | Purpose |
|------|---------|
| `lib/url-scheme.mjs` | Slugify + path builders (Node import script) |
| `prototype1/src/data/urlScheme.js` | Same paths for React Router + links |
| `prototype1/src/data/foodwishes-shorts.generated.js` | `SHORT_META[].slug`, `videoId` |
| `prototype1/src/data/posts.js` | `post.slug`, `getPostByCreatorAndSlug()` |

---

## Redirects (planned Phase 1)

- `/p/foodwishes_{n}` → `/c/foodwishes/{slug}` (301) when static pages ship  
- Optional: `/prototype1/c/foodwishes/*` → canonical `/c/foodwishes/*` (301)
