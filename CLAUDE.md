@AGENTS.md

# Viewport Design System

## Overview
This is Nic's personal portfolio and web presence at **nickoh.online**. The site is responsive — one codebase, one domain, serving the same content at every screen size. But it serves two distinct UI contexts — a desktop web experience and a mobile web experience — and each is a separate, intentional design target. The mobile view is designed deliberately to the 402px frame — never the desktop layout left to shrink.

**Figma is the single source of truth** (file `k56TffzeUrNoE61NvHqRj3`): desktop home `373:2659`, project pages Refine `672:3003` · Petch `567:780` · SOS `605:1398` · Shopping AI `615:2321`, mobile frame `441:243`, folder variants `434:3683` About · `434:3684` Socials · `434:3682` Resume. Pull the live frame via the Figma MCP tools; do not build from memory or from pasted exports. Figma's video fills cannot be exported — the source videos live in Nic's Google Drive (`C+/Folio/<project>`, `LASALLE/Deliverables`) and `~/Desktop/Petch Portfolio Framed`; encode them with `scripts/encode-video.sh`.

To distinguish between the two contexts, this project uses two viewport tokens:

- `@desktop` — targets the desktop web interface at nickoh.online
- `@mobile` — targets the mobile web interface at nickoh.online

These tokens must appear in prompts, file names, folder structure, and inline code comments to signal which context is being worked on.

---

## The page

One DOM tree, three tiers (`app/components/Shell.tsx`), living in the `(site)` route-group layout so it survives navigation between `/` and `/work/<slug>` — the pages themselves render nothing:

- **The folder panel** (`app/components/panel/`) — a tactile folder with three tabs: About / Let's Chat / Download CV. One box beneath the tabs whose content follows the active tab (bio · socials list · CV pocket). A single SVG notch travels between tabs and reshapes as it goes; it is never destroyed and recreated. An inactive tab label turns white while hovered (@desktop) and returns to its faint grey on leave. All motion numbers live in `app/motion/` — components import from there and carry no inline animation values.
- **The work feed** (`app/components/work/`) — four cards; the document body never scrolls; the scrollbar is hidden. Hover and scrolling expand a cover by 3%; the feed's scroller is made bigger than the column by exactly that growth (`EXPAND_ROOM` in `app/motion/feed.ts`) so its clip never cuts the cover's rounded corners. Clicking a card (image or text) opens its project.
- **A project** (`app/components/project/`, route `/work/<slug>`) — opens over the feed's column. The card's cover rises and grows into the project cover (a Motion `layoutId` handoff owned by `ProjectContext`), then the details fade in. @desktop, the first screen of every project is fitted to the viewport: the cover shrinks (cropped, never squashed) so the title, PROJECT / YEAR, subtitle and tags always end exactly at the frame's bottom padding line — the Figma frame's reference height is 982 — and the story below is reached by scrolling. The feed stays mounted, frozen and inert underneath, so closing lands exactly where the reader was. Prev / next: `ProjectNav.desktop.tsx` above "Available for Work"; `ProjectBar.mobile.tsx` at the bottom @mobile. Esc closes, ← / → step.
- **Video** (`app/components/media/LoopVideo.tsx`, `app/hooks/useVideoPlayback.ts`) — never autoplays by attribute: one "play group" per scroller plays, the one under a reading line that walks down the scroller, so on load only the first cover plays (@desktop and tablet; @mobile, below 768, plays every video in the scroller at once, wherever the reader has scrolled — Nic's call). There is no pause control (Nic's call): the active group loops continuously, and only the system's reduced-motion setting leaves the stills. Files are in `public/work/<slug>/<slot>.{mp4,jpg}`.
- Panel copy and hrefs live in `app/lib/data.ts`, project copy and media in `app/lib/projects.ts`; every string is lifted from Figma (obvious typos corrected and listed there).

---

## What Each Token Means

