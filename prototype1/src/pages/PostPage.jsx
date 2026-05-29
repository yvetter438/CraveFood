import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import CartDrawer from "../components/CartDrawer.jsx";
import PrototypeBadge from "../components/PrototypeBadge.jsx";
import RecipeShortSlide from "../components/RecipeShortSlide.jsx";
import { useCart } from "../context/CartContext.jsx";
import { CREATOR, getDefaultPost, getPostById, getPostsForCreator, POSTS } from "../data/posts.js";
import { useToast } from "../hooks/useToast.js";

const WAITLIST_URL = "https://forms.gle/Ut8bRDfcMP9fZYTN6";

export default function PostPage() {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const creatorSlug = searchParams.get("creator");

  const posts = useMemo(() => {
    if (creatorSlug === CREATOR.id || !creatorSlug) return getPostsForCreator(CREATOR.id);
    return POSTS;
  }, [creatorSlug]);

  const scrollRef = useRef(null);
  const slideRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(() => {
    const idx = posts.findIndex((p) => p.id === paramId);
    return idx >= 0 ? idx : 0;
  });
  const [muted, setMuted] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const skipParamScrollSync = useRef(false);

  const { message: toastMessage, visible: toastVisible, showToast } = useToast();
  const { cartItemCount } = useCart();

  const activePost = posts[activeIndex] || posts[0];

  useEffect(() => {
    document.body.className = "page-post p1-shorts-mode";
    return () => {
      document.body.className = "";
    };
  }, []);

  useEffect(() => {
    if (paramId && getPostById(paramId)) return;
    const def = posts[0] || getDefaultPost();
    navigate(`/p/${def.id}${creatorSlug ? `?creator=${creatorSlug}` : ""}`, { replace: true });
  }, [paramId, creatorSlug, navigate, posts]);

  const scrollToIndex = useCallback((index, behavior = "auto") => {
    const slide = slideRefs.current[index];
    const container = scrollRef.current;
    if (!slide || !container) return;
    if (behavior === "smooth") {
      slide.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      container.scrollTop = slide.offsetTop;
    }
  }, []);

  useEffect(() => {
    if (skipParamScrollSync.current) {
      skipParamScrollSync.current = false;
      return;
    }
    const idx = posts.findIndex((p) => p.id === paramId);
    if (idx < 0) return;
    setActiveIndex(idx);
    requestAnimationFrame(() => scrollToIndex(idx));
  }, [paramId, posts, scrollToIndex]);

  useEffect(() => {
    if (!activePost) return;
    document.title = `${activePost.title} · Crave`;
  }, [activePost]);

  const syncActiveFromScroll = useCallback(() => {
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
    syncActiveFromScroll();
    container.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    return () => container.removeEventListener("scroll", syncActiveFromScroll);
  }, [syncActiveFromScroll, posts.length]);

  useEffect(() => {
    const post = posts[activeIndex];
    if (!post || post.id === paramId) return;
    skipParamScrollSync.current = true;
    const qs = creatorSlug ? `?creator=${encodeURIComponent(creatorSlug)}` : "";
    navigate(`/p/${post.id}${qs}`, { replace: true });
  }, [activeIndex, posts, paramId, creatorSlug, navigate]);

  const backHref = creatorSlug === CREATOR.id || !creatorSlug ? "/" : "/";

  return (
    <div className="app p1-shorts-app" id="app">
      <header className="top-bar p1-shorts-top">
        <Link to={backHref} className="back-feed-link back-feed-link--icon" aria-label="Back to feed">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <Link to="/" className="logo logo-link top-bar-logo">
          Crave
        </Link>
        <div className="top-bar-actions">
          <PrototypeBadge />
          <a
            className="btn-marketing btn-marketing--primary btn-waitlist-sm"
            href={WAITLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join the waitlist"
          >
            <span className="waitlist-cta__long">Join the waitlist</span>
            <span className="waitlist-cta__short" aria-hidden="true">
              List
            </span>
          </a>
          <button
            type="button"
            className="cart-trigger"
            aria-expanded={cartOpen}
            aria-controls="cartDrawer"
            aria-label="Saved items"
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
            <RecipeShortSlide post={post} isActive={activeIndex === i} muted={muted} onToast={showToast} />
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
