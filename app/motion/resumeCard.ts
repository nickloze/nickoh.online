import { PLATE_IN } from "./folder";

/* Download CV — the card that rises out of the folder pocket.

   Straight from Figma `get_motion_context` on node 426:3275 (Rectangle 4):

     y     [2.564, -78.669, -60.596, -60.596]
     times [0,      0.2529,  0.3996,  1]        duration 2 s
     ease  segments 1–2: t => 1 − e^(−11.18t)·(cos(0.158t) + 70.71·sin(0.158t))
           segment 3: linear (hold)

   All numbers are in the 406-wide folder's units (1 unit = 1px @desktop,
   0.8148px @mobile). Layout of the Resume variant, box coords (406 × 202):

     clip frame   y −34 → 202             (lets the card overshoot the box top)
     card         360.898 × 149.496, x 22.55, rest top ≈ 75.7 — hidden
     pocket       406 × 158.61, y 43.89 → 202, drawn above the card

   The three states, all from Figma:
     intro      → 434:3682 keyframes below: rest → peak → raised. The card is
                  LEFT raised; it never drops back into the folder on its own.
                  Replays every time the Download CV tab is selected.
     hover on   → 464:2830 (node 464:2845): raised → peak, 294 ms, linear
     hover off  → 465:3223 (node 465:3238): peak → raised, 293 ms, a spring
                  with bounce ≈ 0 (Figma's export; visually a smooth settle)
     click      → open the PDF in a new tab (the card is the link) */

export const CARD = {
  width: 360.898,
  height: 149.496,
  left: 22.551,
  /* top inside the clip frame (which starts 34 above the box) */
  top: 107.092,
};

export const POCKET = {
  /* top inside the clip frame */
  top: 77.887,
  height: 158.61,
};

export const CLIP = { top: -34, height: 236 };

export const REST_Y = 2.564;
export const PEAK_Y = -78.669;
export const RAISED_Y = -60.596;

/* The exported easing — an over-damped settle with no overshoot inside a
   segment; the overshoot lives in the keyframes themselves. */
export const figmaEase = (t: number) =>
  1 - Math.exp(-t * 11.1803) * (Math.cos(t * 0.1581) + 70.7054 * Math.sin(t * 0.1581));

/* Figma's clip is 2 s with times [0, 0.2529, 0.3996, 1], where the last
   segment holds at RAISED_Y — the card is already at rest by 799 ms. Since
   nothing changes after that, the hold is dropped and the same three
   keyframes are re-timed against a 0.7992 s duration: identical on screen,
   and the animation is actually finished when it looks finished. */
export const INTRO = {
  keyframes: [REST_Y, PEAK_Y, RAISED_Y],
  times: [0, 0.6329, 1],
  duration: 0.7992,
  ease: [figmaEase, figmaEase] as const,
  /* Hold until the pane carrying this card has finished fading in (PLATE_IN
     in ./folder.ts). The rise is heavily front-loaded — most of it happens in
     the first 150 ms — so starting under a half-faded plate hides the move. */
  delay: PLATE_IN,
};

/* 464:2830 "Motion (HoverOn)" — the exported transition is linear. */
export const HOVER_ON = { duration: 0.294, ease: "linear" } as const;

/* 465:3223 "Motion (HoverOff)" — exported as a spring, bounce 0.0001. */
export const HOVER_OFF = { type: "spring", duration: 0.293, bounce: 0.0001 } as const;
