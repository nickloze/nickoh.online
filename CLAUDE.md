@AGENTS.md

# Viewport Design System

## Overview
This is Nic's personal portfolio and web presence at **nickoh.online**. The site is responsive — one codebase, one domain, serving the same content at every screen size. But it serves two distinct UI contexts — a desktop web experience and a mobile web experience — and each is a separate, intentional design target. The mobile view is designed deliberately to the 402px frame — never the desktop layout left to shrink.

**Figma is the single source of truth** (file `k56TffzeUrNoE61NvHqRj3`): desktop frame `373:2659`, mobile frame `441:243`, folder-tab component set `434:3685`. Pull the live frame via the Figma MCP tools; do not build from memory or from pasted exports.

To distinguish between the two contexts, this project uses two viewport tokens:

- `@desktop` — targets the desktop web interface at nickoh.online
- `@mobile` — targets the mobile web interface at nickoh.online

These tokens must appear in prompts, file names, folder structure, and inline code comments to signal which context is being worked on.

---

## The page

One page, one DOM tree, two layouts (`app/components/Shell.tsx`):

- **The folder panel** (`app/components/panel/`) — a tactile folder with three tabs: About / Let's Chat / Download CV. One box beneath the tabs whose content follows the active tab (bio · socials list · CV pocket). A single SVG notch travels between tabs and reshapes as it goes; it is never destroyed and recreated. All motion numbers live in `app/motion/` — components import from there and carry no inline animation values.
- **The work feed** (`app/components/work/`) — the only scrolling region on the page. The document body never scrolls; the scrollbar is hidden. Cards are inert until a project detail view is designed; hover and scrolling expand the cover by 3%.
- Copy and hrefs live in `app/lib/data.ts`; every string is lifted from Figma.

---

## What Each Token Means

### @desktop
- Reference frame: **1512px wide** (Figma `373:2659`; 1440 is the secondary check)
- Layout: 64px frame padding, 24px gap, folder panel fixed at 406px on the left, feed on the right
- Navigation: the folder tabs; "Available for Work" pinned to the bottom of the panel
- Interactions: hover states are acceptable and expected
- Cursor: pointer-based, precise click targets
- Domain: nickoh.online

### @mobile
- Reference frame: **402px wide** — iPhone 17 Pro CSS viewport (1206px physical ÷ 3x DPR), Figma `441:243`
- Device pixel ratio: 3x (@3x assets where applicable)
- Layout: single column — the feed scrolls in a window on top (with a fade over its bottom), the folder sits below it at 330.8px wide (the desktop folder scaled by 0.8148 via `--folder-unit`)
- Interactions: tap and long-press only — no hover-dependent logic
- Touch targets: minimum 44×44px for all interactive elements
- Safe area: respect top and bottom safe-area insets for the Dynamic Island and the browser bar
- No "Available for Work" row (not in the frame)
- Domain: nickoh.online (same domain, NOT m.nickoh.online)
- Breakpoint: the layout switches at **1024px** (`desktop:` variant)

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

5. **Same domain, same URLs.** Both the desktop and mobile experiences are served from the same path under nickoh.online (`/`) — there is no `m.nickoh.online` and no device-specific routing. The viewport split happens inside the app, by CSS grid areas in `Shell`, not at the URL level.

---

## Quick Reference

| Token     | CSS Width | Physical Res     | DPR | Nav Pattern                | Interactions      |
|-----------|-----------|------------------|-----|----------------------------|-------------------|
| @desktop  | 1512px    | —                | 1x  | Folder tabs                | Hover + Click     |
| @mobile   | 402px     | 1206 × 2622 px   | 3x  | Folder tabs                | Tap + Long-press  |

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
