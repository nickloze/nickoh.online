/* The folder-tab notch — geometry and springs.

   Figma (component set 434:3685) draws the active tab as one of three
   vectors, all 35 tall, fill #019BFF, in a 406-wide row:

     About       M0 4 C0 1.79 1.79 0 4 0 H66.33 C68.16 0 69.75 1.24 70.20 3.00 L78.43 35 L0 35 Z
     Let's Chat  M8.23 3.00 C8.68 1.24 10.28 0 12.10 0 H98.97 C100.79 0 102.39 1.24 102.84 3.00 L111.07 35 H0 Z   (at x 79)
     Download CV M8.23 3.00 C8.68 1.24 10.28 0 12.10 0 H126.38 C128.21 0 129.80 1.24 130.25 3.00 L138.48 35 H0 Z  (at x 191)

   About's left edge is vertical with a 4px arc; every other edge is slanted
   8.23 over 32 with a ~2px eased corner. All three share the command skeleton
   `M L C H C L Z`, so the notch is one <path> whose numbers interpolate — it
   is never swapped or crossfaded.

   The moving parts are three numbers:
     lb     left edge x at the bottom
     rb     right edge x at the bottom
     slant  how slanted the LEFT edge is (0 = About's vertical edge, 8.23 = full)
   The right edge is always fully slanted, so rt = rb − SLANT. */

import type { Tab } from "../lib/data";

export const NOTCH_WIDTH = 406;
export const NOTCH_HEIGHT = 35;
export const SLANT = 8.22759;

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
  chat: { lb: 79, rb: 79 + 111.068, slant: SLANT },
  cv: { lb: 191, rb: 191 + 138.481, slant: SLANT },
};

/* Tab slot boxes for the buttons that sit on top of the notch. */
export const TAB_SLOT: Record<Tab, { x: number; w: number; labelX: number }> = {
  about: { x: 0, w: 79, labelX: 14.5 },
  chat: { x: 79, w: 112, labelX: 19.5 },
  cv: { x: 191, w: 139, labelX: 20.5 },
};

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

  return [
    `M${f(lb)} ${H}`,
    `L${f(lt)} ${f(topY)}`,
    `C${f(c1x)} ${f(c1y)} ${f(c2x)} 0 ${f(endX)} 0`,
    `H${f(rt - C.endX)}`,
    `C${f(rt - C.c2x)} 0 ${f(rt - C.c1x)} ${f(C.c1y)} ${f(rt)} ${f(C.topY)}`,
    `L${f(rb)} ${H}`,
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
