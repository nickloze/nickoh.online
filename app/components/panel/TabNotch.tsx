"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import type { Tab } from "../../lib/data";
import {
  NOTCH_HEIGHT,
  NOTCH_POSE,
  NOTCH_SPRING,
  NOTCH_WIDTH,
  buildNotchPath,
  edgeSprings,
} from "../../motion/tabNotch";

/* One <path>, never swapped. Three numeric motion values (left edge, right
   edge, left-edge slant) each ride their own spring toward the active tab's
   pose; the path string is rebuilt from them every frame. A click mid-flight
   just retargets the springs, which keep their velocity. */
export default function TabNotch({ active }: { active: Tab }) {
  const reduce = useReducedMotion();
  const initial = NOTCH_POSE[active];
  const lb = useMotionValue(initial.lb);
  const rb = useMotionValue(initial.rb);
  const slant = useMotionValue(initial.slant);
  const d = useTransform([lb, rb, slant], ([l, r, s]) =>
    buildNotchPath({ lb: l as number, rb: r as number, slant: s as number }),
  );
  const last = useRef(initial);

  useEffect(() => {
    const to = NOTCH_POSE[active];
    if (reduce) {
      lb.jump(to.lb);
      rb.jump(to.rb);
      slant.jump(to.slant);
    } else {
      const springs = edgeSprings(last.current, to);
      animate(lb, to.lb, springs.lb);
      animate(rb, to.rb, springs.rb);
      animate(slant, to.slant, NOTCH_SPRING.slant);
    }
    last.current = to;
  }, [active, reduce, lb, rb, slant]);

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 block size-full overflow-visible"
      viewBox={`0 0 ${NOTCH_WIDTH} ${NOTCH_HEIGHT}`}
      preserveAspectRatio="none"
      fill="none"
    >
      <motion.path d={d} fill="var(--color-tab)" data-notch />
    </svg>
  );
}
