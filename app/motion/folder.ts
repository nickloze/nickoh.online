/* The folder box under the tabs. Heights and the top-left corner come from
   the three variants of component set 434:3685; units are the folder's em
   (16px @desktop, 13.04px @mobile). */

import type { Tab } from "../lib/data";

const UNIT = 16;
const em = (px: number) => `${(px / UNIT).toFixed(5)}em`;

export const BODY_HEIGHT: Record<Tab, string> = {
  about: em(202),
  chat: em(115),
  cv: em(202),
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
