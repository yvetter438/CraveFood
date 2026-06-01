import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CartDrawer from "../components/CartDrawer.jsx";
import UnclaimedDisclaimer from "../components/UnclaimedDisclaimer.jsx";
import RecipeShortSlide from "../components/RecipeShortSlide.jsx";
import ShortSlidePlaceholder from "../components/ShortSlidePlaceholder.jsx";
import { useCart } from "../context/CartContext.jsx";
import {
  CREATOR,
  getDefaultPost,
  getPostByCreatorAndSlug,
  getPostsForCreator,
} from "../data/posts.js";
import { creatorHubPath, recipePath } from "../data/urlScheme.js";
import { useToast } from "../hooks/useToast.js";
import { useRobotsMeta } from "../hooks/useRobotsMeta.js";
import { postAllowsSearchIndexing } from "../lib/seoIndexing.js";
import { hasPostText } from "../lib/postMeta.js";

/** Only mount YouTube iframes near the active slide (avoids loading 90+ embeds). */
const PLAYER_RADIUS = 3;

function indexForRecipeSlug(posts, recipeSlug) {
  const idx = posts.findIndex((p) => p.slug === recipeSlug);
  return idx >= 0 ? idx : 0;
}

export default function PostPage() {
  const { creatorId, recipeSlug } = useParams();
  const navigate = useNavigate();

  const posts = useMemo(() => {
    if (creatorId === CREATOR.id) return getPostsForCreator(CREATOR.id);
    return [];
  }, [creatorId]);

  const scrollRef = useRef(null);
  const slideRefs = useRef([]);
  const scrollLockRef = useRef(false);
  const initialJumpDoneRef = useRef(false);
  const lastRecipeSlugRef = useRef(recipeSlug);

  const [activeIndex, setActiveIndex] = useState(() => indexForRecipeSlug(posts, recipeSlug));
  const [muted, setMuted] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  const { message: toastMessage, visible: toastVisible, showToast } = useToast();
  const { cartItemCount } = useCart();

  const activePost = posts[activeIndex] || posts[0];
  useRobotsMeta(postAllowsSearchIndexing(activePost));

  const scrollToIndexInstant = useCallback((index) => {
    const slide = slideRefs.current[index];
    const container = scrollRef.current;
    if (!slide || !container) return;
    scrollLockRef.current = true;
    container.scrollTop = slide.offsetTop;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollLockRef.current = false;
      });
    });
  }, []);

  useEffect(() => {
    document.body.className = "page-post p1-shorts-mode";
    return () => {
      document.body.className = "";
    };
  }, []);

  useEffect(() => {
    if (creatorId !== CREATOR.id) {
      navigate(`/c/${CREATOR.id}`, { replace: true });
      return;
    }
    if (!recipeSlug || !getPostByCreatorAndSlug(CREATOR.id, recipeSlug)) {
      const def = posts[0] || getDefaultPost();
      navigate(recipePath(CREATOR.id, def.slug), { replace: true });
    }
  }, [creatorId, recipeSlug, navigate, posts]);

  useLayoutEffect(() => {
    if (lastRecipeSlugRef.current !== recipeSlug) {
      initialJumpDoneRef.current = false;
      lastRecipeSlugRef.current = recipeSlug;
    }

    const idx = indexForRecipeSlug(posts, recipeSlug);
    setActiveIndex(idx);
    scrollToIndexInstant(idx);
    initialJumpDoneRef.current = true;
  }, [recipeSlug, posts, scrollToIndexInstant]);

  useEffect(() => {
    if (!activePost) return;
    document.title = `${activePost.title} · Crave`;
  }, [activePost]);

  const syncActiveFromScroll = useCallback(() => {
    if (scrollLockRef.current) return;
    const container = scrollRef.current;
    if (!container) return;
    const mid = container.scrollTop + container.clientHeight / 2;
    let best = 0;
    let bestDist = Infinity;
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      const center = el.offsetTop + el.offsetHeight / 2;
      const dist = Math.abs(center - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActiveIndex((prev) => (prev === best ? prev : best));
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    return () => container.removeEventListener("scroll", syncActiveFromScroll);
  }, [syncActiveFromScroll]);

  useEffect(() => {
    if (!initialJumpDoneRef.current) return;
    const post = posts[activeIndex];
    if (!post || post.slug === recipeSlug) return;
    navigate(recipePath(post.creatorId, post.slug), { replace: true });
  }, [activeIndex, posts, recipeSlug, navigate]);

  const shouldMountPlayer = useCallback(
    (i) => Math.abs(i - activeIndex) <= PLAYER_RADIUS,
    [activeIndex]
  );

  const backHref = creatorHubPath(creatorId || CREATOR.id);

  return (
    <div className="app p1-shorts-app" id="app">
      <header className="top-bar p1-shorts-top">
        <Link to={backHref} className="back-feed-link back-feed-link--icon p1-shorts-back" aria-label="Back to feed">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="p1-shorts-top-title" title={activePost?.title}>
          {hasPostText(activePost?.title) ? activePost.title : "Recipe"}
        </h1>
        <div className="p1-shorts-top-actions">
          <button
            type="button"
            className="cart-trigger"
            aria-expanded={cartOpen}
            aria-controls="cartDrawer"
            aria-label="Saved for later"
            onClick={() => setCartOpen((o) => !o)}
          >
            <span className="cart-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6h15l-1.5 9h-12z" />
                <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
                <path d="M6 6L5 3H2" />
              </svg>
            </span>
            <span className="cart-label">Saved</span>
            <span className="cart-badge" hidden={cartItemCount <= 0}>
              {cartItemCount}
            </span>
          </button>
          <button
            type="button"
            className="p1-mute-toggle"
            onClick={() => setMuted((m) => !m)}
            aria-pressed={!muted}
            aria-label={muted ? "Unmute video" : "Mute video"}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
        </div>
      </header>

      <UnclaimedDisclaimer creator={CREATOR} variant="compact" />

      <p className="p1-shorts-hint" aria-hidden="true">
        Swipe up for next · {activeIndex + 1} / {posts.length}
      </p>

      <div className="p1-shorts-scroll" ref={scrollRef} aria-label="Recipe shorts">
        {posts.map((post, i) => (
          <div
            key={post.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="p1-shorts-slide-wrap"
          >
            {shouldMountPlayer(i) ? (
              <RecipeShortSlide post={post} isActive={activeIndex === i} muted={muted} onToast={showToast} />
            ) : (
              <ShortSlidePlaceholder post={post} />
            )}
          </div>
        ))}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onToast={showToast} />

      <div className="toast" role="status" aria-live="polite" hidden={!toastVisible}>
        {toastMessage}
      </div>
    </div>
  );
}
