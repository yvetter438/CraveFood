import { useEffect } from "react";
import ThumbnailImage from "./ThumbnailImage.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getProductShopUrl } from "../lib/shopLinks.js";

export default function CartDrawer({ open, onClose, onToast }) {
  const { cart, resolveCartLine, decrementLine, incrementLine, cartSubtotal, openSavedAffiliateLinks, openLineShopUrl } =
    useCart();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const lines = [];
  cart.forEach((qty, key) => {
    const resolved = resolveCartLine(key);
    if (!resolved || qty <= 0) return;
    lines.push({ key, qty, ...resolved });
  });

  const handleOpenAll = () => {
    if (lines.length === 0) {
      onToast?.("Nothing saved yet");
      return;
    }
    const urls = openSavedAffiliateLinks();
    if (urls.length === 0) {
      onToast?.("No shop links configured yet");
      return;
    }
    urls.forEach((url, i) => {
      setTimeout(() => window.open(url, "_blank", "noopener,noreferrer"), i * 450);
    });
    onToast?.(`Opening ${urls.length} link${urls.length === 1 ? "" : "s"}…`);
    onClose();
  };

  const handleLineClick = (line) => {
    const url = getProductShopUrl(line.post, line.product);
    if (!url) {
      onToast?.("No link for this item");
      return;
    }
    if (openLineShopUrl(line.key)) {
      onToast?.(`Opening · ${line.product.name}`);
    }
  };

  return (
    <div className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cartDrawerTitle" hidden={!open}>
      <div className="cart-drawer-backdrop" tabIndex={-1} onClick={onClose} aria-hidden="true" />
      <div className="cart-drawer-panel">
        <div className="cart-drawer-head">
          <h2 id="cartDrawerTitle">Saved for later</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close saved list">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <p className="p1-cart-persist-hint">Stays on this device when you leave or come back (about 30 days).</p>
        <ul className="cart-lines" hidden={lines.length === 0}>
          {lines.map(({ key, qty, post, product }) => {
            const shopUrl = getProductShopUrl(post, product);
            return (
              <li key={key}>
                <button
                  type="button"
                  className="cart-line cart-line--clickable"
                  onClick={() => handleLineClick({ key, post, product })}
                  disabled={!shopUrl}
                >
                  <ThumbnailImage className="product-thumb" src={product.image} alt={product.name} width={44} height={44} loading="lazy" />
                  <div className="cart-line-info">
                    <div className="cart-line-name">{product.name}</div>
                    <div className="cart-line-recipe">{post.title}</div>
                    <div className="cart-line-qty">
                      Saved ×{qty}
                      {shopUrl ? " · Tap to shop" : ""}
                    </div>
                  </div>
                  <div className="cart-line-actions" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="cart-qty-btn" onClick={() => decrementLine(key)} aria-label="Remove one" title="Remove one">
                      −
                    </button>
                    <button type="button" className="cart-qty-btn" onClick={() => incrementLine(key)} aria-label="Add one" title="Add one">
                      +
                    </button>
                  </div>
                  <div className="cart-line-right">
                    <div className="cart-line-price">
                      {(product.price * qty).toLocaleString(undefined, { style: "currency", currency: "USD" })} est.
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="cart-empty" hidden={lines.length > 0}>
          Nothing saved yet — tap Save on an ingredient while you watch.
        </div>
        <footer className="cart-footer">
          <div className="cart-total-row">
            <span>Est. subtotal</span>
            <strong>{cartSubtotal}</strong>
          </div>
          <p className="cart-footer-hint">Tap any item to open its shop link. Your list stays saved after you close this.</p>
          <button type="button" className="btn-primary" onClick={handleOpenAll}>
            Open all saved links
          </button>
        </footer>
      </div>
    </div>
  );
}
