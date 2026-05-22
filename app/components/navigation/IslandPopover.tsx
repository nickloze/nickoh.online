"use client";

import { motion, useReducedMotion } from "motion/react";

/** A single destination row inside an island popover. */
export interface PopoverItem {
  label: string;
  href: string;
  /** Drives the target/rel/download attributes and the trailing glyph. */
  kind: "external" | "mail" | "download";
}

interface IslandPopoverProps {
  /** id referenced by the trigger button's aria-controls. */
  id: string;
  /** Accessible name for the popover dialog. */
  label: string;
  items: PopoverItem[];
  /** Called once a row is chosen, so the island can close the popover. */
  onSelect: () => void;
}

/**
 * A floating card anchored above a floating-island icon. Shared by the
 * Messages, Résumé and Contact icons — the trio differ only by their items.
 * @desktop/@mobile — the card is identical at both viewports; only the island
 * it hangs off moves (bottom-anchored @mobile, ~75% height @desktop).
 */
export default function IslandPopover({ id, label, items, onSelect }: IslandPopoverProps) {
  const reduce = useReducedMotion();

  return (
    // Outer layer owns positioning only. `pb-2` is a transparent bridge so the
    // pointer never leaves the hover region crossing from the icon to the card
    // (the Résumé icon opens its popover on hover — @desktop only).
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 pb-2">
      <motion.div
        id={id}
        role="dialog"
        aria-label={label}
        initial={reduce ? false : { opacity: 0, y: 6, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        style={{ transformOrigin: "bottom center" }}
        className="min-w-[210px] rounded-2xl bg-white p-2 shadow-[0_14px_36px_-12px_rgba(0,0,0,0.3)] ring-1 ring-black/[0.06]"
      >
        {items.map((item) => (
          <PopoverLink key={item.label} item={item} onSelect={onSelect} />
        ))}
      </motion.div>
    </div>
  );
}

function PopoverLink({ item, onSelect }: { item: PopoverItem; onSelect: () => void }) {
  const isExternal = item.kind === "external";
  const isDownload = item.kind === "download";

  return (
    <a
      href={item.href}
      onClick={onSelect}
      {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      {...(isDownload ? { download: true } : {})}
      className="flex items-center justify-between gap-6 rounded-xl px-3 py-2 fs-small text-ink transition-colors hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
    >
      <span className="whitespace-nowrap">{item.label}</span>
      {isDownload ? <ArrowDown /> : <ArrowUpRight />}
    </a>
  );
}

/** Outbound-link glyph (external + mailto rows). */
function ArrowUpRight() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="h-3 w-3 shrink-0 text-muted">
      <path
        d="M3.5 8.5 8.5 3.5M4.75 3.5H8.5V7.25"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Download glyph (CV row). */
function ArrowDown() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="h-3 w-3 shrink-0 text-muted">
      <path
        d="M6 2v6M3.25 5.5 6 8.25 8.75 5.5M2.75 10h6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
