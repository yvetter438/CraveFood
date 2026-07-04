import { useEffect } from "react";
import ThumbnailImage from "./ThumbnailImage.jsx";
import { useCart } from "../context/CartContext.jsx";
import { shopLinkAriaLabel, shopLinkButtonLabel } from "../lib/shopLinks.js";

export default function CartDrawer({ open, onClose, onToast }) {
  const { cart, resolveCartLine, removeLine, openLineShopUrl } = useCart();

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
    lines.push({ key, ...resolved });
  });

  const handleShopClick = (line) => {
    const { opened } = openLineShopUrl(line.key);
    if (opened) onToast?.(`Opening · ${line.product.name}`);
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
          {lines.map(({ key, post, product }) => (
            <li key={key} className="cart-line">
              <ThumbnailImage className="product-thumb" src={product.image} alt={product.name} width={44} height={44} loading="lazy" />
              <div className="cart-line-info">
                <div className="cart-line-name">{product.name}</div>
                <div className="cart-line-recipe">{post.title}</div>
              </div>
              <div className="cart-line-actions cart-line-actions--saved">
                <button
                  type="button"
                  className="btn-link-open"
                  aria-label={shopLinkAriaLabel(post)}
                  onClick={() => handleShopClick({ key, post, product })}
                >
                  {shopLinkButtonLabel(post)}
                </button>
                <button type="button" className="cart-line-remove" onClick={() => removeLine(key)} aria-label={`Remove ${product.name}`}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="cart-empty" hidden={lines.length > 0}>
          Nothing saved yet — tap Save on an ingredient while you watch.
        </div>
      </div>
    </div>
  );
}
