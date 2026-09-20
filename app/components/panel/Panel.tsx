"use client";

import { forwardRef } from "react";
import { FOLDER_AWAY } from "../../motion/project";
import { DESKTOP_QUERY, useMediaQuery } from "../../hooks/useMediaQuery";
import { useProject } from "../ProjectContext";
import Availability from "./Availability";
import Folder from "./Folder";

const ease = `cubic-bezier(${FOLDER_AWAY.ease.join(",")})`;

/* Figma 373:2661 "Introduction Section".

   @desktop  365.4 wide, full height: the folder at the top and "Available for
             Work" pinned to the bottom — exactly what every project frame
             draws, and nothing between them. The panel keeps its shape
             while a project is open; the one thing that changes is that the
             About card becomes the way home (FolderBody), alongside Esc and
             the chip on the next-project panel at the foot of the story
             (Nic's call).
   @mobile   the folder alone, under the feed window (441:243). The panel is
             given the height of the folder's tallest state (35 tab row + 202
             box = 237 units, --height-folder-panel) so the row never resizes
             and the feed above it stays where it is when a tab changes.
             Inside that fixed box the folder is pinned to the BOTTOM, not the
             top: the bottom of the screen is the edge the reader reads the
             folder against, so a shorter tab has to move the tab row down
             rather than pull the box up off the bottom of the screen and
             leave dead space there. Every tab therefore ends level, 13 above
             the browser bar, and switching tabs travels at the top. @desktop
             is the other way round — there the folder hangs from the top of a
             full-height panel and grows down toward "Available for Work".
             While a project is open the folder slides down out of the way (the
             project takes the screen and the bottom bar takes its place); it
             stays mounted, so its tab is kept.
   @mobile (tablet) — the same, with the folder at its 365.4 desktop width. */
const Panel = forwardRef<HTMLElement, { className?: string }>(function Panel(
  { className = "" },
  ref,
) {
  const { open } = useProject();
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const away = open !== null && !desktop;

  return (
    <aside
      ref={ref}
      inert={away}
      data-away={away || undefined}
      className={[
        "relative flex flex-col items-start justify-end",
        // @mobile — above the feed's fade (which reaches under the panel)
        "z-10 h-[var(--height-folder-panel)] data-away:translate-y-[calc(100%+80px)] data-away:opacity-0",
        // @mobile (tablet)
        "tablet:w-[var(--width-panel)]",
        // @desktop
        "desktop:h-auto desktop:translate-y-0 desktop:opacity-100 desktop:justify-between",
        className,
      ].join(" ")}
      style={{
        transition: `translate ${FOLDER_AWAY.duration}s ${ease}, opacity ${FOLDER_AWAY.duration}s ${ease}`,
      }}
    >
      <Folder />
      <div className="hidden w-full desktop:flex">
        <Availability />
      </div>
    </aside>
  );
});

export default Panel;
