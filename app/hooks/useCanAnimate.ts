"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";

/* Animation is an enhancement, never a prerequisite for correct layout.

   requestAnimationFrame does not run while a document is hidden — and not at
   all in some embedded browsers — which strands a Motion tween at its `initial`
   value: a hero left at its start height, or content left at opacity 0. So when
   the document is hidden at mount we skip `initial` altogether and Motion
   renders the resting state directly. Same for a reduced-motion preference. */
export function useCanAnimate() {
  const reduceMotion = useReducedMotion();
  const [visibleAtMount] = useState(() =>
    typeof document === "undefined" ? false : !document.hidden,
  );
  return visibleAtMount && !reduceMotion;
}
