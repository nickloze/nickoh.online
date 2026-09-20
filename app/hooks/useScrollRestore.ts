"use client";

import { useLayoutEffect, type RefObject } from "react";

/* Browsers only restore the window's scroll position, and the feed is an
   inner scroller. Remember its offset per page in sessionStorage so a reload
   or a bfcache return lands where the reader left off. Restored before paint,
   and instantly — the feed is `scroll-smooth`, which would otherwise glide
   the page down from the top on every load. */
export function useScrollRestore(ref: RefObject<HTMLElement | null>, key: string) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const storageKey = `feed-scroll:${key}`;

    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) el.scrollTo({ top: Number(saved), behavior: "instant" });
    } catch {
      /* storage unavailable — nothing to restore */
    }

    let raf = 0;
    const save = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        try {
          sessionStorage.setItem(storageKey, String(el.scrollTop));
        } catch {
          /* ignore */
        }
      });
    };
    el.addEventListener("scroll", save, { passive: true });
    window.addEventListener("pagehide", save);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", save);
      window.removeEventListener("pagehide", save);
    };
  }, [ref, key]);
}
