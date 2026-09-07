"use client";

import { useRef, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { tabs, type Tab } from "../../lib/data";
import { LABEL } from "../../motion/folder";
import { NOTCH_WIDTH, TAB_SLOT } from "../../motion/tabNotch";
import TabNotch from "./TabNotch";

const em = (units: number) => `${(units / 16).toFixed(4)}em`;

/* The tab row — Figma "Button Group Container" (406 × 35). Three real buttons
   sit on top of the single travelling notch. Left/Right arrows move between
   them; the active one carries aria-current. */
export default function FolderTabs({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    refs.current[next]?.focus();
    onChange(tabs[next].id);
  };

  return (
    <nav
      aria-label="Folder"
      className="relative w-full"
      style={{ height: em(35), width: em(NOTCH_WIDTH) }}
    >
      <TabNotch active={active} />
      {tabs.map((tab, i) => {
        const slot = TAB_SLOT[tab.id];
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            aria-current={isActive ? "true" : undefined}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className="absolute top-0 flex h-full cursor-pointer items-start text-left font-sans text-[1em] leading-[normal] tracking-[-0.025em] text-fg outline-none focus-visible:[&>span]:underline focus-visible:[&>span]:underline-offset-4"
            style={{ left: em(slot.x), width: em(slot.w), paddingLeft: em(slot.labelX) }}
          >
            <motion.span
              className="relative block"
              style={{ paddingTop: em(8) }}
              animate={{ opacity: isActive ? 1 : 0.2 }}
              transition={LABEL.transition}
            >
              {tab.label}
            </motion.span>
          </button>
        );
      })}
    </nav>
  );
}
