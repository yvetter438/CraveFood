# Phase 1 — SEO infrastructure

**Status:** Implemented 2026-05-29  
**Pilot:** Food Wishes (`foodwishes`)

---

## Commands

```bash
# Refresh shorts list → generated data (titles, slugs, SEO fields)
npm run import:shorts

# Build static hub + recipe HTML, robots.txt, sitemap.xml
npm run generate:seo

# Full deploy build (analytics + SEO pages + prototype)
npm run build
```

---

## What was built

### 1. Data pipeline

`scripts/import-youtube-shorts.mjs` writes `SHORT_META[]` with:

| Field | Purpose |
|-------|---------|
| `creatorId` | Pilot id (`foodwishes`) |
| `slug` | URL segment |
| `title` | Page H1 / `<title>` |
| `description` | Meta description (auto if `blurb` empty) |
| `videoId` | YouTube embed |
| `thumbnailUrl` | OG image + schema |
| `claimed`, `hasUniqueShopCopy` | Indexing + affiliate rules |

### 2. Static HTML

`scripts/generate-seo-pages.mjs` outputs:

| Path | Content |
|------|---------|
| `public/c/foodwishes/index.html` | Creator hub (recipe list) |
| `public/c/foodwishes/{slug}/index.html` | One page per short (93) |
| `public/robots.txt` | Allow all + sitemap URL |
| `public/sitemap.xml` | Indexable URLs only (0 while unclaimed) |

Each recipe page includes in **initial HTML**: title, description, canonical, robots, H1, body text, YouTube iframe, shop + FTC + claim sections, link to interactive app at `/prototype1/c/foodwishes/{slug}`.

### 3. Schema + social

- JSON-LD: `VideoObject`, `BreadcrumbList` (hub: `CollectionPage`)
- Open Graph + Twitter card tags

### 4. Analytics on static pages

- Loads `/analytics-config.js` + `/analytics.js`
- Fires `recipe_page_view` on recipe pages (PostHog when key set)

### 5. Vercel

Removed `/c/foodwishes` rewrites to prototype — **static files win** at canonical URLs. Interactive app stays at `/prototype1/c/foodwishes/...`.

---

## Indexing today

All pages are `noindex, follow` until `claimed` or `hasUniqueShopCopy` — sitemap is empty by design.

To index a recipe: set `hasUniqueShopCopy: true` on that row, run `npm run generate:seo`, submit sitemap in Search Console.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-29 | Phase 1 pipeline + static pages + robots/sitemap. |
