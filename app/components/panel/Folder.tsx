"use client";

import { useState } from "react";
import type { Tab } from "../../lib/data";
import FolderBody from "./FolderBody";
import FolderTabs from "./FolderTabs";

/* The folder — Figma component set 434:3685 "Desktop". Drawn at 406 units
   wide; `--folder-unit` scales it (16px @desktop, 13.04px @mobile). Owns the
   only piece of state in the panel: which tab is active. */
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
