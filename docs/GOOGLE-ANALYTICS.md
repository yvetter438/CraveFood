# Google Analytics (GA4)

**Measurement ID:** `G-9DY2B1YRPL` (default; override with `CRAVE_GA_MEASUREMENT_ID` in Vercel or `.env`)

---

## How it loads

1. `analytics-config.js` — generated at build (`scripts/inject-analytics-config.mjs`)
2. `gtag.js` — loads `https://www.googletagmanager.com/gtag/js` and runs `gtag('config', …)`
3. `analytics.js` — PostHog (separate product)

Order on every page:

```html
<script src="/analytics-config.js"></script>
<script src="/gtag.js"></script>
<script src="/analytics.js"></script>
```

---

## Custom events (also in PostHog)

| Event | When |
|-------|------|
| `shop_link_click` | Log interest / shop tap (prototype) |
| `claim_cta_click` | Disclaimer “Claim to manage” |
| `recipe_page_view` | Static SEO recipe page (PostHog only today) |

GA receives `shop_link_click` and `claim_cta_click` via `window.craveGtagEvent`.

Page views are automatic from `gtag('config', id)`.

---

## Override ID

```bash
CRAVE_GA_MEASUREMENT_ID=G-XXXXXXXX npm run build
```

Or set `CRAVE_GA_MEASUREMENT_ID` in Vercel → redeploy.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-29 | Added `gtag.js` + env injection for G-9DY2B1YRPL. |
