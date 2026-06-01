import { useCallback, useEffect, useRef, useState } from "react";
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
    isActive ? currentTime : 0,
    isActive ? duration : 0
  );

  useEffect(() => {
    if (!isActive) setShopOpen(false);
  }, [isActive]);

  const openShopRail = useCallback(() => {
    setShopOpen(true);
    requestAnimationFrame(() => {
      railRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, []);

  const openProductShopUrl = useCallback(
    (productId) => {
      const p = post.products.find((x) => x.id === productId);
      if (!p) return;
      attemptShopLinkOpen(post, p, { source: "product_rail" });
    },
    [post, onToast]
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

  return (
    <article className="p1-shorts-slide" data-post-id={post.id} aria-label={post.title}>
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
                playing={isActive && !userPaused}
                muted={muted}
                onProgress={(t) => {
                  if (isActive) setCurrentTime(t);
                }}
                onDuration={(d) => {
                  if (isActive) setDuration(d);
                }}
              />
            </div>
            <div className="video-gradient" aria-hidden="true" />

            <div className="video-overlay" aria-live="polite">
              <IngredientPopup
                visible={isActive && popupVisible}
                exiting={popupExiting}
                product={popupProduct}
                onSave={(e) => {
                  e.stopPropagation();
                  if (popupProduct) handleAdd(popupProduct.id);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="video-actions">
              <button type="button" className="action-pill" onClick={openShopRail} aria-expanded={shopOpen}>
                View ingredients
              </button>
            </div>
            </div>
          </section>

          <ProductRail
            ref={railRef}
            post={post}
            isOpen={shopOpen}
            activeProductId={isActive ? activeProductId : null}
            pulseProductId={pulseProductId}
            onAdd={handleAdd}
            onOpenLink={openProductShopUrl}
            onCardTap={pulseProduct}
            railId={`shopRail-${post.id}`}
          />
        </div>
      </main>
    </article>
  );
}
