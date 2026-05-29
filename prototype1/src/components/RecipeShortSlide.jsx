import { useCallback, useState } from "react";
import IngredientPopup from "./IngredientPopup.jsx";
import ProductRail from "./ProductRail.jsx";
import VideoMeta from "./VideoMeta.jsx";
import YoutubePlayer from "./YoutubePlayer.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useTimedIngredients } from "../hooks/useTimedIngredients.js";

export default function RecipeShortSlide({ post, isActive, muted, onToast }) {
  const { addToCart } = useCart();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { activeProductId, popupProduct, popupVisible, popupExiting, pulseProductId, pulseProduct } = useTimedIngredients(
    post,
    isActive ? currentTime : 0,
    isActive ? duration : 0
  );

  const openProductShopUrl = useCallback(
    (productId) => {
      const p = post.products.find((x) => x.id === productId);
      if (!p) return;
      const url = p.affiliateUrl || post.shopUrl;
      if (!url) {
        onToast?.("No link for this product yet — add it in posts config");
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
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

  const handleShopAll = useCallback(() => {
    if (post.shopUrl) {
      window.open(post.shopUrl, "_blank", "noopener,noreferrer");
      onToast?.("Opening…");
      return;
    }
    document.getElementById(`shopRail-${post.id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    const first = post.products[0];
    if (first) pulseProduct(first.id);
  }, [post, onToast, pulseProduct]);

  return (
    <article className="p1-shorts-slide" data-post-id={post.id} aria-label={post.title}>
      <main className="main p1-shorts-slide-main">
        <section className="stage" aria-label="Recipe video">
          <div className="video-shell p1-video-shell p1-video-shell--short">
            <div className="p1-yt-cover" aria-hidden="true">
              <YoutubePlayer
                youtubeUrl={post.youtubeUrl}
                variant="short"
                playing={isActive}
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

            <VideoMeta post={post} />

            <div className="video-actions">
              <button type="button" className="action-pill" onClick={handleShopAll}>
                {post.shopUrl ? "Shop Now" : "Shop ingredients"}
              </button>
            </div>
          </div>
        </section>

        <ProductRail
          post={post}
          activeProductId={isActive ? activeProductId : null}
          pulseProductId={pulseProductId}
          onAdd={handleAdd}
          onOpenLink={openProductShopUrl}
          onCardTap={pulseProduct}
          railId={`shopRail-${post.id}`}
        />
      </main>
    </article>
  );
}
