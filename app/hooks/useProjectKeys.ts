"use client";

import { useEffect } from "react";
import { neighbours, type Slug } from "../lib/projects";

/* Inside a project: Esc goes back to all work, ← / → step to the previous /
   next project. Keys that belong to something else are left alone — the
   folder's tab row (it uses ← / → itself), a sideways-scrolling row (the
   @mobile phone row), anything editable, and any chord with a modifier. */
export function useProjectKeys(
  open: Slug | null,
  { close, go }: { close: () => void; go: (slug: Slug) => void },
) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const el = e.target instanceof Element ? e.target : null;
      if (
        el?.closest('input, textarea, select, [contenteditable="true"], nav[aria-label="Folder"], [data-hscroll]')
      ) {
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const { prev, next } = neighbours(open);
        go(e.key === "ArrowLeft" ? prev.slug : next.slug);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, go]);
}
