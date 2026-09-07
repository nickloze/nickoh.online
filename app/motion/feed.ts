/* The project feed. The annotation on Figma 373:2675 asks for the image to
   "slightly expand like 2.5–5%" while the user scrolls, to invite a click.
   The same expansion answers hover, since Nic wants a hover interaction and
   the cards do not navigate yet. */

export const EXPAND_SCALE = 1.03;
export const EXPAND_SPRING = { type: "spring", stiffness: 260, damping: 28, mass: 1 } as const;

/* How long after the last scroll event the feed counts as still moving. */
export const SCROLL_IDLE_MS = 140;
