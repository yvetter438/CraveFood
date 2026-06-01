# Unclaimed demo disclaimer

**Status:** Active (2026-05-29)  
**Scope:** Food Wishes pilot and future pre-claim creator profiles in the prototype app.  
**Related:** [SEO-CLAIM-GTM-PLAN.md](./SEO-CLAIM-GTM-PLAN.md) Phase 0, [UNCLAIMED-INDEXING-POLICY.md](./UNCLAIMED-INDEXING-POLICY.md), [UNCLAIMED-AFFILIATE-POLICY.md](./UNCLAIMED-AFFILIATE-POLICY.md)

---

## Policy (locked)

Every **unclaimed** demo profile must show a clear, visible notice:

> **Demo profile · Not affiliated with {Creator name} · [Claim to manage]**

| Element | Purpose |
|---------|---------|
| Demo profile | Sets expectation — not the creator’s official page |
| Not affiliated with … | Avoids implied endorsement or partnership |
| Claim to manage | CTA for creators (and internal tracking) |

**When hidden:** `CREATOR.claimed === true` (and future per-creator claim from account DB).

**Claim link (interim):** Google waitlist form until Phase 3 `/claim` flow — `CLAIM_PROFILE_URL` in `prototype1/src/lib/disclaimerCopy.js`.

---

## Why

1. **Trust** — Visitors and creators should not think Crave is officially representing the channel pre-claim.
2. **Legal / FTC context** — Pairs with affiliate demo policy (no outbound monetization) and honest labeling.
3. **GTM** — “Claim to manage” is the same motion as outreach; clicks tracked as `claim_cta_click`.

---

## Implementation (this change)

| File | Role |
|------|------|
| `prototype1/src/lib/disclaimerCopy.js` | Copy strings + `showUnclaimedDisclaimer()` |
| `prototype1/src/components/UnclaimedDisclaimer.jsx` | Banner (hub) and compact (recipe viewer) |
| `prototype1/src/pages/FeedPage.jsx` | Banner below header |
| `prototype1/src/pages/PostPage.jsx` | Compact strip below top bar |
| `prototype1/src/index.css` | `.p1-unclaimed-disclaimer` styles |

**Does not replace** the small “Prototype 1” dev badge — that marks the tech stack; the disclaimer marks **business / affiliation** status.

### Hide after claim

Set `CREATOR.claimed = true` in `prototype1/src/data/posts.js` and rebuild.

---

## PostHog (claim CTA)

`claim_cta_click` — properties: `creator_id`, `cta_location` (`banner` | `compact`).

See [UNCLAIMED-AFFILIATE-POLICY.md](./UNCLAIMED-AFFILIATE-POLICY.md) for shop click events and PostHog setup status.

---

## Verification

1. Open `/prototype1/c/foodwishes` — disclaimer visible under header.
2. Open a recipe — compact disclaimer under top bar.
3. Set `CREATOR.claimed = true` → disclaimer disappears on hub and recipes.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-29 | Disclaimer component + copy on hub and recipe pages; claim CTA tracking. |
