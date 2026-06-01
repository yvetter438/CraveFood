/**
 * Crave — recipe video post page: timed shop cards, saved items + affiliate links.
 * Post data from posts-config.js (`?id=`). Optional post.shopUrl + product.affiliateUrl.
 */

const params = new URLSearchParams(location.search);
/** Same as /c/: on Vercel: /p/honey_… may have no ?id= in the address bar. */
const requestedId = (function resolvePostIdFromUrl() {
  const q = params.get("id");
  if (q) return q;
  const m = (location.pathname || "").match(/\/p\/([^/]+)\/?$/);
  if (!m) return null;
  const fromPath = m[1];
  if (fromPath === "index" || fromPath === "index.html") return null;
  try {
    return decodeURIComponent(fromPath);
  } catch (e) {
    return fromPath;
  }
})();
let activePost = requestedId ? getPostById(requestedId) : null;

function postPageQueryStringFor(postId) {
  const sp = new URLSearchParams();
  sp.set("id", postId);
  const fromCreator = params.get("creator");
  if (fromCreator) {
    sp.set("creator", fromCreator);
  }
  return sp.toString();
}

if (!activePost) {
  activePost = getDefaultPost();
  if (requestedId !== activePost.id) {
    const cr = params.get("creator");
    const path = `/p/${encodeURIComponent(activePost.id)}` + (cr ? `?creator=${encodeURIComponent(cr)}` : "");
    history.replaceState({}, "", path);
  }
}

const backFeedLink = document.querySelector(".back-feed-link");
if (backFeedLink && params.get("creator") && activePost.creatorId) {
  backFeedLink.href = "../c/" + encodeURIComponent(activePost.creatorId);
  backFeedLink.setAttribute("aria-label", "Back to creator");
}

const ASSET_PREFIX = typeof window.CRAVE_POST_ASSET_PREFIX === "string" ? window.CRAVE_POST_ASSET_PREFIX : "";

/** Shared default when a product image URL fails or is missing (file, then inline SVG). */
const INGREDIENT_THUMB_FALLBACK = `${ASSET_PREFIX}assets/ingredient-default.svg`;
const INGREDIENT_THUMB_FALLBACK_DATA =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#3d2f48"/><path d="M7 12h10M12 8v8" stroke="#ffb89a" stroke-width="1.5" stroke-linecap="round"/></svg>'
  );

function setThumbnailWithFallback(img, url) {
  const file = INGREDIENT_THUMB_FALLBACK;
  const data = INGREDIENT_THUMB_FALLBACK_DATA;
  img.onerror = function handleThumbError() {
    if (img.src === data) {
      img.onerror = null;
      return;
    }
    if (img.src === file) {
      img.src = data;
      return;
    }
    img.src = file;
  };
  const trimmed = url && String(url).trim();
  img.src = trimmed ? trimmed : file;
}

const PRODUCTS = activePost.products;
const TIMED_CUES_SEC = activePost.timedCuesSec;

/** Normalized 0–1, filled when video metadata is known */
let TIMED_CUES = [];

/** Persisted across recipes: key = "postId:productId" (localStorage). */
const SAVED_STORAGE_KEY = "craveSavedItems";

const cart = new Map();

function cartLineKey(postId, productId) {
  return `${postId}:${productId}`;
}

function parseCartLineKey(key) {
  const i = key.indexOf(":");
  if (i <= 0) return null;
  return { postId: key.slice(0, i), productId: key.slice(i + 1) };
}

function resolveCartLine(key) {
  const parsed = parseCartLineKey(key);
  if (!parsed) return null;
  const post = getPostById(parsed.postId);
  if (!post) return null;
  const product = post.products.find((x) => x.id === parsed.productId);
  if (!product) return null;
  return { post, product };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return;
    cart.clear();
    Object.entries(data).forEach(([k, v]) => {
      const qty = Number(v);
      if (!Number.isFinite(qty) || qty <= 0) return;
      const key = k.includes(":") ? k : cartLineKey(activePost.id, k);
      if (!resolveCartLine(key)) return;
      cart.set(key, Math.floor(qty));
    });
    persistCart();
  } catch (_) {}
}

function persistCart() {
  const obj = {};
  cart.forEach((qty, key) => {
    if (qty > 0) obj[key] = qty;
  });
  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(obj));
  } catch (_) {}
}

loadCartFromStorage();

