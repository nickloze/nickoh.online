"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/* `reducedMotion="user"` makes Motion drop transform and layout animations for
   anyone whose system asks for less motion, while still allowing opacity to
   cross-fade. Without it the shared-element morph that opens a project would
   still fly across the screen for exactly the people who asked it not to —
   the CSS `prefers-reduced-motion` block in globals.css only governs CSS
   transitions, not Motion's layout projection. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
