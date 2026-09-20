# nickoh.online

Portfolio for **Nicholas Koh** — Product Designer, Singapore.

A folder on the left (About / Let's Chat / Download CV) and a feed of four
project cards on the right. Click a card and its cover rises and grows into the
project's page, then the details fade in; the feed waits, frozen, underneath.
The folder never moves; only the feed (or an open project) scrolls, without a
visible scrollbar.

## Source of truth

Figma file `k56TffzeUrNoE61NvHqRj3` — home `373:2659`, projects Refine
`672:3003` · Petch `567:780` · SOS `605:1398` · Shopping AI `615:2321`, mobile
`441:243`, folder variants `434:3683` / `434:3684` / `434:3682`. Every size,
colour, radius and string in the code is lifted from those nodes; see
`CLAUDE.md` for the viewport tokens (`@desktop` 1512, `@mobile` 402, and the
768–1023 tablet tier).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 (`@theme` tokens
in `app/globals.css`) · [Motion](https://motion.dev) · Inter, EB Garamond and
Geist Mono via `next/font`.

## Routes

```
/                 the feed
/work/refine      a project, opened over the feed (also /petch, /sos, /checkout-experience)
```

Both render the same persistent `Shell` from `app/(site)/layout.tsx`; the pages
themselves are empty and exist for the URL, the static render and the metadata
(each project has its own title and share card). Any other `/work/…` is a 404.

## Where things live

```
app/components/Shell.tsx        one DOM tree; grid areas swap the layout at 768 / 1024
app/components/ProjectContext   which project is open, how it got there, the morph pairing
app/components/panel/           the folder and the prev / next pair
app/components/work/            the feed and the project card
app/components/project/         the project page and the @mobile bottom bar
app/components/media/           the flying cover and the looping video
app/hooks/useVideoPlayback.ts   which video plays, from where the reader has scrolled
app/motion/                     every animation number — nothing is inlined elsewhere
app/lib/data.ts                 folder copy and hrefs
app/lib/projects.ts             project copy, media slots, which slots have video
public/work/<slug>/             <slot>.mp4 + <slot>.jpg (the still is frame 0)
```

## The folder tab

The active tab is one SVG `<path>` whose numbers are driven by three springs
(left edge, right edge, left-edge slant). Clicking a tab retargets the springs,
so the notch slides and reshapes in one motion and a click mid-flight redirects
it from wherever it is. `app/motion/tabNotch.ts` holds the geometry, taken from
the exported Figma vectors.

Download CV plays the keyframes Figma exported for the card (`app/motion/resumeCard.ts`),
then settles back; hovering the folder raises the card; clicking it opens the
PDF in a new tab.

## Swapping a video

Figma's video fills can't be exported, so the videos are encoded from the
source files (Google Drive `C+/Folio/<project>`, `LASALLE/Deliverables`,
`~/Desktop/Petch Portfolio Framed`):

```bash
scripts/encode-video.sh ~/path/to/new.mp4 public/work/refine/02
```

That writes `02.mp4` (H.264, muted, ≤1990 wide, colour-tagged so it matches the
page) and `02.jpg` (its first frame). If the slot didn't have a video before,
add its name to `VIDEO` in `app/lib/projects.ts`.

## Run

```bash
npm run dev
```
