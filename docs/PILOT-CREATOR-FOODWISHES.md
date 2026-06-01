# Pilot creator: Food Wishes

**Status:** Active pilot (locked 2026-05-29)  
**Creator id:** `foodwishes`  
**Site:** [crave.food](https://crave.food)

Food Wishes is the **first full pilot** for pre-built profiles, SEO, shop-click measurement, and creator outreach. Other creators in `public/creators-config.js` remain separate legacy demos until they go through the same pipeline.

---

## Why Food Wishes

- Large catalog of **YouTube Shorts** (recipe-focused, shoppable intent).
- Strong **title SEO** potential (Chef John / technique names).
- Fits Crave’s **watch + shop** positioning without re-hosting video.
- Channel is well known enough to stress-test UX at scale (~90+ posts).

---

## Public URLs

| Page | URL |
|------|-----|
| Creator hub | https://crave.food/c/foodwishes |
| Recipe (example) | https://crave.food/c/foodwishes/how-to-slice-onions-with-fewer-tears |
| Local prototype | http://localhost:5173/prototype1/c/foodwishes |

Recipe URLs use **slugs from YouTube titles**, not internal ids like `foodwishes_24`.

---

## Inventory

| Item | Location |
|------|----------|
| Shorts source list | `prototype1/data/foodwishes-shorts.txt` |
| Generated URLs + meta | `prototype1/src/data/foodwishes-shorts.generated.js` |
| App posts + creator | `prototype1/src/data/posts.js` |
| Pilot id constant | `prototype1/src/data/pilotCreator.js` |
| Import / refresh | `node scripts/import-youtube-shorts.mjs prototype1/data/foodwishes-shorts.txt --write prototype1/src/data/foodwishes-shorts.generated.js` |
| Slugs only (offline) | Add `--no-titles` to keep existing titles |

**Scale:** 93 unique shorts (after dedup in import).

---

## Pilot behavior (current)

All Phase 0 rules apply to this creator only in the **prototype app** (`/prototype1` and Vercel rewrites for `/c/foodwishes/*`):

- **Unclaimed** — `CREATOR.claimed === false`
- **Search** — `noindex, follow` until claim or per-recipe unique shop copy
- **Affiliate** — shop taps tracked; no outbound affiliate tabs
- **Disclaimer** — “Demo profile · Not affiliated with Food Wishes · Claim to manage”

Production creator pages under `/c/jalalsamfit` etc. are unchanged.

---

## Outreach (when ready)

**Hub link for email / DMs:**

```
https://crave.food/c/foodwishes
```

**Example deep link (pick a high-intent short):**

```
https://crave.food/c/foodwishes/how-to-slice-onions-with-fewer-tears
```

**Talking points**

- Pre-built shoppable profile from their Shorts (demo, not official until claim).
- Shop interest clicks measured in PostHog (`shop_link_click`).
- Claim → wire their affiliate tags, indexing, full analytics (Pro).

**Before cold outreach**

- [ ] Confirm disclaimer visible on hub + one recipe URL
- [ ] Confirm `shop_link_click` in PostHog Live events
- [ ] Prepare 1–2 sentence pitch + hub link
- [ ] Optional: Tier A unique copy on 5 recipes before indexing (Phase 2)

---

## Enabling “live” creator mode (after claim)

1. Set `CREATOR.claimed = true` in `prototype1/src/data/posts.js`.
2. Set `claimed: true` on rows in `foodwishes-shorts.generated.js` (or batch via import).
3. Add real `shopUrl` / product affiliate URLs to `SHORT_META`.
4. Rebuild: `npm run build:prototype1`
5. Revisit indexing flags per `SHORT_META.hasUniqueShopCopy` / sitemap (Phase 1–2).

---

## Adding a second pilot later

Copy this pattern:

1. New `creatorId`, shorts txt + import script output.
2. Vercel rewrites for `/c/{newId}` and `/c/{newId}/:recipeSlug`.
3. New doc `PILOT-CREATOR-{id}.md` or generalize this file into a template.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-29 | Food Wishes locked as first SEO + outreach pilot; `pilotCreator.js` + this doc. |
