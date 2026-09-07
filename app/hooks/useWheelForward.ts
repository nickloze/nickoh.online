"use client";

import { useEffect, type RefObject } from "react";

/* The document never scrolls, so a wheel over the fixed panel would do
   nothing. Forward it to the feed instead, so the page scrolls wherever the
   pointer happens to be. Trackpad deltas pass straight through. */
export function useWheelForward(
  from: RefObject<HTMLElement | null>,
  to: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const source = from.current;
    if (!source) return;
    const onWheel = (e: WheelEvent) => {
      const target = to.current;
      if (!target) return;
      const lines = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? target.clientHeight : 1;
      target.scrollBy({ top: e.deltaY * lines, left: 0 });
    };
    source.addEventListener("wheel", onWheel, { passive: true });
    return () => source.removeEventListener("wheel", onWheel);
  }, [from, to]);
}
