"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Tab } from "../../lib/data";
import {
  BODY_HEIGHT,
  BODY_SPRING,
  BODY_TOP_LEFT_RADIUS,
  PANE_PLATE,
  PANE_TEXT,
} from "../../motion/folder";
import AboutBody from "./AboutBody";
import ResumeFolder from "./ResumeFolder";
import SocialsBody from "./SocialsBody";

/* Figma "Button Container": one box whose height, top-left corner and
   contents follow the active tab.

   The box is a single element that is never remounted and never faded — it
   holds the folder gradient itself, so through any swap it stays opaque and
   only its bottom edge moves. The panes above it carry content alone. */
export default function FolderBody({ active, cvRun = 0 }: { active: Tab; cvRun?: number }) {
  const reduce = useReducedMotion();
  const instant = { duration: 0 };

  return (
    <motion.div
      className="relative w-full rounded-[0.375em] [background-image:var(--gradient-folder)]"
      initial={false}
      animate={{ height: BODY_HEIGHT[active], borderTopLeftRadius: BODY_TOP_LEFT_RADIUS[active] }}
      transition={reduce ? instant : BODY_SPRING}
    >
      <AnimatePresence initial={false}>
        {active === "cv" ? (
          <motion.div
            key="cv"
            className="absolute inset-0 rounded-[inherit]"
            initial={PANE_PLATE.initial}
            animate={reduce ? { opacity: 1, transition: instant } : PANE_PLATE.animate}
            exit={reduce ? { opacity: 0, transition: instant } : PANE_PLATE.exit}
          >
            <ResumeFolder run={cvRun} />
          </motion.div>
        ) : (
          <motion.div
            key={active}
            className="absolute inset-0 overflow-hidden rounded-[inherit] p-[0.875em]"
            initial={PANE_TEXT.initial}
            animate={reduce ? { opacity: 1, transition: instant } : PANE_TEXT.animate}
            exit={reduce ? { opacity: 0, transition: instant } : PANE_TEXT.exit}
          >
            {active === "about" ? <AboutBody /> : <SocialsBody />}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
