"use client";

import { useEffect, type RefObject } from "react";

/* The document never scrolls, so a wheel over the fixed panel would do
   nothing. Forward it to whichever scroller is showing — the feed, or the
   open project — so the page scrolls wherever the pointer happens to be.
   Trackpad deltas pass straight through.

   It forwards with `target.scrollBy()` — a programmatic scroll, which the
   project scroller never sees as a wheel event of its own. Anything that ever
   needs to measure wheel INTENT has to listen on `window` rather than here,
   or it will be deaf over the panel and double-count over the feed. */
export function useWheelForward(
  from: RefObject<HTMLElement | null>,
  to: () => HTMLElement | null,
) {
  useEffect(() => {
    const source = from.current;
    if (!source) return;
    const onWheel = (e: WheelEvent) => {
      /* a trackpad pinch arrives as a ctrl-wheel: forwarding it scrolls the
         project while the reader is trying to zoom */
      if (e.ctrlKey) return;
      const target = to();
      if (!target) return;
      const lines = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? target.clientHeight : 1;
      target.scrollBy({ top: e.deltaY * lines, left: 0 });
    };
    source.addEventListener("wheel", onWheel, { passive: true });
    return () => source.removeEventListener("wheel", onWheel);
  }, [from, to]);
}