### @desktop
- Reference frame: **1512px wide** (Figma `373:2659`; 1440 is the secondary check)
- Layout: 64px frame padding, 24px gap, folder panel fixed at 365.4px on the left (the 406-unit folder at 0.9, `--folder-unit: 14.4px`), feed 995 wide on the right; a project opens over the feed's column
- Navigation: the folder tabs; "Available for Work" pinned to the bottom of the panel; inside a project, the prev / next pair just above it
- Interactions: hover states are acceptable and expected
- Cursor: pointer-based, precise click targets
- Domain: nickoh.online

### @mobile
- Reference frame: **402px wide** — iPhone 17 Pro CSS viewport (1206px physical ÷ 3x DPR), Figma `441:243`
- Device pixel ratio: 3x (@3x assets where applicable)
- Layout: single column, 16 / 15 side margins (manual override from the Figma-derived 36 / 35, per Nic's request for a slightly wider column) — the feed scrolls in a window on top (with a fade over its bottom), the folder sits below it: tabs at 0.8153 × the 365.4 folder, box stretched to the 371 column, `--folder-unit` fluid below 402 so the bio keeps its line breaks (and `--caption-size` does the same for the card captions — 15px at 402, up 3px from the Figma-derived 12px per Nic's request, floor 12px). An open project takes the whole screen; the folder slides away and a bottom bar (← All work · ‹ 2/4 ›) takes its place
- Interactions: tap and long-press only — no hover-dependent logic
- Touch targets: minimum 44×44px for all interactive elements
- Safe area: respect top and bottom safe-area insets for the Dynamic Island and the browser bar
- No "Available for Work" row (not in the frame)
- Domain: nickoh.online (same domain, NOT m.nickoh.online)
- Breakpoints: `tablet:` from **768px**, `desktop:` from **1024px**

### @mobile (tablet)
- 768–1023px: the @mobile layout (feed on top, folder below, full-screen project with the bottom bar) at @desktop type sizes, 40px margins, the folder at its 365.4 desktop width
- Not a separate token — comment it `// @mobile (tablet)`

---

## Rules Claude Must Follow

1. **Never assume the viewport.** If a prompt does not include `@desktop` or `@mobile`, ask before proceeding: *"Should I design this for @desktop or @mobile?"*

2. **Never mix tokens in one component** unless explicitly asked for a shared or adaptive layout. When mixing is required, separate logic clearly with comments: `// @desktop styles` and `// @mobile styles`.

3. **`@mobile` is not `@desktop`, shrunk.** The site is responsive, but each viewport is designed deliberately — `@mobile` is built for the 402px context, not the desktop layout reflowed. The tokens label *which viewport you are intentionally designing*, not whether the site is responsive.

4. **Tokens apply everywhere:**
   - File names: `About.desktop.tsx` / `About.mobile.tsx`
   - Folder structure: `/views/desktop/` and `/views/mobile/`
   - Inline comments: `// @desktop — multi-column layout begins here`
   - Build `@desktop` components to the 1512px frame and `@mobile` components to the 402px frame. (Tailwind — this project's CSS tool — is mobile-first by default: unprefixed utilities are the mobile baseline and `md:`/`lg:` layer on larger screens. The token sets which frame you design *to*; it does not change that base.)

5. **Same domain, same URLs.** Both the desktop and mobile experiences are served from the same paths under nickoh.online (`/`, `/work/<slug>`) — there is no `m.nickoh.online` and no device-specific routing. The viewport split happens inside the app, by CSS grid areas in `Shell`, not at the URL level.

---

## Quick Reference

| Token     | CSS Width | Physical Res     | DPR | Nav Pattern                | Interactions      |
|-----------|-----------|------------------|-----|----------------------------|-------------------|
| @desktop  | 1512px    | —                | 1x  | Folder tabs · prev / next in the panel | Hover + Click     |
| @mobile   | 402px     | 1206 × 2622 px   | 3x  | Folder tabs · bottom bar in a project  | Tap + Long-press  |

---

## Usage Examples

In a prompt:
> "Build the Projects section @mobile"
> "Redesign the hero layout @desktop"

In a file name:
> `Hero.desktop.tsx`, `Hero.mobile.tsx`

In a comment:
> `// @mobile — stack cards vertically, respect bottom safe area`
> `// @desktop — multi-column grid starts here`
