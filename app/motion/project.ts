/* Opening a project — every number for the card → project move.

   The chosen direction from the lab (app/test/05-seamless): the card's cover
   and the project's cover are the same column width, so opening is a pure
   vertical rise plus a height grow (995 × 521.49 → 995 × 550). Nothing
   travels sideways; it reads as the card opening, not a page arriving.

   Sequence on open:
     0 ms    the other cards and every caption row dissolve in place
     0 ms    the cover rises to the top of the column and grows
     420 ms  as it lands, the details fade up underneath, section by section
   Closing runs it back into the exact card, at the feed's kept scroll. */

/* Exported so app/motion/next.ts shares the site's curve instead of restating
   the tuple. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/* The rise-and-grow. Long enough to read as one continuous move, short
   enough that it never feels performed at you. A tween, not a spring, so the
   cover and its media layer land together. */
export const MORPH = { duration: 0.56, ease: EASE };

/* The feed around the opened card. */
export const DISSOLVE = { duration: 0.28, ease: EASE };

/* "followed by a gradual fade-in of the details" — the header, the story and
   the gallery each rise 12px as they fade, starting as the cover lands. */
export const DETAILS_IN = {
  delay: 0.42,
  stagger: 0.08,
  duration: 0.6,
  y: 12,
  ease: EASE,
};
export const DETAILS_OUT = { duration: 0.15, ease: "easeIn" as const };

/* Prev / next, and any close that can't morph: the whole project layer
   crossfades. */
export const CROSSFADE = {
  out: { duration: 0.2, ease: "easeIn" as const },
  in: { duration: 0.35, ease: EASE },
};

/* @mobile — the folder slides down out of the way while a project is open,
   and the bottom bar takes its place once it has gone. */
export const FOLDER_AWAY = { duration: 0.3, ease: EASE };
export const BAR_IN = { duration: 0.25, delay: 0.18, ease: EASE };

/* @desktop — the prev / next pair in the panel. */
export const NAV_FADE = { duration: 0.2, ease: EASE };

/* Close morphs back into the card only while some of the cover is still on
   screen; deeper in, the cover would streak in from far above, so the
   project fades out instead.
     @mobile (and tablet)  a fixed scroll distance, in px of project scroll
     @desktop              the cover can be shorter than 550 (it gives height to
                           the title block), so the test follows its real
                           height: this many px of it must still be in view */
export const CLOSE_MORPH_MAX_SCROLL = 470;
export const CLOSE_MORPH_MIN_VISIBLE = 80;

/* The playing video fades in over its still once it is really running. */
export const VIDEO_IN = { duration: 0.25 };
