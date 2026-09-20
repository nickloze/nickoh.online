"use client";

import { useSyncExternalStore } from "react";

/* A media query as React state. The server (and the first client render)
   answer `false`, so markup never differs at hydration; the real answer
   arrives straight after. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/* @desktop — the tier from 1024px (Tailwind's `desktop:`). */
export const DESKTOP_QUERY = "(min-width: 64rem)";

/* @desktop pointer — hover effects only where a hover can actually happen,
   so a tap on a phone never leaves a card stuck mid-expand. */
export const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
