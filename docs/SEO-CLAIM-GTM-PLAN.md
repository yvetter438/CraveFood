# SEO, claim-first GTM, and creator outreach plan

**Status:** Living document — edit as strategy evolves.  
**Last updated:** 2026-05-29  
**Pilot creator:** Food Wishes — see [PILOT-CREATOR-FOODWISHES.md](./PILOT-CREATOR-FOODWISHES.md)

This plan combines:

1. **Claim-first go-to-market** — Pre-build creator profiles; creators claim and wire their affiliate tags.
2. **SEO fundamentals** — Crawlable recipe pages for long-tail discovery (not a substitute for link-in-bio traffic early on).
3. **Monetization sequencing** — Track clicks pre-claim; SaaS after proof; no skimming affiliate revenue on unclaimed demos.

Related docs: [PRODUCT_VISION.md](./PRODUCT_VISION.md), [DEMO_ROLLOUT.md](./DEMO_ROLLOUT.md).

---

## Strategy summary

| Phase | Goal |
|-------|------|
| 0 | Lock URLs, indexing policy, affiliate ethics |
| 1 | SEO infrastructure (slugs, static HTML, sitemap, schema) |
| 2 | Content quality floor (index top N only) |
| 3 | Claim flow + proof pack for outreach |
| 4 | Outreach to first 5–20 creators |
| 5 | Small paid tests + creator-driven links after claim |
| 6 | Scale import pipeline + Pro upgrades |

**Core principles**

- Pre-claim pages are **demos**, not “we represent this creator.”
- **Do not** run your affiliate tags on unclaimed profiles — measure clicks; model earnings for outreach.
- On claim: creator’s affiliate IDs, remove `noindex` when page has unique copy, charge for tooling/analytics (Pro).
- SEO compounds slowly; link-in-bio (after claim) remains the highest-intent traffic.

---

## Phase 0 — Decisions (do once)

- [x] **Domain & URL scheme** — Locked — see **[URL-SCHEME.md](./URL-SCHEME.md)**
  - Creator hub: `https://crave.food/c/foodwishes`
  - Recipe: `https://crave.food/c/foodwishes/how-to-slice-onions-with-fewer-tears`
  - `youtubeVideoId` in `SHORT_META` for deduping/embeds; `slug` is the public URL
- [x] **Unclaimed indexing policy** — Default: `noindex, follow` — see **[UNCLAIMED-INDEXING-POLICY.md](./UNCLAIMED-INDEXING-POLICY.md)**
- [x] **Affiliate policy** — No outbound links pre-claim; track `shop_link_click` only — **[UNCLAIMED-AFFILIATE-POLICY.md](./UNCLAIMED-AFFILIATE-POLICY.md)**
- [x] **Disclaimer copy** — **[UNCLAIMED-DISCLAIMER-POLICY.md](./UNCLAIMED-DISCLAIMER-POLICY.md)**
- [x] **Pilot creator** — Food Wishes — **[PILOT-CREATOR-FOODWISHES.md](./PILOT-CREATOR-FOODWISHES.md)**

**Notes / decisions log**

```
2026-05-29 — Domain crave.food. Canonical paths /c/{creatorId}/{recipeSlug}. Slugs in import + prototype routes. Vercel rewrites /c/foodwishes/* → prototype1. Full spec: docs/URL-SCHEME.md.
2026-05-29 — Unclaimed demos: noindex,follow by default; claimed / hasUniqueShopCopy flips to index. docs/UNCLAIMED-INDEXING-POLICY.md.
2026-05-29 — Pre-claim: no affiliate tab opens; shop_link_click tracking. docs/UNCLAIMED-AFFILIATE-POLICY.md.
2026-05-29 — Demo disclaimer on hub + recipe pages; claim_cta_click. docs/UNCLAIMED-DISCLAIMER-POLICY.md.
2026-05-29 — Pilot creator: Food Wishes (foodwishes). docs/PILOT-CREATOR-FOODWISHES.md.
```

---

## Phase 1 — SEO infrastructure (build once)

### Data pipeline

- [ ] Extend `scripts/import-youtube-shorts.mjs` to output per video:
  - `slug`, `title`, `description`, `videoId`, `thumbnailUrl`, `creatorId`, `claimed` (boolean)
