/* The folder-tab notch — geometry and springs.

   Figma draws the folder at 0.9 of the original 406-wide component (365.4,
   variants 434:3683 / 434:3684 / 434:3682); every number below is in the
   406-wide units (Figma px ÷ 0.9), which `--folder-unit` scales back. The
   active tab is one of three vectors, all 35 units tall, fill #019BFF:

     About       M0 4 C0 1.79 1.79 0 4 0 H66.33 C68.16 0 69.75 1.24 70.20 3.00 L78.43 35 L0 35 Z
     Let's Chat  M8.23 3.00 C8.68 1.24 10.28 0 12.10 0 H98.97 C100.79 0 102.39 1.24 102.84 3.00 L111.07 35 H0 Z   (at x 79)
     Download CV M8.23 3.00 … L136.84 35 H0 Z   (at x 190.11 — 603:1333 at 171.10 px, 123.15 wide)

   About's left edge is vertical with a 4px arc; every other edge is slanted
   8.23 over 32 with a ~2px eased corner. All three share the command skeleton
   `M L L C H C L L Z` (the two extra L's are the bleed below it), so the
   notch is one <path> whose numbers interpolate — it is never swapped or
   crossfaded.

   The moving parts are three numbers:
     lb     left edge x at the bottom
     rb     right edge x at the bottom
     slant  how slanted the LEFT edge is (0 = About's vertical edge, 8.23 = full)
   The right edge is always fully slanted, so rt = rb − SLANT. */

import type { Tab } from "../lib/data";

export const NOTCH_WIDTH = 406;
export const NOTCH_HEIGHT = 35;
export const SLANT = 8.22759;

/* The notch and the box under it are two shapes that meet edge to edge, and
   wherever their edges land between device pixels a row of the page behind
   shows through — a hairline under the tab (most widths and pixel densities,
   @mobile and @desktop alike). So the notch carries on this far below its own
   bottom edge, in the same units, sliding under the top of the box: the box is
   painted over it, and any row that would have been missed is already blue. */
export const NOTCH_BLEED = 3;

/* Figma's eased corner at the top of a slanted edge (relative to the point
   where the slant meets y = 3.00383). */
const C = {
  topY: 3.00383,
  c1x: 0.45461,
  c1y: 1.23588,
  c2x: 2.04851,
  endX: 3.87401,
};

/* About's top-left corner: a true 4px arc from (0, 4) to (4, 0). */
const ARC = {
  topY: 4,
  c1x: 0,
  c1y: 1.79086,
  c2x: 1.79086,
  endX: 4,
};

export type NotchPose = { lb: number; rb: number; slant: number };

export const NOTCH_POSE: Record<Tab, NotchPose> = {
  about: { lb: 0, rb: 78.4315, slant: 0 },
  chat: { lb: 78.4315, rb: 78.4315 + 111.068, slant: SLANT },
  cv: { lb: 190.111, rb: 190.111 + 136.838, slant: SLANT },
};

/* Tab slot boxes for the buttons that sit on top of the notch. The labels
   stay 16px at 1512 while the folder is drawn at 0.9, so their x comes
   straight from the text nodes (603:1328 / 1331 / 1334: 10.35, 84.07,
   183.68 px) rather than from scaling the old slots. */
export const TAB_SLOT: Record<Tab, { x: number; w: number; labelX: number }> = {
  about: { x: 0, w: 78.4315, labelX: 11.496 },
  chat: { x: 78.4315, w: 111.068, labelX: 14.979 },
  cv: { x: 190.111, w: 136.838, labelX: 13.978 },
};

/* Label top — 6.73 px in Figma. */
export const LABEL_TOP = 7.472;

const MIN_WIDTH = 40;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const f = (n: number) => Number(n.toFixed(3));

/* Build the path for any pose, including every in-between one. */
export function buildNotchPath({ lb, rb, slant }: NotchPose): string {
  lb = clamp(lb, 0, NOTCH_WIDTH);
  rb = clamp(rb, lb + MIN_WIDTH, NOTCH_WIDTH);
  const t = clamp(slant / SLANT, 0, 1); /* 0 → About corner, 1 → slanted corner */
  const lt = lb + SLANT * t;

  const topY = lerp(ARC.topY, C.topY, t);
  const c1x = lerp(lb + ARC.c1x, lt + C.c1x, t);
  const c1y = lerp(ARC.c1y, C.c1y, t);
  const c2x = lerp(lb + ARC.c2x, lt + C.c2x, t);
  const endX = lerp(lb + ARC.endX, lt + C.endX, t);

  const rt = rb - SLANT;
  const H = NOTCH_HEIGHT;
  const B = H + NOTCH_BLEED;

  return [
    `M${f(lb)} ${B}`,
    `L${f(lb)} ${H}`,
    `L${f(lt)} ${f(topY)}`,
    `C${f(c1x)} ${f(c1y)} ${f(c2x)} 0 ${f(endX)} 0`,
    `H${f(rt - C.endX)}`,
    `C${f(rt - C.c2x)} 0 ${f(rt - C.c1x)} ${f(C.c1y)} ${f(rt)} ${f(C.topY)}`,
    `L${f(rb)} ${H}`,
    `L${f(rb)} ${B}`,
    "Z",
  ].join(" ");
}

/* Springs. The edge facing the direction of travel leads; the other lags,
   which is what stretches the notch mid-travel and lets both edges slant
   before the shape settles. Retargeting a spring keeps its velocity, so a
   click mid-flight redirects instead of restarting. */
export const NOTCH_SPRING = {
  leading: { type: "spring", stiffness: 520, damping: 42, mass: 1 } as const,
  trailing: { type: "spring", stiffness: 300, damping: 36, mass: 1 } as const,
  slant: { type: "spring", stiffness: 400, damping: 40, mass: 1 } as const,
};

export function edgeSprings(from: NotchPose, to: NotchPose) {
  const movingRight = to.lb > from.lb;
  return {
    lb: movingRight ? NOTCH_SPRING.trailing : NOTCH_SPRING.leading,
    rb: movingRight ? NOTCH_SPRING.leading : NOTCH_SPRING.trailing,
  };
}