/** Last product shown in the on-video popup; kept visible between cue gaps. */
let popupDisplayedProductId = null;

const els = {
  video: document.getElementById("mainVideo"),
  productList: document.getElementById("productList"),
  cartTrigger: document.getElementById("cartTrigger"),
  cartBadge: document.getElementById("cartBadge"),
  cartDrawer: document.getElementById("cartDrawer"),
  cartBackdrop: document.getElementById("cartBackdrop"),
  closeCart: document.getElementById("closeCart"),
  cartLines: document.getElementById("cartLines"),
  cartEmpty: document.getElementById("cartEmpty"),
  cartSubtotal: document.getElementById("cartSubtotal"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  shopAllBtn: document.getElementById("shopAllBtn"),
  shopRail: document.getElementById("shopRail"),
  toast: document.getElementById("toast"),
  ingredientPopup: document.getElementById("ingredientPopup"),
  ingredientPopupThumb: document.getElementById("ingredientPopupThumb"),
  ingredientPopupLabel: document.getElementById("ingredientPopupLabel"),
  ingredientPopupName: document.getElementById("ingredientPopupName"),
  ingredientPopupPrice: document.getElementById("ingredientPopupPrice"),
  ingredientPopupAdd: document.getElementById("ingredientPopupAdd"),
  recipeTitle: document.getElementById("recipeTitle"),
  recipeAuthor: document.getElementById("recipeAuthor"),
  recipeBlurb: document.getElementById("recipeBlurb"),
  recipeMacros: document.getElementById("recipeMacros"),
};

function forceCloseIngredientPopup() {
  clearTimeout(hideIngredientPopup._t);
  popupDisplayedProductId = null;
  els.ingredientPopup.classList.remove("is-enter", "is-exit");
  els.ingredientPopup.hidden = true;
  els.ingredientPopup.setAttribute("aria-hidden", "true");
}

function applyPostMeta() {
  document.title = `${activePost.title} · Crave`;
  els.video.src = ASSET_PREFIX + activePost.videoFile;
  els.recipeTitle.textContent = activePost.title;
  els.recipeAuthor.textContent = activePost.author;
  els.recipeBlurb.textContent = activePost.blurb;
  els.recipeMacros.textContent = activePost.macros;
  els.shopAllBtn.textContent = activePost.shopUrl ? "Shop Now" : "Shop ingredients";
  els.ingredientPopupAdd.textContent = "Save";
  forceCloseIngredientPopup();
  els.ingredientPopupLabel.textContent = "";
  els.ingredientPopupName.textContent = "";
  els.ingredientPopupPrice.textContent = "";
  els.ingredientPopupAdd.removeAttribute("data-product-id");
  els.ingredientPopupThumb.removeAttribute("src");
  els.ingredientPopupThumb.alt = "";
}

function rebuildTimedCues() {
  const d = els.video.duration;
  if (!d || !isFinite(d) || d < 0.1) {
    TIMED_CUES = [];
    return;
  }
  TIMED_CUES = TIMED_CUES_SEC.map((c) => {
    const start = Math.min(1, Math.max(0, c.start / d));
    const end = Math.min(1, Math.max(0, c.end / d));
    return { productId: c.productId, start, end: Math.max(start + 0.002, end) };
  });
}

function updateIngredientPopupContent(productId) {
  const p = PRODUCTS.find((x) => x.id === productId);
  if (!p) return false;
  setThumbnailWithFallback(els.ingredientPopupThumb, p.image);
  els.ingredientPopupThumb.alt = p.name;
  els.ingredientPopupLabel.textContent = "On screen now";
  els.ingredientPopupName.textContent = p.name;
  els.ingredientPopupPrice.textContent = formatMoney(p.price);
  els.ingredientPopupAdd.dataset.productId = productId;
  return true;
}

function formatMoney(n) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    els.toast.hidden = true;
  }, 2200);
}

/** True if element is at least partly visible inside scroll parent */
function isInScrollParent(el, scrollParent) {
  if (!el || !scrollParent) return true;
  const pr = scrollParent.getBoundingClientRect();
  const er = el.getBoundingClientRect();
  return er.bottom > pr.top + 4 && er.top < pr.bottom - 4;
}

/** True on layouts where auto-scrolling the rail to the active card would yank the whole page (mobile column). */
function shouldScrollRailToCue() {
  if (typeof window.matchMedia !== "function") return true;
  return !window.matchMedia("(max-width: 768px)").matches;
}

