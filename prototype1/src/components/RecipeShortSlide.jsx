import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import IngredientPopup from "./IngredientPopup.jsx";
import ProductRail from "./ProductRail.jsx";
import YoutubePlayer from "./YoutubePlayer.jsx";
import { useCart } from "../context/CartContext.jsx";
import { attemptShopLinkOpen } from "../lib/shopLinks.js";
import { useTimedIngredients } from "../hooks/useTimedIngredients.js";

export default function RecipeShortSlide({ post, isActive, muted, onToast }) {
  const { addToCart } = useCart();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shopOpen, setShopOpen] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const railRef = useRef(null);

  useEffect(() => {
    if (isActive) setUserPaused(false);
  }, [isActive, post.id]);

  const { activeProductId, popupProduct, popupVisible, popupExiting, pulseProductId, pulseProduct } = useTimedIngredients(
    post,
    currentTime,
    duration,
    isActive
  );

  const popupProductNumber = useMemo(() => {
    if (!popupProduct) return null;
    const index = post.products.findIndex((p) => p.id === popupProduct.id);
    return index >= 0 ? index + 1 : null;
  }, [popupProduct, post.products]);

  useEffect(() => {
    if (!isActive) setShopOpen(false);
  }, [isActive]);

  useEffect(() => {
    if (!shopOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShopOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shopOpen]);

  const openShopRail = useCallback(() => {
    setShopOpen(true);
  }, []);

  const closeShopRail = useCallback(() => {
    setShopOpen(false);
  }, []);

  const openProductShopUrl = useCallback(
    (productId) => {
      const p = post.products.find((x) => x.id === productId);
      if (!p) return;
      attemptShopLinkOpen(post, p, { source: "product_rail" });
    },
    [post]
  );

  const handleAdd = useCallback(
    (productId) => {
      const product = addToCart(post.id, productId);
      if (product) {
        onToast?.(`Saved · ${product.name}`);
        pulseProduct(productId);
      }
    },
    [addToCart, post.id, onToast, pulseProduct]
  );

  const handlePopupClick = useCallback(() => {
    if (!popupProduct) return;
    openShopRail();
    pulseProduct(popupProduct.id);
  }, [popupProduct, openShopRail, pulseProduct]);

  return (
    <article className="p1-shorts-slide" data-post-id={post.id} aria-label={post.title}>
      {shopOpen ? (
        <div className="p1-ingredients-backdrop" onClick={closeShopRail} aria-hidden="true" />
      ) : null}

      <main className="main p1-shorts-slide-main">
        <div className="p1-media-row">
          <section className="stage p1-stage" aria-label="Recipe video">
            <div className="video-shell p1-video-shell p1-video-shell--short">
              <div className="p1-yt-cover">
                <button
                  type="button"
                  className="p1-yt-tap"
                  aria-label={userPaused ? "Play video" : "Pause video"}
                  onClick={() => setUserPaused((p) => !p)}
                />
                <YoutubePlayer
                  youtubeUrl={post.youtubeUrl}
                  posterUrl={post.feedThumb}
                  variant="short"
                  playing={isActive && !userPaused && !shopOpen}
                  muted={muted}
                  onProgress={(t) => {
                    setCurrentTime(t);
                  }}
                  onDuration={(d) => {
                    setDuration(d);
                  }}
                />
              </div>
              <div className="video-gradient" aria-hidden="true" />

              <div className="video-overlay" aria-live="polite">
                <IngredientPopup
                  visible={isActive && popupVisible && !shopOpen}
                  exiting={popupExiting}
                  product={popupProduct}
                  productNumber={popupProductNumber}
                  onClick={handlePopupClick}
                />
              </div>

              <div className="video-actions">
                <button type="button" className="action-pill" onClick={openShopRail} aria-expanded={shopOpen}>
                  View ingredients
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <ProductRail
        ref={railRef}
        post={post}
        isOpen={shopOpen}
        activeProductId={isActive ? activeProductId : null}
        pulseProductId={pulseProductId}
        onAdd={handleAdd}
        onOpenLink={openProductShopUrl}
        onCardTap={pulseProduct}
        onClose={closeShopRail}
        railId={`shopRail-${post.id}`}
      />
    </article>
  );
}
