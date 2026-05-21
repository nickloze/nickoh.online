"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

interface SectionStageProps {
  /** Index of the active section; a change triggers the transition. */
  activeIndex: number;
  /** +1 when moving to a later section, -1 when going back. Drives the drift
   *  direction so the motion follows the scroll gesture. */
  direction: number;
  children: React.ReactNode;
}

const FADE_DURATION = 0.7;
/** How far, in px, content drifts while fading. Small enough that sections
 *  still settle at identical positions — the "one continuous canvas" read. */
const DRIFT = 32;
/** Gentle ease-out (easeOutQuint) — content decelerates smoothly into place. */
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Cross-fades between sections with a subtle directional drift: the incoming
 * section glides in the scroll direction as it fades up to full opacity while
 * the outgoing one drifts the same way as it fades out. Both animate together
 * while stacked, so the swap reads as one continuous canvas. Persistent chrome
 * (dot nav, island) lives outside this component and never moves.
 */
export default function SectionStage({ activeIndex, direction, children }: SectionStageProps) {
  const reduceMotion = useReducedMotion();
  const drift = reduceMotion ? 0 : DRIFT;

  const variants = {
    enter: (dir: number) => ({ opacity: 0, y: dir >= 0 ? drift : -drift }),
    center: { opacity: 1, y: 0 },
    exit: (dir: number) => ({ opacity: 0, y: dir >= 0 ? -drift : drift }),
  };

  return (
    <div className="absolute inset-0">
      <AnimatePresence custom={direction} mode="sync" initial={false}>
        <motion.div
          key={activeIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduceMotion ? 0.2 : FADE_DURATION, ease: EASE }}
          className="absolute inset-0"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
