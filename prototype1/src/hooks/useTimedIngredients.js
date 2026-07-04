import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getActiveCue, isInInterIngredientGap, rebuildTimedCues } from "../lib/timedCues.js";

const POPUP_SWAP_MS = 200;

export function useTimedIngredients(post, currentTime, duration, isActive) {
  const [popupProductId, setPopupProductId] = useState(null);
  const [popupExiting, setPopupExiting] = useState(false);
  const [pulseProductId, setPulseProductId] = useState(null);
  const hideTimer = useRef(null);
  const pulseTimer = useRef(null);
  const swapTimer = useRef(null);

  const timedCues = useMemo(
    () => rebuildTimedCues(post.timedCuesSec, duration),
    [post.timedCuesSec, duration]
  );

  const activeCue = getActiveCue(timedCues, currentTime, duration);
  const activeProductId = activeCue?.productId ?? null;

  const popupProduct = popupProductId ? post.products.find((p) => p.id === popupProductId) : null;
  const popupVisible = Boolean(popupProductId && popupProduct && !popupExiting);

  const clearTimers = useCallback(() => {
    clearTimeout(hideTimer.current);
    clearTimeout(swapTimer.current);
  }, []);

  const hidePopup = useCallback(() => {
    setPopupExiting(true);
    clearTimers();
    hideTimer.current = setTimeout(() => {
      setPopupProductId(null);
      setPopupExiting(false);
    }, POPUP_SWAP_MS);
  }, [clearTimers]);

  const forceClosePopup = useCallback(() => {
    clearTimers();
    setPopupProductId(null);
    setPopupExiting(false);
  }, [clearTimers]);

  const showPopup = useCallback(
    (pid) => {
      if (!pid || popupExiting) return;

      if (pid === popupProductId) return;

      if (popupProductId) {
        setPopupExiting(true);
        clearTimers();
        swapTimer.current = setTimeout(() => {
          setPopupProductId(pid);
          setPopupExiting(false);
        }, POPUP_SWAP_MS);
        return;
      }

      clearTimers();
      setPopupProductId(pid);
    },
    [popupProductId, popupExiting, clearTimers]
  );

  const pulseProduct = useCallback((id) => {
    setPulseProductId(id);
    clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulseProductId(null), 650);
  }, []);

  useEffect(() => {
    if (!isActive) {
      forceClosePopup();
    }
  }, [isActive, forceClosePopup]);

  useEffect(() => {
    if (!isActive || popupExiting) return;

    const pid = activeProductId;

    if (pid) {
      showPopup(pid);
      return;
    }

    if (duration && Number.isFinite(duration) && isInInterIngredientGap(timedCues, currentTime, duration)) {
      return;
    }

    if (popupProductId !== null) hidePopup();
  }, [
    isActive,
    popupExiting,
    activeProductId,
    currentTime,
    duration,
    timedCues,
    popupProductId,
    showPopup,
    hidePopup,
  ]);

  useEffect(() => {
    if (!isActive) return;
    if (currentTime < 0.35) forceClosePopup();
  }, [isActive, currentTime, forceClosePopup]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    activeProductId,
    popupProduct,
    popupVisible,
    popupExiting,
    pulseProductId,
    pulseProduct,
    forceClosePopup,
  };
}
