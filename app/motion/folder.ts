/* The folder box under the tabs. Heights and the top-left corner come from
   the three variants (434:3683 About · 434:3684 Socials · 434:3682 Resume),
   drawn at 0.9 — so each is Figma px ÷ 0.9 in the folder's 406-wide units
   (14.4px @desktop and tablet, 11.74px @mobile at 402). */

import type { Tab } from "../lib/data";

const UNIT = 16;
const em = (px: number) => `${(px / UNIT).toFixed(5)}em`;

export const BODY_HEIGHT: Record<Tab, string> = {
  about: em(162.222), /* 146 px — the box hugs the 20px bio */
  chat: em(114.667), /* 135.2 − 32 = 103.2 px */
  cv: em(202), /* 181.8 px */
};

/* About's tab is flush with the box, so that corner is square; the other two
   variants round all four corners at 6. */
export const BODY_TOP_LEFT_RADIUS: Record<Tab, string> = {
  about: "0em",
  chat: em(6),
  cv: em(6),
};

/* The bottom edge only. The box's top is fixed by the layout — it sits under
   the tab row — so animating height moves the bottom alone, which is the
   folder growing and shrinking. A duration spring with no bounce settles on
   a schedule instead of creeping toward the target for another 200 ms, which
   is what read as lag against the notch. */
export const BODY_SPRING = { type: "spring", duration: 0.38, bounce: 0 } as const;

/* Swapping the contents.

   The box itself carries the folder gradient and is never faded, so the page
   behind it can never show through mid-swap — two panes crossfading at 50%
   leave a quarter of the box transparent, and that dip is what made a resize
   look like a refresh.

   About and Let's Chat are transparent text, so they are staggered rather
   than crossfaded: the outgoing block is gone before the incoming one
   arrives, and the two are never legible at once. */
export const PANE_TEXT = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.17, delay: 0.1, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: "easeIn" } },
};

/* The Resume plate is staggered for the same reason: crossfading it against
   the bio left the text legible straight through the folder. Out, then in. */
export const PANE_PLATE = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.14, delay: 0.1, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: "easeIn" } },
};

/* When the plate is fully opaque — the card holds until then so its whole
   rise is seen against the folder rather than through it. Read by
   app/motion/resumeCard.ts. */
export const PLATE_IN = 0.24;

/* Tab labels: inactive 0.2 → active 1 (component set 434:3685). */
export const LABEL = {
  transition: { duration: 0.15, ease: "easeOut" as const },
};

/* The About card as the way home.

   Not in Figma — the frames draw no project-open state for the panel — so it
   borrows the two cues the site already has: the next-project card's "the
   thing you are about to press comes up", and the tab labels' 150ms, so the
   folder has a single hover speed. A white veil over the gradient rather than
   a filter on the box: the bio sits above it and is left exactly as it is. */
export const HOME_VEIL = {
  /* 0.1 white: enough to read as the card lighting up under the pointer in
     150ms, short of the milky wash that 0.16 leaves on the deep blue in the
     bottom-left corner of the gradient. */
  opacity: 0.1,
  transition: { duration: 0.15, ease: "easeOut" as const },
};