/** Matches the on-video card — stays highlighted while that ingredient is in-frame */
function setCueActiveHighlight(productId) {
  document.querySelectorAll(".product-card").forEach((card) => {
    card.classList.toggle("is-cue-active", Boolean(productId) && card.dataset.productId === productId);
  });
  if (productId && shouldScrollRailToCue()) {
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    if (card && els.productList && !isInScrollParent(card, els.productList)) {
      card.scrollIntoView({ behavior: "auto", block: "nearest" });
    }
  }
}

/** Short pulse (e.g. Shop ingredients, row tap, Add from list) */
function pulseRailProduct(id) {
  const card = document.querySelector(`[data-product-id="${id}"]`);
  if (!card) return;
  card.classList.remove("is-pulse");
  void card.offsetWidth;
  card.classList.add("is-pulse");
  clearTimeout(pulseRailProduct._t);
  pulseRailProduct._t = setTimeout(() => card.classList.remove("is-pulse"), 650);
}

function getActiveCue() {
  const v = els.video;
  const d = v.duration;
  if (!d || !isFinite(d)) return null;
  const t = v.currentTime;
  return TIMED_CUES.find((c) => t >= c.start * d && t < c.end * d) || null;
}

function hideIngredientPopup() {
  els.ingredientPopup.classList.add("is-exit");
  els.ingredientPopup.classList.remove("is-enter");
  clearTimeout(hideIngredientPopup._t);
  hideIngredientPopup._t = setTimeout(() => {
    els.ingredientPopup.hidden = true;
    els.ingredientPopup.setAttribute("aria-hidden", "true");
    els.ingredientPopup.classList.remove("is-exit");
  }, 220);
}

/**
 * True only in *short gaps between consecutive cues* (not after the last cue, not before the first).
 * A loose “before last segment end, after first start” test wrongly kept the last popup for the whole tail of the file.
 */
function isInInterIngredientGap(t, d) {
  if (!TIMED_CUES.length || !d || !isFinite(d)) return false;
  if (TIMED_CUES.some((c) => t >= c.start * d && t < c.end * d)) return false;
  for (let i = 0; i < TIMED_CUES.length - 1; i += 1) {
    const endI = TIMED_CUES[i].end * d;
    const startNext = TIMED_CUES[i + 1].start * d;
    if (t >= endI && t < startNext) return true;
  }
  return false;
}

function syncTimedPopup() {
  const cue = getActiveCue();
  const pid = cue ? cue.productId : null;
  const v = els.video;
  const d = v.duration;
  const t = v.currentTime;

  setCueActiveHighlight(pid);

  if (pid) {
    if (pid === popupDisplayedProductId) return;
    if (!updateIngredientPopupContent(pid)) {
      if (popupDisplayedProductId !== null) {
        popupDisplayedProductId = null;
        hideIngredientPopup();
      }
      return;
    }
    clearTimeout(hideIngredientPopup._t);
    const wasVisible = popupDisplayedProductId !== null;
    popupDisplayedProductId = pid;
    els.ingredientPopup.hidden = false;
    els.ingredientPopup.setAttribute("aria-hidden", "false");
    els.ingredientPopup.classList.remove("is-exit");
    if (wasVisible) {
      els.ingredientPopup.classList.remove("is-enter");
    } else {
      els.ingredientPopup.classList.add("is-enter");
    }
    return;
  }

  if (d && isFinite(d) && isInInterIngredientGap(t, d)) {
    return;
  }

  if (popupDisplayedProductId !== null) {
    popupDisplayedProductId = null;
    hideIngredientPopup();
  }
}

function addToCart(productId, qty = 1, source) {
  const p = PRODUCTS.find((x) => x.id === productId);
  if (!p) return;
  const key = cartLineKey(activePost.id, productId);
  const prev = cart.get(key) || 0;
  cart.set(key, prev + qty);
  persistCart();
  renderCart();
  showToast(`Saved · ${p.name}`);
  if (window.posthog) {
    window.posthog.capture("ingredient_saved", {
      product_id: productId,
      product_name: p.name,
      product_price: p.price,
      post_id: activePost.id,
      post_title: activePost.title,
      source: source || "rail",
    });
  }
}

function openPrimaryShopUrl() {
  const url = activePost.shopUrl;
  if (!url) return false;
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}

