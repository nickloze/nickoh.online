@AGENTS.md

# Viewport Design System

## Overview
This is Nic's personal portfolio and web presence at **nickoh.online**. The site is responsive — one codebase, one domain, serving the same content and elements at every screen size. But it serves two distinct UI contexts — a desktop web experience and a mobile web experience — and each is a separate, intentional design target. Content, hierarchy, and the navigation model (dot-nav rail, floating island, paginated section deck) carry over between them; what changes per viewport is layout, sizing, and positioning. The mobile view is designed deliberately to the 402px frame — never the desktop layout left to shrink.

To distinguish between them, this project uses two viewport tokens:

- `@desktop` — targets the desktop web interface at nickoh.online
- `@mobile` — targets the mobile web interface at nickoh.online

These tokens must appear in prompts, file names, folder structure, and inline code comments to signal which context is being worked on.

---

## What Each Token Means

### @desktop
- Reference frame: **1440px wide**
- Layouts: multi-column or horizontal arrangements, spacious whitespace
- Navigation: a persistent vertical dot-nav rail, plus a floating island of quick actions (Work Library, Messages, Résumé, Contact) centred at ~75% viewport height
- Interactions: hover states are acceptable and expected
- Typography: comfortable reading sizes (base 16px, generous line-height)
- Cursor: pointer-based, precise click targets
- Domain: nickoh.online

### @mobile
- Reference frame: **402px wide** — iPhone 17 Pro CSS viewport (1206px physical ÷ 3x DPR)
- Device pixel ratio: 3x (@3x assets where applicable)
- Layouts: single-column, vertically stacked, thumb-friendly
- Navigation: the same dot-nav rail and floating island; the island is anchored near the bottom, centred above the safe-area inset
- Interactions: tap and long-press only — no hover-dependent logic
- Touch targets: minimum 44×44px for all interactive elements
- Typography: slightly larger tap-friendly text, short line lengths
- Safe area: respect top (62pt) and bottom (34pt) safe area insets for Dynamic Island
- Domain: nickoh.online (same domain, NOT m.nickoh.online)

---

## Rules Claude Must Follow

1. **Never assume the viewport.** If a prompt does not include `@desktop` or `@mobile`, ask before proceeding: *"Should I design this for @desktop or @mobile?"*

2. **Never mix tokens in one component** unless explicitly asked for a shared or adaptive layout. When mixing is required, separate logic clearly with comments: `// @desktop styles` and `// @mobile styles`.

3. **`@mobile` is not `@desktop`, shrunk.** The site is responsive, but each viewport is designed deliberately — `@mobile` is built for the 402px context, not the desktop layout reflowed. The tokens label *which viewport you are intentionally designing*, not whether the site is responsive.

4. **Tokens apply everywhere:**
   - File names: `About.desktop.tsx` / `About.mobile.tsx`
   - Folder structure: `/views/desktop/` and `/views/mobile/`
   - Inline comments: `// @desktop — multi-column layout begins here`
   - Build `@desktop` components to the 1440px frame and `@mobile` components to the 402px frame. (Tailwind — this project's CSS tool — is mobile-first by default: unprefixed utilities are the mobile baseline and `md:`/`lg:` layer on larger screens. The token sets which frame you design *to*; it does not change that base.)

5. **Same domain, same URLs.** Both the desktop and mobile experiences are served from the same paths under nickoh.online (`/`, `/work/[slug]`) — there is no `m.nickoh.online` and no device-specific routing. The viewport split happens inside the app, by which view renders, not at the URL level.

---

## Quick Reference

| Token     | CSS Width | Physical Res     | DPR | Nav Pattern                | Interactions      |
|-----------|-----------|------------------|-----|----------------------------|-------------------|
| @desktop  | 1440px    | —                | 1x  | Dot rail + floating island | Hover + Click     |
| @mobile   | 402px     | 1206 × 2622 px   | 3x  | Dot rail + floating island | Tap + Long-press  |

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
