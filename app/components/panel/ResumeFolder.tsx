"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { cv } from "../../lib/data";
import {
  CARD,
  CLIP,
  HOVER_OFF,
  HOVER_ON,
  INTRO,
  PEAK_Y,
  POCKET,
  RAISED_Y,
  REST_Y,
} from "../../motion/resumeCard";

const em = (units: number) => `${(units / 16).toFixed(4)}em`;

/* Figma variant Details=Resume (434:3682): a blue back plate, a pocket drawn
   in front, and a white card that rises from behind the pocket. The whole
   box is the link to the PDF.

   `run` changes every time the Download CV tab is selected; the intro replays
   on each visit and the card is then left standing in the pocket. */
export default function ResumeFolder({ run = 0 }: { run?: number }) {
  const reduce = useReducedMotion();
  const y = useMotionValue(reduce ? RAISED_Y : REST_Y);
  const translate = useTransform(y, (v) => em(v));
  const hovering = useRef(false);

  /* Each visit: drop the card back out of sight, then play the Figma clip.
     It ends raised and stays there — nothing pulls it back down. */
  useEffect(() => {
    if (reduce) {
      y.jump(RAISED_Y);
      return;
    }
    if (hovering.current) return; /* pointer already on the folder — leave it up */
    y.jump(REST_Y);
    const intro = animate(y, [...INTRO.keyframes], {
      duration: INTRO.duration,
      times: [...INTRO.times],
      ease: [...INTRO.ease],
      delay: INTRO.delay,
    });
    return () => intro.stop();
  }, [reduce, run, y]);

  /* 464:2830 — hover lifts the card the last 18 units to its peak. */
  const rise = () => {
    hovering.current = true;
    if (reduce) return;
    animate(y, PEAK_Y, HOVER_ON);
  };
  /* 465:3223 — leaving settles it back to the raised rest, not into the folder. */
  const settle = () => {
    hovering.current = false;
    if (reduce) return;
    animate(y, RAISED_Y, HOVER_OFF);
  };

  return (
    <a
      href={cv.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${cv.label} (PDF, opens in a new tab)`}
      className="group absolute inset-0 block rounded-[inherit] outline-none"
      onPointerEnter={(e) => e.pointerType === "mouse" && rise()}
      onPointerLeave={(e) => e.pointerType === "mouse" && settle()}
      onFocus={rise}
      onBlur={settle}
    >
      {/* back plate — 414:3196 */}
      <div className="absolute inset-0 rounded-[inherit] [background-image:var(--gradient-resume)]" />

      {/* Clip frame — 434:4066. It starts 34 above the box so the card can
          overshoot the top edge, which means it hangs over the tab row: it
          must not take the clicks meant for About and Let's Chat. The card
          and pocket are decoration; the link's own box is the hit area. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden rounded-b-[inherit]"
        style={{ top: em(CLIP.top) }}
      >
        {/* the card — 426:3275 */}
        <motion.div
          className="absolute rounded-[0.75em] bg-white shadow-cv"
          style={{
            left: em(CARD.left),
            top: em(CARD.top),
            width: em(CARD.width),
            height: em(CARD.height),
            y: translate,
          }}
        />
        {/* the pocket — 426:3280 (Frame 35), drawn above the card */}
        <div
          className="absolute inset-x-0 rounded-[0.375em] shadow-pocket [background-image:var(--gradient-pocket)]"
          style={{ top: em(POCKET.top), height: em(POCKET.height) }}
        />
      </div>

      <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-fg/60 ring-inset group-focus-visible:ring-2" />
    </a>
  );
}
