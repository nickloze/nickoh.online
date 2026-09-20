/* The project feed. The annotation on Figma 373:2675 asks for the image to
   "slightly expand like 2.5–5%" while the user scrolls, to invite a click.
   The same expansion answers hover (where hover exists) — the card then opens
   its project (app/motion/project.ts has that move).

   The two gestures get different amounts, deliberately:

   SCROLL — 1.5%, under the annotation's floor. Nic called 3% too strong on
   the built thing, twice; the note was written against a still, and at 995
   wide 3% is 30px of travel across, which reads as a lurch rather than an
   invitation while the feed is already moving. The deviation is the
   designer's call on his own site — this comment is here so nobody "fixes"
   it back to the note.

   HOVER — 2.5%, the annotation's floor. A hover is a deliberate question
   asked of one card while everything else is still, and it is answered from
   a standing start with nothing else moving to compare against: at the
   scroll's 1.5% the answer arrived but read as nothing at all (Nic, on the
   built thing: "it doesn't zoom"). It still has to sit under the 3% he
   rejected, so it lands between the two. */

export const EXPAND_SCALE = 1.015;
export const HOVER_SCALE = 1.025;
export const EXPAND_SPRING = { type: "spring", stiffness: 260, damping: 28, mass: 1 } as const;

const COLUMN_W = 995;
const CARD_H = 521.49;
const CARD_PT = 12; /* --spacing-card-pt, cover to caption */

/* An expanded card grows past the feed's edges, and the feed is a scroller,
   which clips whatever leaves it — the cover's rounded corners with it. So the
   scroller is made bigger than the column by exactly the growth (half the
   extra size on each side: 995 × 1.25% ≈ 13px across, 521.49 × 1.25% ≈ 7px up
   and down, +1 for the edge) and padded back in, so nothing moves — only the
   clip does. The caption grows sideways too now, by the same fraction of the
   column, so the same room covers it. Cut to the LARGER of the two
   expansions — the room has to hold whichever one is showing. Read by
   WorkFeed. */
const MAX_SCALE = Math.max(EXPAND_SCALE, HOVER_SCALE);
export const EXPAND_ROOM = {
  x: Math.ceil(((MAX_SCALE - 1) / 2) * COLUMN_W) + 1,
  y: Math.ceil(((MAX_SCALE - 1) / 2) * CARD_H) + 1,
};

/* The caption ZOOMS WITH the cover rather than merely sitting under it: the
   two behave as one card scaling about the COVER's centre.

   A row scaled about its own top edge does exactly that, as long as it is also
   pushed down by the distance its top sits below that centre times the growth.
   The caption's top is 521.49 / 2 + 12 = 272.745 below the cover's centre, so
   at 1.5% it travels 4.09px and at 2.5% 6.82px — and every point below it
   lands where a whole-card zoom would put it, to the pixel. It takes the
   scale rather than assuming one, so hover and scroll each get their own.

   @mobile the cover is shorter, so the true figure is nearer 1.4px. The two
   are a couple of pixels apart on a move nobody can measure by eye, and hover
   does not exist there anyway — only the feed's own scroll expansion does.
   Read by ProjectCard, which pairs it with `origin-top`. */
export const captionFollow = (scale: number) =>
  Math.round((CARD_H / 2 + CARD_PT) * (scale - 1) * 100) / 100;

/* How long after the last scroll event the feed counts as still moving. */
export const SCROLL_IDLE_MS = 140;

/* @mobile — the fade over the foot of the feed says "there is more below".
   At the end of the scroll there is nothing below, so it has nothing to say
   and no business dimming the last card: it retreats over the final stretch
   of the scroll, reaching nothing exactly as the scroll does. The distance is
   the band's own height (--height-feed-band in globals.css), so the band is
   gone by the moment the last card's foot reaches the window's edge — and a
   feed too short to scroll never shows it at all. Read by WorkFeed. */
export const FADE_RETREAT = 96;
