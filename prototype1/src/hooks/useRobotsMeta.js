import { useEffect } from "react";
import { robotsMetaContent } from "../lib/seoIndexing.js";

const META_NAME = "robots";

function ensureRobotsMetaElement() {
  let el = document.querySelector(`meta[name="${META_NAME}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", META_NAME);
    document.head.appendChild(el);
  }
  return el;
}

/** Sync <meta name="robots"> with indexing policy for the current view. */
export function useRobotsMeta(indexable) {
  useEffect(() => {
    const el = ensureRobotsMetaElement();
    el.setAttribute("content", robotsMetaContent(indexable));
  }, [indexable]);
}
