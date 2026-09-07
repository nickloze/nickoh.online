# nickoh.online

Portfolio for **Nicholas Koh** — Product Designer, Singapore.

One page. A folder on the left (About / Let's Chat / Download CV) and a feed of
project cards on the right. The folder never moves; the feed is the only thing
on the page that scrolls, and it scrolls without a visible scrollbar.

## Source of truth

Figma file `k56TffzeUrNoE61NvHqRj3` — desktop frame `373:2659`, mobile frame
`441:243`, folder component set `434:3685`. Every size, colour, radius and
string in the code is lifted from those nodes; see `CLAUDE.md` for the
viewport tokens (`@desktop` 1512, `@mobile` 402).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 (`@theme` tokens
in `app/globals.css`) · [Motion](https://motion.dev) · Inter and EB Garamond
via `next/font`.

## Where things live

```
app/components/Shell.tsx        one DOM tree; CSS grid areas swap the layout at 1024px
app/components/panel/           the folder: tabs, the travelling notch, the three panes
app/components/work/            the feed and the project card
app/motion/                     every animation number — nothing is inlined elsewhere
app/lib/data.ts                 all copy and hrefs
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

## Run

```bash
npm run dev
```
