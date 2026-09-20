"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { tabs, type Tab } from "../../lib/data";
import { LABEL } from "../../motion/folder";
import { LABEL_TOP, NOTCH_WIDTH, TAB_SLOT } from "../../motion/tabNotch";
import TabNotch from "./TabNotch";

const em = (units: number) => `${(units / 16).toFixed(4)}em`;

/* The tab row — Figma "Button Group Container" (603:1325, 365.4 × 32; 406 ×
   35 units). Three real buttons sit on top of the single travelling notch.
   Left/Right arrows move between them; the active one carries aria-current.

   The labels are 16px at 1512 while the folder is drawn at 0.9, so they are
   1.1111em of the folder unit (13.04px @mobile at 402, where Figma scales the
   whole instance). On touch screens each tab's hit area grows upward to 44px
   — upward, into the free space above the row, so it never covers the box.

   @desktop — an inactive label turns white while the pointer is over its tab
   and returns to the faint 0.2 when it leaves. It rides the same opacity the
   active state uses, so the two never fight; touch pointers are ignored, so a
   tap never leaves a label stuck white. */
export default function FolderTabs({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [hovered, setHovered] = useState<Tab | null>(null);

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
            onPointerEnter={(e) => {
              if (e.pointerType !== "touch") setHovered(tab.id);
            }}
            onPointerLeave={() => setHovered((h) => (h === tab.id ? null : h))}
            className="absolute top-0 flex h-full cursor-pointer items-start text-left font-sans text-[1em] leading-[normal] text-fg outline-none focus-visible:[&>span]:underline focus-visible:[&>span]:underline-offset-4 pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:bottom-0 pointer-coarse:before:h-[44px] pointer-coarse:before:content-['']"
            style={{ left: em(slot.x), width: em(slot.w), paddingLeft: em(slot.labelX) }}
          >
            <motion.span
              className="relative block"
              style={{ paddingTop: em(LABEL_TOP) }}
              animate={{ opacity: isActive || hovered === tab.id ? 1 : 0.2 }}
              transition={LABEL.transition}
            >
              <span className="block text-[1.1111em] tracking-[-0.025em]">{tab.label}</span>
            </motion.span>
          </button>
        );
      })}
    </nav>
  );
}