- [ ] Slug rules: lowercase, hyphens, dedupe collisions (`-2`, `-3`), max length ~80 chars
- [ ] Regenerate data module from `prototype1/data/foodwishes-shorts.txt`

### Static, crawlable pages (not SPA-only)

Current gap: production `/p/index.html` and prototype React routes set `document.title` in JS; crawlers see a thin shell.

- [ ] **Build-time HTML generator** — One file per recipe + one creator hub from generated data
- [ ] Each recipe page includes in **initial HTML**:
  - [ ] `<title>` — `{Recipe} · {Creator} · Crave`
  - [ ] `<meta name="description">`
  - [ ] `<link rel="canonical">` (absolute URL)
  - [ ] `<h1>` — recipe title
  - [ ] Unique body block (summary + ingredients/products)
  - [ ] YouTube embed or prominent “Watch on YouTube” link
  - [ ] Shop / affiliate section + FTC disclosure
  - [ ] Claim CTA
- [ ] Creator hub lists all recipes linking to canonical URLs
- [ ] React/player hydrates on top for interactivity; crawlers must not depend on JS for core content

### Discovery files

- [ ] `public/robots.txt` — Allow public recipe paths; `Sitemap:` directive
- [ ] `public/sitemap.xml` — Auto-generated (indexed URLs only, or split sitemaps)
- [ ] Optional: `sitemap-creators.xml` + `sitemap-recipes.xml` at scale

### Structured data (JSON-LD)

- [ ] `VideoObject` — name, description, thumbnailUrl, embedUrl, author
- [ ] `BreadcrumbList` — Home → Creator → Recipe
- [ ] Later: `Recipe` when ingredients/steps exist

### Social / sharing

- [ ] `og:title`, `og:description`, `og:image`, `og:url` on every recipe page
- [ ] Twitter card tags (optional)

### Analytics (outreach proof, not ranking)

- [ ] Events: `recipe_page_view`, `shop_product_click`, `claim_cta_click` (PostHog or existing `analytics.js`)
- [ ] UTM params on any paid traffic tests

### Google Search Console

- [ ] Verify domain
- [ ] Submit sitemap
- [ ] Monitor Coverage, Core Web Vitals, manual actions

**Implementation notes**

```
Paths / scripts:
```

---

## Phase 2 — Content quality floor (pilot: top 20 first)

Do not index 93 thin pages on day one. Google deprioritizes title + embed only.

- [ ] **Tier A (start with 20 videos)** — Unique copy each:
  - [ ] 2–3 sentence summary (what it is + who it’s for)
  - [ ] 5–12 ingredient/product names (shop rail or manual)
  - [ ] Internal links: hub ↔ recipe; 2–3 related recipes
- [ ] **Tier B (remaining)** — `noindex` until Tier A complete or creator claims
- [ ] No page that is only title + YouTube embed

### Blog / internal linking

- [ ] One hub post linking to `/c/foodwishes` + top recipes
- [ ] Homepage or footer link to pilot creator hub

**Tier A recipe slugs (fill in)**

| # | Slug | Title | Copy done |
|---|------|-------|-----------|
| 1 | | | [ ] |
| 2 | | | [ ] |
| … | | | |

---

## Phase 3 — Claim flow

- [ ] Claim landing — `/claim` or hub `?claim=1`
- [ ] Verification — YouTube OAuth, channel email, or pinned-comment code
- [ ] On claim: `claimed: true`, remove `noindex`, swap placeholder → creator affiliate IDs
- [ ] Proof pack for email — clicks, modeled earnings, GSC impressions when available
- [ ] Free tier on claim; Pro when limits hit or analytics wanted

**Outreach email checklist**

- [ ] Personalized demo URL
- [ ] Click / CTR stats (even small N)
- [ ] Modeled commission (labeled “estimated” until their tag is connected)
- [ ] Single CTA: claim profile

---

## Phase 4 — Outreach (first 5–20 creators)

- [ ] Target list (niche, Shorts-heavy food creators)
- [ ] Pre-build hub + recipes via same import pipeline
- [ ] Outreach batch 1 sent
- [ ] Track funnel: sent → opened → claimed → Pro

| Creator | Hub built | Contacted | Claimed | Notes |
|---------|-----------|-----------|---------|-------|
| Food Wishes | [ ] | [ ] | [ ] | Pilot |
| | | | | |

---

