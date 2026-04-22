<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Crave static site. The existing `analytics.js` already initialized `posthog-js` via CDN — the integration activates it with the real project token, exposes the instance as `window.posthog` for cross-script access, and adds `posthog.capture()` calls across the key user-action touchpoints: the marketing page waitlist CTAs, the recipe post page (ingredient saving, shop button, saved-items drawer), and the feed grid (tile clicks).

| Event | Description | File |
|---|---|---|
| `waitlist_cta_clicked` | User clicks a "Join the waitlist" CTA on the marketing homepage — top of conversion funnel | `public/index.html` |
| `ingredient_saved` | User saves an ingredient to their list, via the timed popup or the ingredient rail; includes `source`, `product_name`, `product_price`, `post_id` | `public/app.js` |
| `shop_now_clicked` | User opens affiliate links from the "Shop Now" button in the saved-items drawer; includes `saved_item_count`, `affiliate_link_count` | `public/app.js` |
| `shop_ingredients_clicked` | User taps the "Shop ingredients" / "Shop Now" action pill on the video; includes `has_shop_url` | `public/app.js` |
| `saved_items_drawer_opened` | User opens the saved-items drawer, indicating purchase intent; includes `saved_item_count` | `public/app.js` |
| `feed_tile_clicked` | User clicks a recipe tile in the feed grid to view a post; includes `post_id`, `post_title`, `creator_id` | `public/feed.js` |

## Next steps

To monitor user behavior and conversion, create an **"Analytics basics"** dashboard in PostHog (https://us.posthog.com/project/392065) with these five insights:

1. **Waitlist conversion funnel** — Funnel: `$pageview` (marketing page) → `waitlist_cta_clicked` → (Google Form submit, tracked externally). Shows how many visitors click through to the waitlist.

2. **Ingredient save rate** — Trend of `ingredient_saved` events, broken down by `source` (popup vs. rail). Reveals which UI drives more saves.

3. **Shop-now conversion** — Trend of `shop_now_clicked`. This is the key revenue-intent signal: users who click this are ready to buy.

4. **Post engagement funnel** — Funnel: `feed_tile_clicked` → `ingredient_saved` → `shop_now_clicked`. Shows the full in-app conversion path from browsing to purchase intent.

5. **Saved-items drawer open rate** — Trend of `saved_items_drawer_opened` vs. `ingredient_saved`. A large gap means users save ingredients but don't follow through to the drawer — a churn signal.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
