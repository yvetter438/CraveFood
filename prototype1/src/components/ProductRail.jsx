import ThumbnailImage from "./ThumbnailImage.jsx";
import { formatMoney } from "../lib/format.js";
import { postAllowsAffiliateOutbound } from "../lib/affiliatePolicy.js";
import { shopLinkAriaLabel, shopLinkButtonLabel } from "../lib/shopLinks.js";

import { forwardRef } from "react";

const ProductRail = forwardRef(function ProductRail(
  {
    post,
    isOpen = true,
    activeProductId,
    pulseProductId,
    onAdd,
    onOpenLink,
    onCardTap,
    onClose,
    listRef,
    railId = "shopRail",
  },
  ref
) {
  return (
    <aside
      ref={ref}
      className={`shop-rail p1-shop-rail${isOpen ? " p1-shop-rail--open" : ""}`}
      id={railId}
      aria-label="Shoppable ingredients"
      hidden={!isOpen}
    >
      <div className="shop-rail-header">
        <div className="shop-rail-header-text">
          <h2>In this recipe</h2>
          <p className="shop-rail-hint">
          {postAllowsAffiliateOutbound(post)
            ? "Ingredients appear on the video while it plays — save items or shop affiliate links."
            : "Save items while you watch. Shop taps are tracked on this demo; creator links go live after claim."}
          </p>
        </div>
        {onClose ? (
          <button type="button" className="icon-btn shop-rail-close" onClick={onClose} aria-label="Close ingredients">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        ) : null}
      </div>
      <ul className="product-list" id="productList" ref={listRef}>
        {post.products.map((p) => {
          const canOpen = true;
          const classes = ["product-card"];
          if (activeProductId === p.id) classes.push("is-cue-active");
          if (pulseProductId === p.id) classes.push("is-pulse");
          return (
            <li
              key={p.id}
              className={classes.join(" ")}
              data-product-id={p.id}
              onClick={(e) => {
                if (e.target.closest(".btn-add") || e.target.closest(".btn-link-open")) return;
                onCardTap(p.id);
              }}
            >
              <ThumbnailImage className="product-thumb" src={p.image} alt={p.name} width={52} height={52} loading="lazy" />
              <div className="product-body">
                <p className="product-name">{p.name}</p>
                <p className="product-meta">{p.detail}</p>
                <p className="product-price">{formatMoney(p.price)}</p>
              </div>
              <div className="product-actions">
                <button
                  type="button"
                  className="btn-link-open"
                  disabled={!canOpen}
                  aria-label={shopLinkAriaLabel(post)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLink(p.id);
                  }}
                >
                  {shopLinkButtonLabel(post)}
                </button>
                <button
                  type="button"
                  className="btn-add"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(p.id);
                  }}
                >
                  Save +
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
});

export default ProductRail;
