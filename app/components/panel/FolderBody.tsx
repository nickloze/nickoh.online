"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Tab } from "../../lib/data";
import { isPlainClick } from "../../lib/click";
import {
  BODY_HEIGHT,
  BODY_SPRING,
  BODY_TOP_LEFT_RADIUS,
  HOME_VEIL,
  PANE_PLATE,
  PANE_TEXT,
} from "../../motion/folder";
import { useProject } from "../ProjectContext";
import AboutBody from "./AboutBody";
import ResumeFolder from "./ResumeFolder";
import SocialsBody from "./SocialsBody";

/* Figma "Button Container": one box whose height, top-left corner and
   contents follow the active tab.

   The box is a single element that is never remounted and never faded — it
   holds the folder gradient itself, so through any swap it stays opaque and
   only its bottom edge moves. The panes above it carry content alone. */
export default function FolderBody({ active, cvRun = 0 }: { active: Tab; cvRun?: number }) {
  const { open, close } = useProject();
  const reduce = useReducedMotion();
  const instant = { duration: 0 };
  const [hot, setHot] = useState(false);

  /* @desktop — while a project is open, the About card is the way home (Nic's
     call): the panel beside the story is the reader's own card, and pressing
     it puts the feed back. It is a link over the pane rather than a wrapper
     around the bio, so the card keeps one accessible name ("Back home")
     instead of announcing five lines of prose as a link.

     About only. Let's Chat and Download CV are already made of links, and a
     sheet over them would take the click meant for a social row or the CV.
     Esc and the chip at the foot of the story stay the other ways back.

     @mobile (and tablet) — the panel slides away and goes inert behind an
     open project, so this link is @desktop's alone; the bottom of the story
     carries the way back there. */
  const home = active === "about" && open !== null;
  /* The pointer can leave with the link rather than off it — the reader
     presses Esc while resting on the card, or the tab changes under it. The
     hover is forgotten with the card, in the same render, so the next one to
     arrive is never lit by a pointer that is somewhere else entirely. */
  const [wasHome, setWasHome] = useState(home);
  if (wasHome !== home) {
    setWasHome(home);
    if (hot) setHot(false);
  }

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
            className="absolute inset-0 overflow-hidden rounded-[inherit]"
            initial={PANE_TEXT.initial}
            animate={reduce ? { opacity: 1, transition: instant } : PANE_TEXT.animate}
            exit={reduce ? { opacity: 0, transition: instant } : PANE_TEXT.exit}
          >
            {/* under the words, over the gradient: the card comes up under the
                pointer and the bio itself is left exactly as it is */}
            {home && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-[inherit] bg-fg"
                initial={{ opacity: 0 }}
                animate={{ opacity: hot ? HOME_VEIL.opacity : 0 }}
                transition={reduce ? instant : HOME_VEIL.transition}
              />
            )}

            <div
              className={
                /* About (414:3217) is padded 12 × 8 px; Socials keeps 14 units.
                   The padding is on this block, not the pane, so the sheet
                   above covers the whole card and not just the type. */
                active === "about" ? "px-[0.8333em] py-[0.5556em]" : "p-[0.875em]"
              }
            >
              {active === "about" ? <AboutBody /> : <SocialsBody />}
            </div>

            {home && (
              <Link
                href="/"
                scroll={false}
                aria-label="Back home"
                onClick={(e) => {
                  if (!isPlainClick(e)) return;
                  e.preventDefault();
                  close();
                }}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "touch") setHot(true);
                }}
                onPointerLeave={() => setHot(false)}
                onFocus={() => setHot(true)}
                onBlur={() => setHot(false)}
                className="absolute inset-0 cursor-pointer rounded-[inherit] outline-none ring-fg/60 ring-inset focus-visible:ring-2"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
