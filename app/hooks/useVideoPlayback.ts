"use client";

import { useEffect, type RefObject } from "react";
import { useMediaQuery } from "./useMediaQuery";

/* Which video plays: one "play group" per scroller at a time. There is no
   pause control — the active group loops for as long as it is active. The one
   thing that stops them is the system's own reduced-motion setting, which
   leaves every video on its still.

   A play group is any element marked `data-play-group` — one card cover or
   one gallery video. Elements that share a name (`data-play-group="pair"`)
   play together while they sit side by side — Petch's pair and its row of
   three phones on @desktop — and separately once @mobile stacks them.
   Everything else is paused on the frame it reached.

   The active group is the one under a focus line that walks down the
   scroller as it is read:

     focusY = top + height × (0.25 + 0.5 × progress)     progress = 0 … 1

   At rest it sits a quarter of the way down — inside the first card on
   @desktop (213 of 854) and @mobile (129 of 517) alike — so on load only the
   cover plays, and nothing below it starts early. At the end of the scroll it
   reaches the last group. A group only counts once a fair share of it is on
   screen, and the current one is kept until another is clearly closer, so
   two videos never trade places on every scroll tick.

   Only the active group and its neighbours are allowed to fetch
   (`preload="auto"`); the rest stay `preload="none"`. */

const HYSTERESIS = 32; /* px another group must beat the current one by */

export function useVideoPlayback(
  scroller: RefObject<HTMLElement | null>,
  { enabled }: { enabled: boolean },
) {
  /* a live query, not Motion's useReducedMotion, which is read once at mount —
     with no pause control this is the only thing that can stop the videos, so
     it has to follow a change made while the page is open */
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;

    const videosIn = (el: Element) =>
      Array.from(el.querySelectorAll<HTMLVideoElement>("video[data-loop-video]"));
    const pauseAll = () => videosIn(root).forEach((v) => v.pause());

    if (!enabled || reduce) {
      pauseAll();
      return;
    }

    let active: HTMLElement | null = null;
    let raf = 0;
    let blocked = false;

    const play = (v: HTMLVideoElement) => {
      if (blocked || !v.paused) return;
      v.play()?.catch((err: DOMException) => {
        /* AbortError: a pause() beat it — the next update tries again.
           NotAllowedError: autoplay is off (iOS Low Power Mode) — the stills
           stay, and this pass stops asking; the next open or close of a
           project starts a fresh one. */
        if (err?.name === "NotAllowedError") blocked = true;
      });
    };

    /* In a horizontally scrolled set (the @mobile phone row), only what is at
       least half in view of the row plays. */
    const inRow = (v: HTMLVideoElement) => {
      const row = v.closest<HTMLElement>("[data-hscroll]");
      if (!row || row.scrollWidth <= row.clientWidth) return true;
      const r = v.getBoundingClientRect();
      const b = row.getBoundingClientRect();
      const seen = Math.min(r.right, b.right) - Math.max(r.left, b.left);
      return seen >= r.width * 0.5;
    };

    const update = () => {
      if (document.hidden) {
        pauseAll();
        return;
      }
      const box = root.getBoundingClientRect();
      const H = box.height;
      const max = root.scrollHeight - root.clientHeight;
      const progress = max > 0 ? root.scrollTop / max : 0;
      const focusY = box.top + H * (0.25 + 0.5 * progress);

      const groups = Array.from(root.querySelectorAll<HTMLElement>("[data-play-group]"));
      let best: HTMLElement | null = null;
      let bestD = Infinity;
      let currentD = Infinity;
      for (const g of groups) {
        const r = g.getBoundingClientRect();
        const seen = Math.min(r.bottom, box.bottom) - Math.max(r.top, box.top);
        if (seen < Math.min(r.height * 0.4, H * 0.3)) continue;
        const d = focusY < r.top ? r.top - focusY : focusY > r.bottom ? focusY - r.bottom : 0;
        if (g === active) currentD = d;
        if (d < bestD) {
          bestD = d;
          best = g;
        }
      }
      if (active && currentD !== Infinity && currentD - bestD < HYSTERESIS) best = active;
      active = best;

      /* named siblings on the same band play with it */
      const on = new Set<HTMLElement>();
      if (best) {
        on.add(best);
        const name = best.dataset.playGroup;
        if (name) {
          const b = best.getBoundingClientRect();
          for (const g of groups) {
            if (g.dataset.playGroup !== name) continue;
            const r = g.getBoundingClientRect();
            const overlap = Math.min(r.bottom, b.bottom) - Math.max(r.top, b.top);
            if (overlap >= Math.min(r.height, b.height) * 0.5) on.add(g);
          }
        }
      }

      const at = best ? groups.indexOf(best) : -1;
      groups.forEach((g, i) => {
        const near = on.has(g) || (at >= 0 && Math.abs(i - at) <= 1);
        for (const v of videosIn(g)) {
          if (near && v.preload !== "auto") v.preload = "auto";
          if (on.has(g) && inRow(v)) play(v);
          else if (!v.paused) v.pause();
        }
      });
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    /* capture: also hears the horizontal phone row scrolling inside */
    root.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    const mutations = new MutationObserver(schedule);
    mutations.observe(root, { childList: true, subtree: true });
    schedule();

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      mutations.disconnect();
    };
  }, [scroller, enabled, reduce]);
}
