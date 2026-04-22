# Demo outreach — URLs, video, PostHog, and follow-up

This is a practical runbook for **sending one-off creator demos** and deciding **whether to keep building**, without a backend. It matches the static site in `public/`.

---

## 1. Custom creator URLs (what works today)

| Kind | Use in email / DMs | Notes |
|------|--------------------|--------|
| **Short creator hub** | `https://<your-domain>/c/<slug>` | e.g. `.../c/jalalsamfit` — Vercel **rewrites** to `c/index.html?slug=<slug>`. |
| **Explicit (always works locally too)** | `https://<your-domain>/c/index.html?slug=<slug>` | Same page; `npm run dev` (static `serve`) has **no rewrites** — this form is safest for local testing. |
| **Recipe post (short, production)** | `https://<your-domain>/p/<postId>` | e.g. `.../p/honey_chili_crisp` — rewrites to `p/index.html?id=...` on Vercel. |
| **Recipe (universal)** | `.../p/index.html?id=<postId>` | What the in-app grid still links to so **local** preview works. |

**Adding a new creator** is a **data** change, not a new HTML file:

1. **`public/creators-config.js`** — add a row: `id` (this is the `slug` in the URL), `displayName`, `handle`, `bio`, `avatarInitial`.
2. **`public/posts-config.js`** — for each video/post: `creatorId` must match that `id`, set `videoFile`, title, `id` (this is the `postId` in links), and optional `shopUrl` / products.

**No deploy-time generator** — you’re editing two JS files and dropping assets. For speed, you can copy-paste a previous creator block and rename fields.

---

## 2. Video: a simple “drop in folder + wire path” flow

1. **Encode** vertical-ish MP4, reasonable bitrate for mobile (you already self-host in `public/`).
2. **Place the file** under `public/`, e.g. `public/creatorid_recipename.mp4` (or use `public/media/<slug>/01.mp4` if you want folders — then set `videoFile` in `posts-config.js` to that path **from the site root**, e.g. `media/alex/01.mp4`).
3. **Point the post** at that path: `videoFile: "media/alex/01.mp4"` or `"alex_crispy_tacos.mp4"`.
4. **Deploy** — no build; push and let Vercel (or your host) pick up the new static files.

**Quick checklist per demo**

- [ ] `creators-config.js` row for this person  
- [ ] One or more `POSTS` with matching `creatorId` + `videoFile` paths that exist in `public/`  
- [ ] Open `/c/index.html?slug=...` locally, click through to a post, confirm video loads  

---

## 3. PostHog: open + clicks (and what to look at)

**Setup**

1. Create a [PostHog](https://posthog.com) project (US or EU; set `CRAVE_POSTHOG_API_HOST` in Vercel or `.env` if not using the default US host).
2. In **Vercel** → Project → **Environment Variables**: add `CRAVE_POSTHOG_KEY` = your **Project API key** (`phc_...`). Optional: `CRAVE_POSTHOG_API_HOST` (e.g. `https://eu.i.posthog.com` for EU). The build runs `scripts/inject-analytics-config.mjs` and **generates** `public/analytics-config.js` (gitignored) — you do not commit the key.  
   - The key is still a **public browser** key; restrict by **domain** in PostHog for production.
3. For **local** dev, put the same vars in **`.env`** (gitignored) or run without them for a no-op. Then `npm run dev` (which runs the inject script first). Deploy: Vercel runs `npm run build`, which injects the key. `public/analytics.js` only loads PostHog when the key is non-empty.

**What gets sent (automatically)**

- **Pageviews / leave** (PostHog default + `crave_page`, `creator_slug`, `post_id` on each load via `register`).  
- **Clicks** on buttons/links where PostHog **autocapture** applies (e.g. waitlist, `Shop` CTAs, tiles — not blocked by your markup).

**Session replay** is **off** in code (`disable_session_recording: true`) for a lighter, less creepy cold-email pass; you can turn replays on in the project later if you want.

**Useful PostHog views for “did they care?”**

- Funnel: **$pageview** on your marketing home → same session **$pageview** with `crave_page` = `creator` or `post`.  
- Break down by `creator_slug` to see which demo link was used.  
- Clicks: events like **autocapture** for “Join the waitlist” or outbound links.  

You don’t *need* a single numeric threshold to “continue or stop.” A practical mix is:

- **Low volume, high quality** — e.g. a few people opening the **creator** URL and at least one **post** in-session is already signal for a hand-built demo.  
- **Waitlist** — form submissions in Google Form + (optional) PostHog for “came from which demo” by UTM on the form link.  
- **Replies** — if your thesis is *relationship* not *scale*, weight email replies and call-bookings over raw PV count.

**Optional next step (later)** — UTM on links in email: `?slug=alex&utm_source=email&utm_campaign=demo-2026-04` and pass `utm_*` from `location.search` into PostHog with one extra `register` in `analytics.js`.

---

## 4. Suggested “send” flow

1. Add creator + posts + video files; test locally.  
2. Set PostHog env vars in Vercel; deploy.  
3. **Email copy (example):** one line value prop + `https://yoursite.com/c/theirname` (or `?slug=theirname` if you prefer explicit).  
4. In PostHog, watch that slug’s pageviews and clicks for 7–14 days, combine with any reply / waitlist / call.  
5. Iterate **copy** or **one recipe** in `posts-config.js` before you invest in product build-out.

---

## 5. Files touched for analytics

| File | Role |
|------|------|
| `public/analytics-config.js` | **Generated** at build / `npm run dev` from `CRAVE_POSTHOG_KEY` (gitignored). |
| `public/analytics-config.example.js` | Reference for shape; real values come from Vercel or `.env`. |
| `scripts/inject-analytics-config.mjs` | Writes `analytics-config.js` from env. |
| `public/analytics.js` | Loads PostHog (ESM from esm.sh), init, `register` for `crave_*`. |
| `vercel.json` | `rewrites` for `/c/:slug` and `/p/:id` on production. |

**Ad blockers** can block third-party scripts; a meaningful fraction of data is still enough for early validation.

---

*Adjust thresholds and UTM as you get real reply volume; this is meant to stay light.*