/** One product: `affiliateUrl` if set, else recipe `shopUrl` (same rule as cart line Shop). */
function openProductShopUrl(productId) {
  const p = PRODUCTS.find((x) => x.id === productId);
  if (!p) return;
  const url = p.affiliateUrl || activePost.shopUrl;
  if (!url) {
    showToast("No link for this product yet — add it in posts-config.js");
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

/** Per saved line: product affiliate URL, else that recipe’s shopUrl. Deduped across posts. */
function openSavedAffiliateLinks() {
  const seen = new Set();
  const urls = [];
  cart.forEach((qty, key) => {
    if (qty <= 0) return;
    const resolved = resolveCartLine(key);
    if (!resolved) return;
    const { post, product } = resolved;
    const u = product.affiliateUrl || post.shopUrl;
    if (u && !seen.has(u)) {
      seen.add(u);
      urls.push(u);
    }
  });
  if (urls.length === 0) {
    showToast("Add affiliate links in config, or set recipe shop URLs");
    return;
  }
  if (window.posthog) {
    window.posthog.capture("shop_now_clicked", {
      post_id: activePost.id,
      post_title: activePost.title,
      saved_item_count: cartItemCount(),
      affiliate_link_count: urls.length,
    });
  }
  urls.forEach((url, i) => {
    setTimeout(() => window.open(url, "_blank", "noopener,noreferrer"), i * 450);
  });
  showToast(`Opening ${urls.length} link${urls.length === 1 ? "" : "s"}…`);
}

function decrementCartLine(lineKey) {
  const q = cart.get(lineKey) || 0;
  if (q <= 1) cart.delete(lineKey);
  else cart.set(lineKey, q - 1);
  persistCart();
  renderCart();
}

function incrementCartLine(lineKey) {
  const q = cart.get(lineKey) || 0;
  if (q < 1) return;
  cart.set(lineKey, q + 1);
  persistCart();
  renderCart();
}

function renderProducts() {
  els.productList.innerHTML = "";
  PRODUCTS.forEach((p) => {
    const li = document.createElement("li");
    li.className = "product-card";
    li.dataset.productId = p.id;
    const canOpen = Boolean(p.affiliateUrl || activePost.shopUrl);
    li.innerHTML = `
      <img class="product-thumb" src="" alt="" width="52" height="52" loading="lazy" />
      <div class="product-body">
        <p class="product-name">${p.name}</p>
        <p class="product-meta">${p.detail}</p>
        <p class="product-price">${formatMoney(p.price)}</p>
      </div>
      <div class="product-actions">
        <button type="button" class="btn-link-open" data-open-link="${p.id}" ${
      canOpen ? "" : "disabled"
    }>Open link</button>
        <button type="button" class="btn-add" data-add="${p.id}">Save +</button>
      </div>
    `;
    els.productList.appendChild(li);
    setThumbnailWithFallback(li.querySelector(".product-thumb"), p.image);
  });

  els.productList.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".btn-add") || e.target.closest(".btn-link-open")) return;
      pulseRailProduct(card.dataset.productId);
    });
  });

  els.productList.querySelectorAll(".btn-link-open").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openProductShopUrl(btn.dataset.openLink);
    });
  });

  els.productList.querySelectorAll(".btn-add").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(btn.dataset.add);
      pulseRailProduct(btn.dataset.add);
    });
  });
}

function cartItemCount() {
  let n = 0;
  cart.forEach((q) => {
    n += q;
  });
  return n;
}

function cartSubtotal() {
  let t = 0;
  cart.forEach((qty, key) => {
    const resolved = resolveCartLine(key);
    if (!resolved) return;
    t += resolved.product.price * qty;
  });
  return t;
}

