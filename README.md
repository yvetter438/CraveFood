# CraveFood

## What lives where

| Location | Role |
|----------|------|
| **`public/`** | **The whole website.** Plain HTML, CSS, and client-side JS—what you open in a browser. Deploy *this folder’s contents* (or the repo with root = `public`) to any static host. |
| **`docs/`** | Product / ops docs (`PRODUCT_VISION.md`, `DEMO_ROLLOUT.md`, `SEO-CLAIM-GTM-PLAN.md`). Not part of the live site unless you put copies under `public/`. |
| **`package.json`** | **Optional tooling** for local preview only: runs a static file server that serves `public/` on port 3000. **Not a backend**—no build step, no framework. |

There is no `src/` app anymore: the marketing page, feed, creator page (`/c/`), recipe page (`/p/`), configs, and videos all live under **`public/`**.

**Live site:** [https://crave.food](https://crave.food).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see `index.html` at `/`.

### Do **not** use `next dev`

This repo is **static files only** (there is no `src/app` / Next.js app router). If you run **`next dev`**, you’ll see errors like `ENOENT ... scandir '.../src/app'` and posts may return 500s. **Stop** that process and use `npm run dev` (the `serve` static server from this `package.json`) instead.

If you ever ran Next here, delete stale artifacts: `rm -rf .next`, and remove old Next deps from `node_modules` (`rm -rf node_modules && npm install`).

## Edit the site

- **`public/index.html`** — landing copy and waitlist CTAs  
- **`public/config.js`** — `window.CRAVE_WAITLIST_FORM_URL`  
- **`public/creators-config.js`**, **`public/posts-config.js`** — creators, posts, video paths  
- **`public/*.mp4`** — demo videos (paths must match `posts-config.js`)

## Product context

- **`docs/PRODUCT_VISION.md`** — vision, principles, and roadmap for onboarding or investors.
- **`docs/DEMO_ROLLOUT.md`** — creator URLs, PostHog, and a lightweight demo-creation + follow-up workflow.
- **`docs/SEO-CLAIM-GTM-PLAN.md`** — living checklist: claim-first GTM, SEO per recipe, outreach, and MVP milestones.
- **`docs/URL-SCHEME.md`** — locked canonical URLs (`/c/{creatorId}/{recipeSlug}` on crave.food).
- **`docs/UNCLAIMED-INDEXING-POLICY.md`** — `noindex, follow` on unclaimed demos; when to allow search indexing.

## Deploy

### Vercel

This repo includes **`vercel.json`**: **Framework = Other** (`framework: null`), **Output Directory = `public`**, and a no-op **`npm run build`** so Vercel does **not** run `next build`.

After the first deploy, in the project **Settings → General → Framework Preset**, confirm it shows **Other** (or leave as overridden by `vercel.json`). If an old project was created as Next.js, redeploy after pushing `vercel.json`.

### Other hosts

Point your host at **`public/`** as the static root (Netlify, GitHub Pages, S3, etc.). No compile step.
