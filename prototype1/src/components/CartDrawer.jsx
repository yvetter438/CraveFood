import { useEffect } from "react";
import ThumbnailImage from "./ThumbnailImage.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function CartDrawer({ open, onClose, onToast }) {
  const { cart, resolveCartLine, decrementLine, incrementLine, cartSubtotal, openSavedAffiliateLinks } = useCart();

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

  const handleCheckout = () => {
    if (lines.length === 0) {
      onToast?.("Nothing saved yet");
      return;
    }
    const urls = openSavedAffiliateLinks();
    if (urls.length === 0) {
      onToast?.("Add affiliate links in config, or set recipe shop URLs");
      return;
    }
    urls.forEach((url, i) => {
      setTimeout(() => window.open(url, "_blank", "noopener,noreferrer"), i * 450);
    });
    onToast?.(`Opening ${urls.length} link${urls.length === 1 ? "" : "s"}…`);
  };

  return (
    <div className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cartDrawerTitle" hidden={!open}>
      <div className="cart-drawer-backdrop" tabIndex={-1} onClick={onClose} aria-hidden="true" />
      <div className="cart-drawer-panel">
        <div className="cart-drawer-head">
          <h2 id="cartDrawerTitle">Saved items</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close saved list">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <ul className="cart-lines" hidden={lines.length === 0}>
          {lines.map(({ key, qty, post, product }) => {
            const shopUrl = product.affiliateUrl || post.shopUrl;
            return (
              <li key={key} className="cart-line">
                <ThumbnailImage className="product-thumb" src={product.image} alt={product.name} width={44} height={44} loading="lazy" />
                <div className="cart-line-info">
                  <div className="cart-line-name">{product.name}</div>
                  <div className="cart-line-recipe">{post.title}</div>
                  <div className="cart-line-qty">
                    Saved ×{qty} · {product.price.toLocaleString(undefined, { style: "currency", currency: "USD" })} est.
                  </div>
                </div>
                <div className="cart-line-actions">
                  <button type="button" className="cart-qty-btn" onClick={() => decrementLine(key)} aria-label="Remove one" title="Remove one">
                    −
                  </button>
                  <button type="button" className="cart-qty-btn" onClick={() => incrementLine(key)} aria-label="Add one" title="Add one">
                    +
                  </button>
                </div>
                <div className="cart-line-right">
                  <div className="cart-line-price">
                    {(product.price * qty).toLocaleString(undefined, { style: "currency", currency: "USD" })}
                  </div>
                  {shopUrl ? (
                    <a className="cart-line-shop" href={shopUrl} target="_blank" rel="noopener noreferrer">
                      Shop
                    </a>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="cart-empty" hidden={lines.length > 0}>
          Nothing saved yet — tap Save on an ingredient.
        </div>
        <footer className="cart-footer">
          <div className="cart-total-row">
            <span>Est. subtotal</span>
            <strong>{cartSubtotal}</strong>
          </div>
          <p className="cart-footer-hint">Prices are estimates; opens affiliate links in new tabs.</p>
          <button type="button" className="btn-primary" onClick={handleCheckout}>
            Shop Now
          </button>
        </footer>
      </div>
    </div>
  );
}