function renderCart() {
  const count = cartItemCount();
  if (count > 0) {
    els.cartBadge.hidden = false;
    els.cartBadge.textContent = String(count);
  } else {
    els.cartBadge.hidden = true;
  }

  els.cartLines.innerHTML = "";
  let empty = true;
  cart.forEach((qty, key) => {
    const resolved = resolveCartLine(key);
    if (!resolved || qty <= 0) return;
    const { post, product: p } = resolved;
    empty = false;
    const li = document.createElement("li");
    li.className = "cart-line";
    const shopUrl = p.affiliateUrl || post.shopUrl;
    const shop =
      shopUrl &&
      `<a class="cart-line-shop" href="${shopUrl}" target="_blank" rel="noopener noreferrer">Shop</a>`;
    const safeKey = encodeURIComponent(key);
    li.innerHTML = `
      <img class="product-thumb" src="" alt="" width="44" height="44" loading="lazy" decoding="async" />
      <div class="cart-line-info">
        <div class="cart-line-name">${escapeHtml(p.name)}</div>
        <div class="cart-line-recipe">${escapeHtml(post.title)}</div>
        <div class="cart-line-qty">Saved ×${qty} · ${formatMoney(p.price)} est.</div>
      </div>
      <div class="cart-line-actions">
        <button type="button" class="cart-qty-btn" data-dec="${safeKey}" aria-label="Remove one" title="Remove one">−</button>
        <button type="button" class="cart-qty-btn" data-inc="${safeKey}" aria-label="Add one" title="Add one">+</button>
      </div>
      <div class="cart-line-right">
        <div class="cart-line-price">${formatMoney(p.price * qty)}</div>
        ${shop || ""}
      </div>
    `;
    els.cartLines.appendChild(li);
    setThumbnailWithFallback(li.querySelector(".product-thumb"), p.image);
  });

  els.cartEmpty.hidden = !empty;
  els.cartLines.hidden = empty;
  els.cartSubtotal.textContent = formatMoney(cartSubtotal());
}

function openCart() {
  els.cartDrawer.hidden = false;
  els.cartTrigger.setAttribute("aria-expanded", "true");
  els.closeCart.focus();
  if (window.posthog) {
    window.posthog.capture("saved_items_drawer_opened", {
      post_id: activePost.id,
      post_title: activePost.title,
      saved_item_count: cartItemCount(),
    });
  }
}

function closeCart() {
  els.cartDrawer.hidden = true;
  els.cartTrigger.setAttribute("aria-expanded", "false");
  els.cartTrigger.focus();
}

els.cartTrigger.addEventListener("click", () => {
  if (els.cartDrawer.hidden) openCart();
  else closeCart();
});
els.cartBackdrop.addEventListener("click", closeCart);
els.closeCart.addEventListener("click", closeCart);

els.cartLines.addEventListener("click", (e) => {
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  if (inc) incrementCartLine(decodeURIComponent(inc.dataset.inc));
  else if (dec) decrementCartLine(decodeURIComponent(dec.dataset.dec));
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !els.cartDrawer.hidden) closeCart();
});

els.checkoutBtn.addEventListener("click", () => {
  if (cartItemCount() <= 0) {
    showToast("Nothing saved yet");
    return;
  }
  openSavedAffiliateLinks();
});

els.shopAllBtn.addEventListener("click", () => {
  if (window.posthog) {
    window.posthog.capture("shop_ingredients_clicked", {
      post_id: activePost.id,
      post_title: activePost.title,
      has_shop_url: Boolean(activePost.shopUrl),
    });
  }
  if (activePost.shopUrl && openPrimaryShopUrl()) {
    showToast("Opening…");
    return;
  }
  els.shopRail.scrollIntoView({ behavior: "smooth", block: "nearest" });
  const first = els.productList.querySelector(".product-card");
  if (first) pulseRailProduct(first.dataset.productId);
});

els.video.addEventListener("click", (e) => {
  if (e.target !== els.video) return;
  if (els.video.paused) els.video.play();
  else els.video.pause();
});

els.ingredientPopupAdd.addEventListener("click", (e) => {
  e.stopPropagation();
  const id = els.ingredientPopupAdd.dataset.productId;
  if (id) {
    addToCart(id, 1, "popup");
    pulseRailProduct(id);
  }
});

els.ingredientPopup.addEventListener("click", (e) => {
  e.stopPropagation();
});

["timeupdate", "seeked"].forEach((ev) => {
  els.video.addEventListener(ev, syncTimedPopup);
});

function syncVideoCuesFromMetadata() {
  rebuildTimedCues();
  syncTimedPopup();
}

els.video.addEventListener("loadedmetadata", syncVideoCuesFromMetadata);
els.video.addEventListener("loadeddata", syncVideoCuesFromMetadata);

/* Loop / seek to start: clear popup so the exit animation does not race the next cue. */
els.video.addEventListener("seeking", () => {
  if (els.video.currentTime < 0.35) {
    forceCloseIngredientPopup();
  }
});

applyPostMeta();
renderProducts();
renderCart();

if (els.video.readyState >= HTMLMediaElement.HAVE_METADATA) {
  syncVideoCuesFromMetadata();
} else {
  syncTimedPopup();
}
