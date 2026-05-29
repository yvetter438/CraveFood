import ThumbnailImage from "./ThumbnailImage.jsx";
import { formatMoney } from "../lib/format.js";

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
        <h2>In this recipe</h2>
        <p className="shop-rail-hint">Ingredients appear on the video while it plays — save items or open affiliate links.</p>
      </div>
      <ul className="product-list" id="productList" ref={listRef}>
        {post.products.map((p) => {
          const canOpen = Boolean(p.affiliateUrl || post.shopUrl);
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLink(p.id);
                  }}
                >
                  Open link
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
