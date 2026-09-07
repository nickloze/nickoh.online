"use client";

import { useRef } from "react";
import { useWheelForward } from "../hooks/useWheelForward";
import Panel from "./panel/Panel";
import WorkFeed from "./work/WorkFeed";

/* One DOM tree, two layouts — the "shared adaptive layout" case.

   @desktop  Figma 373:2659 — 64 padding, 24 gap, panel 406 | feed 1fr.
             Panel fixed on the left, feed scrolls on the right.
   @mobile   Figma 441:243  — 34 side padding, 15 above (below the status
             bar), 19 below (above the browser bar), 24 gap. Feed window on
             top, folder below it.

   The document itself never scrolls (globals.css); a wheel over the panel is
   forwarded to the feed. */
export default function Shell() {
  const panel = useRef<HTMLDivElement>(null);
  const feed = useRef<HTMLElement>(null);
  useWheelForward(panel, feed);

  return (
    <main
      className={[
        "grid h-dvh bg-bg text-fg gap-col-gap",
        // @mobile
        "grid-rows-[minmax(0,1fr)_auto] [grid-template-areas:'feed'_'panel']",
        "px-mobile-side pt-[calc(var(--spacing-mobile-top)+env(safe-area-inset-top))] pb-[calc(var(--spacing-mobile-bottom)+env(safe-area-inset-bottom))]",
        // @desktop
        "desktop:grid-cols-[var(--width-panel)_minmax(0,1fr)] desktop:grid-rows-[minmax(0,1fr)] desktop:[grid-template-areas:'panel_feed']",
        "desktop:p-frame",
      ].join(" ")}
    >
      <Panel ref={panel} className="[grid-area:panel] min-h-0" />
      <WorkFeed ref={feed} className="[grid-area:feed]" />
    </main>
  );
}
