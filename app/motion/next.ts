/* The next-project panel at the foot of a story.

   Nic's call: the hard-scroll / pull gesture is gone. The panel is a plain
   <Link> and a click is the whole interaction, so nothing here arms,
   accumulates, thresholds or decays. Two things are left — how the card
   answers a pointer, and how the two layers trade places when the card is
   pressed. */

/* Hovering the card — Nic's call.

   It used to brighten: the haze over the cover crossfaded to a lifted curve,
   so the picture came up under the pointer. That is gone. The card now simply
   RISES, and the haze (globals.css: --gradient-next-cover, the frame's own
   ramp) is a constant — one fewer thing the type's contrast can depend on.

   6px is the whole move: the card is a 240-high strip sitting exactly on the
   frame's bottom padding line, and anything larger reads as the panel coming
   loose from that line rather than lifting toward the pointer. A tap gets the
   same rise through :active, which is why the rise is not gated on a fine
   pointer — on a phone it is the press's only acknowledgement.

   THE CURVE is the one place this move departs from the site's EASE
   [0.22, 1, 0.36, 1]. That curve is a quintic ease-OUT: it spends most of its
   travel in the first fifth of the time, which is right for something
   arriving — a page, a notch, a cover — and wrong for a 6px lean. At 6px
   there is not enough distance for the long tail to be felt, so all the
   reader gets is the jump at the front, and Nic read exactly that: abrupt.

   This one eases in as well as out, symmetrically, so the card takes up the
   move rather than snapping into it and settles rather than stopping. It is
   slower too — 420ms over 6px is gentle by design; the rise is an atmosphere,
   not a response that has to keep up with the pointer. The same curve runs
   both ways, so leaving the card is as unhurried as arriving on it.

   Tailwind cannot read a TS constant, so the literals live in NextProject's
   class list and this is the documented source for them. */
export const LIFT_PX = 6;
export const LIFT_MS = 420;
export const LIFT_EASE = [0.4, 0, 0.2, 1] as const;

/* Pressing the card. The outgoing layer slides up and fades on CROSSFADE.out
   while the arriving one rises in on CROSSFADE.in, so the click reads as
   having pushed the next page up from below. The arrow keys keep their flat
   crossfade: the rise is gated on origin === "handoff". Both are transforms,
   so MotionConfig reducedMotion="user" drops them by itself and the plain
   crossfade survives — the honest degradation. */
export const COMMIT_LIFT = 48; /* px the outgoing layer travels up */
export const COMMIT_RISE = 20; /* px the arriving layer rises from */
