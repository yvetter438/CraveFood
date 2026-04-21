# Crave — Product overview and vision

This document summarizes **what Crave is**, **where the product is headed**, and **the founder’s intent**, based on prior working sessions in this repository’s context. It is meant for onboarding, investors, or your future self when you move the project to a new host or team.

---

## What Crave is

**Crave is a link-in-bio–style experience built specifically for recipe and food creators.** It is not a generic list of links: it centers on **short-form vertical video** (TikTok / Reels–style) and **timed on-screen highlights** so viewers see ingredients and products *while* the recipe plays—without leaving the video for a separate shopping screen.

Core user journeys that shaped the build:

1. **Creator hub (feed)** — A grid of posts (e.g. three per row) that feels like a creator’s TikTok or Instagram profile, so visitors can find the right video before opening it.
2. **Post / recipe page** — Full-screen-style vertical playback with **Shop ingredients**, an **ingredient list** tied to that video, **timed pop-ups** aligned to the timeline, and a **cart** that supports discovery across videos (saved items, affiliate redirects—not an owned checkout).

The first prototype explicitly targeted **recipe videos** with **buyable-ish items** surfaced in the player—optimized for people arriving from **Instagram or TikTok** on mobile, with a path back to a **profile-style** page rather than a flat link tree.

---

## Product principles (from how you chose to build)

- **Video-first, smooth playback** — You favored **self-hosted (or directly served) video** over embeds because embeds felt like they would **break the smooth, app-like feel** of the experience.
- **Shopping without owning checkout** — Fresh grocery aggregation and universal “buy everything in one cart” were deliberately **out of scope**. The direction settled on **clicking through to affiliate and partner links** so **the creator earns on purchases** without you running payments or fulfillment.
- **Realistic shopper behavior** — You assumed most viewers would **not** buy every ingredient in a recipe; they might want **one or two** standout items. The UX should support **lightweight picks**, not forced full-basket flows.
- **Creators keep their economics** — **Bring-your-own (BYO) affiliate tags** (e.g. Amazon Associates) aligns incentives: creators keep commissions; Crave can charge for **software and hosting** separately. You noted BYO implies **backend + persistence** later.
- **Demos over perfection early** — For validation, you optimized for **fast, tailored demo pages** and **feedback** over a full billing stack on day one.

---

## Commerce and monetization direction

**Near term (as discussed):**

- **Amazon Associates** and similar affiliate links for physical goods.
- **DTC food brands** and **creator-owned** products.
- **Digital goods** (e.g. eBooks, recipe packs) as a **later** layer.

**Business model (evolution in conversation):**

- **SaaS for creators** (reasonable monthly fee) plus optional **placement of their links** at the top of the page.
- You explored **~$20/month** versus a market where many link-in-bio tools are **very cheap**, and wondered whether **video hosting** justifies a higher price—an open question tied to positioning and tiering.
- **Free tier / waitlist** — You weighed whether “free” makes sense and landed on **waitlist + feedback** while **very early**: food creators double as **distribution**; non-paying users can still **sharpen the product**. A logical upgrade path might center on **more videos** (creators produce a lot of content; monetization scales with catalog size).
- **GTM** — **Cold outreach** (on the order of **hundreds** of creators), **email links** to **hand-built demos**, and a **Google Form** for waitlist / interest (speed over custom backend).

Pricing pages were considered, then **removed** from the live demo narrative to **reduce friction** while testing the idea.

---

## Where the product is going

**Immediate trajectory (from your stated priorities):**

- **Scale personalized demos** — Many **static or data-driven pages** per creator (e.g. ~**9 videos** per prospect), with a path toward **slug-based URLs** (`/c` for creator, `/p` for a post) that read cleanly in outbound email.
- **Faster demo creation (future tooling)** — Ideals included: paste a **video link**, help extract **recipe / ingredients** (e.g. from captions or comments), suggest **1–5 products** (plus occasional **appliances**), and wire them to **timed overlays**—**Amazon links** acceptable for v1 automation.
- **Accounts and persistence** — Public, unlisted-style demo URLs are fine for now; the same patterns should **prototype** what **logged-in creators** will need later (BYO tags, saved configs).

**Experience refinements you cared about:**

- **Responsive layout** — Clear behavior when resizing or on small screens; video treatment should stay intentional (not broken desktop layouts).
- **Integrated panels** — Ingredient UI should feel **part of the video surface**, not a heavy gray overlay that fights scrolling.
- **Cart as “saved affiliate list”** — Keep the cart metaphor but use it to **batch-open or store** items for **affiliate destinations**, not checkout.
- **Cross-video cart** — Saving interest when **browsing multiple recipes** in one session.
- **Strong CTAs** — e.g. **Shop Now** instead of vague “open shop” language.

**Marketing site:**

- **Single landing** driving to **waitlist (Google Form)**; messaging you wanted centered on: *focused link-in-bio for recipe creators*, **vertical feed**, **timed ingredient highlights**, **your Amazon tags**, **100% of commissions to the creator**—with a **warm gradient / brand** feel (not harsh black-and-white), reading as a **credible small business**.

---

## Vision (one paragraph)

**Crave aims to be the link-in-bio that food creators actually want for revenue:** video-native, mobile-native, and honest about how people shop from recipe content—**a few affiliate clicks, not a fantasy grocery cart.** The company’s wedge is **beautiful demos and creator-branded hubs** that prove demand, then **software + hosting** that scales **BYO affiliate economics**, with room to grow into **digital products, automation, and creator tooling** once the core loop is validated.

---

## Source notes

Synthesized from Cursor agent transcripts for this project:

- [Initial web prototype](02d98573-c131-438f-a010-d29c8537fcd7) — vertical recipe player, timed ingredients, cart, feed/navigation experiments.
- [Product, GTM, and site iteration](31d650ef-69d4-44b6-bc94-03559f084157) — link-in-bio feed, business model, waitlist, URLs, demo scale, post-page polish.
- [Transfer packaging](7c5111a6-48a4-48d3-acad-6429989d4275) — static-site deployment assumptions (included for completeness).

---

*Last aligned to repo state and chats as of documentation creation. Update this file when strategy or positioning changes materially.*
