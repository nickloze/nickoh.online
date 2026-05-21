"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { IconLibrary } from "./ui/icons";

interface WorkLibraryTitleCardProps {
  /** Fired once the reveal sequence (or its reduced-motion equivalent) ends. */
  onComplete?: () => void;
}

/* The layer fades in, holds, then fades out slowly. It sits BELOW the dot nav
 * and floating island (z-20 / z-30), so that persistent chrome stays visible
 * the whole time — only this Work Library layer animates in and out. */
const FADE_IN_MS = 500;
const HOLD_MS = 1000;
const FADE_OUT_MS = 800;
const TOTAL_MS = FADE_IN_MS + HOLD_MS + FADE_OUT_MS;

/**
 * The Work Library title card (Figma 271:3395). A reusable transition layer:
 * the "Work Library" mark fades in over the project content, holds, then fades
 * out slowly to expose it. The dot nav and floating island render above this
 * layer and never disappear. Plays on entering the Work Library and when
 * returning to it from a project page.
 */
export default function WorkLibraryTitleCard({ onComplete }: WorkLibraryTitleCardProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), reduce ? 800 : TOTAL_MS);
    return () => clearTimeout(timer);
  }, [onComplete, reduce]);

  const mark = (
    <div className="flex items-center gap-1">
      <IconLibrary className="h-8 w-8 text-muted" />
      <p className="fs-primary text-muted">Work Library</p>
    </div>
  );

  // z-10 keeps this above the section content but below the dot nav and island.
  if (reduce) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
        {mark}
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 z-10 flex items-center justify-center bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{
        duration: TOTAL_MS / 1000,
        times: [0, FADE_IN_MS / TOTAL_MS, (FADE_IN_MS + HOLD_MS) / TOTAL_MS, 1],
        ease: "easeInOut",
      }}
    >
      {mark}
    </motion.div>
  );
}