## Phase 5 — Traffic experiments

- [ ] Small ad test ($50–200) on 2–3 recipe keywords — measure shop clicks for deck, not profit
- [ ] After first claim: ask for one link (YouTube description, pinned comment, or bio)
- [ ] Compare Crave URL CTR vs their prior link-in-bio if they share data

---

## Phase 6 — Scale and monetize

- [ ] Import + static gen for new creators from URL list
- [ ] Index only pages passing content floor
- [ ] Pro upgrade triggers (9 video / 1 affiliate link limits on Free — see `public/pricing.html`)
- [ ] Published case study from claimed creator with real affiliate data
- [ ] Optional later: rev share on **new** merchant deals Crave sources (not hijacking existing links)

---

## Legal and trust (parallel)

- [ ] FTC affiliate disclosure on every shoppable page
- [ ] Unclaimed demo labeling
- [ ] Takedown / “not affiliated” request process
- [ ] Amazon Associates (and partner) program rules — correct tagging, no misleading redirects
- [ ] Privacy policy covers analytics on recipe pages

---

## Affiliate and revenue policy (reference)

| Stage | Affiliate revenue | Platform revenue |
|-------|-------------------|------------------|
| Pre-claim demo | **None** (track clicks only) | None |
| Claimed, Free | Creator’s tags | $0 |
| Claimed, Pro ($39/mo) | Creator’s tags | Subscription |
| Later | Creator’s tags + optional rev share on Crave-sourced deals | SaaS + optional % |

**Creator ROI pitch:** incremental affiliate + traffic > subscription cost — prove with dashboard before hard-selling Pro.

---

## Current repo state vs plan

| Done | Still needed |
|------|----------------|
| 93 Food Wishes URLs + YouTube titles + **slugs** (`foodwishes-shorts.generated.js`) | Static HTML at canonical URLs (Phase 1) |
| Locked URL scheme + prototype `/c/foodwishes/{slug}` + Vercel rewrites | `docs/URL-SCHEME.md` |
| `noindex, follow` on unclaimed Food Wishes pages + indexing flags | `docs/UNCLAIMED-INDEXING-POLICY.md` |
| Pre-claim affiliate: track clicks only, no outbound URLs | `docs/UNCLAIMED-AFFILIATE-POLICY.md` |
| Unclaimed disclaimer + claim CTA on prototype pages | `docs/UNCLAIMED-DISCLAIMER-POLICY.md` |
| Pilot locked: Food Wishes (`foodwishes`, 93 shorts) | `docs/PILOT-CREATOR-FOODWISHES.md` |
| Prototype profile + vertical viewer (`/prototype1/`) | Static HTML per recipe |
| Import script with oEmbed titles | Slugs in import output |
| — | `sitemap.xml`, `robots.txt`, GSC |
| — | `noindex` on unclaimed / thin pages |
| — | Unique copy on Tier A pages |
| — | JSON-LD, canonical, og tags in HTML |
| — | Claim flow + affiliate swap |

**Key paths**

- Shorts list: `prototype1/data/foodwishes-shorts.txt`
- Import: `node scripts/import-youtube-shorts.mjs … --write prototype1/src/data/foodwishes-shorts.generated.js`
- Prototype posts: `prototype1/src/data/posts.js`
- Production post shell (generic title): `public/p/index.html`

---

## MVP definition of done (SEO + claim pilot)

- [ ] 5 recipe URLs serve unique static HTML (title, description, canonical, schema, og:image)
- [ ] Creator hub at `/c/foodwishes` links to all recipes; only 5 indexed, rest `noindex`
- [ ] `sitemap.xml` lists indexed URLs only
- [ ] GSC property verified; sitemap submitted
- [ ] At least 1 recipe URL reaches “Indexed” in GSC (typical: 2–4 weeks)
- [ ] Claim CTA live; analytics tracks shop clicks on those pages

---

## Suggested execution order

1. Phase 0 — decisions and disclaimer copy  
2. Phase 1 — slug + static generator + sitemap (prove with 5 pages)  
3. Phase 2 — unique copy for those 5; submit GSC  
4. Phase 3 — claim CTA (waitlist or simple form OK for v0)  
5. Phase 4 — one outreach batch with click report  
6. Expand Tier A to 20, then remaining videos or on-claim

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-29 | Initial plan from product/SEO strategy session |
