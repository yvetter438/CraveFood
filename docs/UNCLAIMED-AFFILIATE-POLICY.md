# Unclaimed affiliate policy

**Status:** Active (2026-05-29)  
**Scope:** Food Wishes prototype (`/c/foodwishes/*`) and future pre-claim creator demos.  
**Related:** [SEO-CLAIM-GTM-PLAN.md](./SEO-CLAIM-GTM-PLAN.md) Phase 0, [UNCLAIMED-INDEXING-POLICY.md](./UNCLAIMED-INDEXING-POLICY.md)

---

## Policy (locked)

| Stage | Outbound affiliate links | Revenue | Measurement |
|-------|--------------------------|---------|-------------|
| **Pre-claim demo** | **None** — do not open placeholder or Crave platform tags | **$0** to Crave | Track `shop_link_click` events |
| **After claim** | Creator’s `shopUrl` / per-product `affiliateUrl` | **100% to creator** (SaaS only for Crave) | Same events + real outbound opens |

**Pre-claim UX:** Buttons stay usable — they **log shop interest** and show a short demo toast. No new tab to `/affiliate-placeholder.html` or any monetized URL.

**After claim:** Set `CREATOR.claimed` and/or per-post `claimed: true`, wire real URLs in `SHORT_META` (`shopUrl`, product links). Buttons open creator affiliate links in a new tab.

---

## Why

1. **Ethics** — Avoid earning or simulating earnings on a creator’s audience before they opt in.
2. **Claim pitch** — Outreach can cite measured shop intent: *“N people tapped shop on your demo.”*
3. **Aligns with pricing** — [pricing.html](../public/pricing.html): creators keep affiliate commissions; Crave charges for software.

---

## Implementation (this change)

### Policy logic

| File | Role |
|------|------|
| `prototype1/src/lib/affiliatePolicy.js` | `postAllowsAffiliateOutbound`, `getOutboundShopUrl` |
| `prototype1/src/lib/shopLinks.js` | `attemptShopLinkOpen` — track always; open URL only if allowed |
| `prototype1/src/lib/shopAnalytics.js` | PostHog `shop_link_click` + `crave:shop_link_click` DOM event |

### Data

- `CREATOR.claimed` — default `false` (`posts.js`)
- `SHORT_META[].claimed` — default `false` (import script)
- Unclaimed posts: `shopUrl: null`, `product.affiliateUrl: null` at build time
- Claimed posts: restore URLs from meta / demo products (replace placeholder with creator URLs in import)

### UI

- Product rail hint + **“Log interest”** button label (vs **“Open link”** when claimed)
- Cart: tap still works; demo copy; **“Log interest for all saved”** when unclaimed
- Toast: `DEMO_SHOP_TOAST` when click does not open a tab

### Analytics (PostHog)

**Status: live when `CRAVE_POSTHOG_KEY` is set** (see `public/analytics-config.js`, injected at build from Vercel / `.env`).

| Piece | Status |
|-------|--------|
| `prototype1/index.html` loads `analytics-config.js` + `analytics.js` | ✅ |
| Project key in repo / deploy | ✅ (browser key; restrict by domain in PostHog) |
| Custom event `shop_link_click` on “Log interest” / shop taps | ✅ via `shopAnalytics.js` |
| Queue if PostHog still loading (~3s retry) | ✅ |
| `public/analytics.js` registers `recipe_slug` for `/c/{creator}/{slug}` URLs | ✅ |
| Ad blockers / empty key | Events no-op; `crave:shop_link_click` DOM event still fires for debugging |

**Verify in PostHog:** Activity → Live events → filter `shop_link_click` after tapping **Log interest** on a recipe.

**Not yet:** dedicated dashboard; claim funnel tiles (optional Phase 3).

### Enable creator links after claim

1. Set `CREATOR.claimed = true` in `prototype1/src/data/posts.js`.
2. Optionally set `claimed: true` per row in `foodwishes-shorts.generated.js`.
3. Add real `shopUrl` / product affiliate URLs to meta (import or manual).
4. Rebuild prototype — buttons become **Open link** and open tabs.

---

## Verification

1. Open a recipe → **Log interest** on an ingredient → toast appears, **no** new tab.
2. PostHog (or `window` listener): `shop_link_click` with `demo_profile: true`, `outbound_opened: false`.
3. Set `CREATOR.claimed = true` + rebuild → **Open link** opens creator URL.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-29 | Pre-claim outbound blocked; shop intent tracking; docs + UI copy. |
