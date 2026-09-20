"use client";

import { useState } from "react";
import type { Tab } from "../../lib/data";
import FolderBody from "./FolderBody";
import FolderTabs from "./FolderTabs";

/* The folder — Figma variants 434:3683 / 434:3684 / 434:3682 ("Desktop").
   Drawn in 406 units; `--folder-unit` scales it (14.4px @desktop and tablet —
   365.4 wide — and 11.74px @mobile at 402, where the box stretches to the
   column). Owns the only piece of state in the panel: which tab is active. */
export default function Folder() {
  const [active, setActive] = useState<Tab>("about");
  /* Bumped on every selection of Download CV, so the card's rise replays each
     time the tab is opened — including a return from another tab. */
  const [cvRun, setCvRun] = useState(0);

  const select = (tab: Tab) => {
    setActive(tab);
    if (tab === "cv") setCvRun((n) => n + 1);
  };

  return (
    <div
      className="flex w-full flex-col items-start text-[length:var(--folder-unit)]"
      data-active={active}
    >
      <FolderTabs active={active} onChange={select} />
      <FolderBody active={active} cvRun={cvRun} />
    </div>
  );
}
