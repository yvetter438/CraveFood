import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getPostById } from "../data/posts.js";
import { formatMoney } from "../lib/format.js";
import { getOutboundShopUrl } from "../lib/affiliatePolicy.js";
import { attemptShopLinkOpen } from "../lib/shopLinks.js";
import { readSavedCartObject, writeSavedCartObject } from "../lib/savedStorage.js";

const CartContext = createContext(null);

function cartLineKey(postId, productId) {
  return `${postId}:${productId}`;
}

function parseCartLineKey(key) {
  const i = key.indexOf(":");
  if (i <= 0) return null;
  return { postId: key.slice(0, i), productId: key.slice(i + 1) };
}

function resolveCartLine(key, getPost = getPostById) {
  const parsed = parseCartLineKey(key);
  if (!parsed) return null;
  const post = getPost(parsed.postId);
  if (!post) return null;
  const product = post.products.find((x) => x.id === parsed.productId);
  if (!product) return null;
  return { post, product };
}

function loadCartFromStorage() {
  const data = readSavedCartObject();
  if (!data) return new Map();
  const cart = new Map();
  Object.entries(data).forEach(([k, v]) => {
    const qty = Number(v);
    if (!Number.isFinite(qty) || qty <= 0) return;
    if (!resolveCartLine(k)) return;
    cart.set(k, Math.floor(qty));
  });
  return cart;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => loadCartFromStorage());

  const persist = useCallback((next) => {
    const obj = {};
    next.forEach((qty, key) => {
      if (qty > 0) obj[key] = qty;
    });
    writeSavedCartObject(obj);
  }, []);

  const updateCart = useCallback(
    (updater) => {
      setCart((prev) => {
        const next = new Map(prev);
        updater(next);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const addToCart = useCallback(
    (postId, productId, qty = 1) => {
      const post = getPostById(postId);
      const product = post?.products.find((x) => x.id === productId);
      if (!product) return null;
      const key = cartLineKey(postId, productId);
      updateCart((c) => {
        c.set(key, (c.get(key) || 0) + qty);
      });
      return product;
    },
    [updateCart]
  );

  const decrementLine = useCallback(
    (lineKey) => {
      updateCart((c) => {
        const q = c.get(lineKey) || 0;
        if (q <= 1) c.delete(lineKey);
        else c.set(lineKey, q - 1);
      });
    },
    [updateCart]
  );

  const incrementLine = useCallback(
    (lineKey) => {
      updateCart((c) => {
        const q = c.get(lineKey) || 0;
        if (q < 1) return;
        c.set(lineKey, q + 1);
      });
    },
    [updateCart]
  );

  const removeLine = useCallback(
    (lineKey) => {
      updateCart((c) => {
        c.delete(lineKey);
      });
    },
    [updateCart]
  );

  const cartItemCount = useMemo(() => {
    let n = 0;
    cart.forEach((q) => {
      n += q;
    });
    return n;
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    let t = 0;
    cart.forEach((qty, key) => {
      const resolved = resolveCartLine(key);
      if (!resolved) return;
      t += resolved.product.price * qty;
    });
    return t;
  }, [cart]);

  const openLineShopUrl = useCallback((lineKey) => {
    const resolved = resolveCartLine(lineKey);
    if (!resolved) return { opened: false, tracked: false };
    return attemptShopLinkOpen(resolved.post, resolved.product, { source: "cart_line" });
  }, []);

  const openSavedAffiliateLinks = useCallback(() => {
    const seen = new Set();
    const urls = [];
    cart.forEach((qty, key) => {
      if (qty <= 0) return;
      const resolved = resolveCartLine(key);
      if (!resolved) return;
      const { post, product } = resolved;
      const u = getOutboundShopUrl(post, product);
      if (u && !seen.has(u)) {
        seen.add(u);
        urls.push(u);
      }
    });
    return urls;
  }, [cart]);

  const trackAllSavedShopIntents = useCallback(() => {
    let tracked = 0;
    let opened = 0;
    const seen = new Set();
    cart.forEach((qty, key) => {
      if (qty <= 0) return;
      const resolved = resolveCartLine(key);
      if (!resolved) return;
      const dedupe = `${resolved.post.id}:${resolved.product.id}`;
      if (seen.has(dedupe)) return;
      seen.add(dedupe);
      const result = attemptShopLinkOpen(resolved.post, resolved.product, { source: "cart_open_all" });
      if (result.tracked) tracked += 1;
      if (result.opened) opened += 1;
    });
    return { tracked, opened };
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      cartLineKey,
      resolveCartLine: (key) => resolveCartLine(key),
      addToCart,
      decrementLine,
      incrementLine,
      removeLine,
      cartItemCount,
      cartSubtotal: formatMoney(cartSubtotal),
      cartSubtotalRaw: cartSubtotal,
      openSavedAffiliateLinks,
      openLineShopUrl,
      trackAllSavedShopIntents,
    }),
    [
      cart,
      addToCart,
      decrementLine,
      incrementLine,
      removeLine,
      cartItemCount,
      cartSubtotal,
      openSavedAffiliateLinks,
      openLineShopUrl,
      trackAllSavedShopIntents,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
