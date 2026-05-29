import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getActiveCue, isInInterIngredientGap, rebuildTimedCues } from "../lib/timedCues.js";

export function useTimedIngredients(post, currentTime, duration) {
  const [popupProductId, setPopupProductId] = useState(null);
  const [popupExiting, setPopupExiting] = useState(false);
  const [pulseProductId, setPulseProductId] = useState(null);
  const hideTimer = useRef(null);
  const pulseTimer = useRef(null);

  const timedCues = useMemo(
    () => rebuildTimedCues(post.timedCuesSec, duration),
    [post.timedCuesSec, duration]
  );

  const activeCue = getActiveCue(timedCues, currentTime, duration);
  const activeProductId = activeCue?.productId ?? null;

  const popupProduct = popupProductId ? post.products.find((p) => p.id === popupProductId) : null;
  const popupVisible = Boolean(popupProductId && popupProduct && !popupExiting);

  const hidePopup = useCallback(() => {
    setPopupExiting(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setPopupProductId(null);
      setPopupExiting(false);
    }, 220);
  }, []);

  const forceClosePopup = useCallback(() => {
    clearTimeout(hideTimer.current);
    setPopupProductId(null);
    setPopupExiting(false);
  }, []);

  const pulseProduct = useCallback((id) => {
    setPulseProductId(id);
    clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulseProductId(null), 650);
  }, []);

  useEffect(() => {
    const pid = activeProductId;

    if (pid) {
      if (pid === popupProductId && !popupExiting) return;
      clearTimeout(hideTimer.current);
      setPopupExiting(false);
      setPopupProductId(pid);
      return;
    }

    if (duration && Number.isFinite(duration) && isInInterIngredientGap(timedCues, currentTime, duration)) {
      return;
    }

    if (popupProductId !== null) hidePopup();
  }, [activeProductId, currentTime, duration, timedCues, popupProductId, popupExiting, hidePopup]);

  useEffect(() => {
    if (currentTime < 0.35) forceClosePopup();
  }, [currentTime, forceClosePopup]);

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
