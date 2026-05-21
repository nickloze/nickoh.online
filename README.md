# nickoh.online

Mobile portfolio for **Nicholas Koh** — Creative Technologist & Product/Service
Designer. Built mobile-first against the iPhone-17-Pro Figma frames.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
[Motion](https://motion.dev) for animation · Inter self-hosted via `next/font`.

## Routes

- `/` — the **deck**: four vertically-paginated sections that cross-fade one at
  a time (Landing → About → Work·Petch → Work·AcrossChat). The document never
  scrolls; one swipe / wheel / arrow-key advances one section.
- `/work/[slug]` — a **project detail page** (scrollable) with a top tab strip,
  a hero image, and the persistent floating island. Prerendered for `petch` and
  `acrosschat`.

## Figma → component map

File: `figma.com/design/cdlapN6h7IQ2PzhiDxJpQE/Website`

| Node | Frame | Component |
|---|---|---|
| `261:2230` | Landing | `app/components/sections/LandingSection.tsx` |
| `262:2474` | About — collapsed | `app/components/sections/AboutSection.tsx` (collapsed state) |
| `269:2756` | About — expanded | `app/components/sections/AboutSection.tsx` (expanded state) |
| `271:3395` | Work Library title card | `app/components/WorkLibraryTitleCard.tsx` |
| `274:3568` | Petch card | `app/components/sections/WorkLibrarySection.tsx` (`project={PETCH}`) |
| `274:3808` | AcrossChat card † | `app/components/sections/WorkLibrarySection.tsx` (`project={ACROSSCHAT}`) |
| `275:4105` | Petch — Overview tab | `app/components/ProjectDetail.tsx` |
| `275:4224` | Petch — Research tab | `app/components/ProjectDetail.tsx` |

Persistent chrome (in every frame): dot navigation →
`app/components/navigation/DotNav.tsx`; floating island →
`app/components/navigation/FloatingIsland.tsx`.

Supporting files: `app/components/Portfolio.tsx` (deck orchestration),
`app/components/SectionStage.tsx` (cross-fade), `app/hooks/useSectionNavigation.ts`
(paginated input), `app/lib/sections.ts` (all copy & project data),
`app/components/ui/icons.tsx` (icons inlined 1:1 from Figma).

## Architecture notes

- **Title card** — `WorkLibraryTitleCard` is a reusable transition (symbol
  fades in → word follows → holds → fades out → `onComplete`). It plays when
  entering the Work sections and replays when returning from a project page.
- **About / Work** each have a collapsed and an expanded state. The About
  chevron is a real `<button>`; tapping it staggers the practice tags in.
- **Detail page** — the hero image fades on scroll (`useScroll`); the tab strip
  and island stay fixed. Only the Overview tab has real copy.
- **Reduced motion** — all scroll/title-card/stagger animations have
  non-animated fallbacks under `prefers-reduced-motion`.
- Type and deck spacing scale down below the 375 px baseline so the no-scroll
  deck still fits small phones; 375 px and up render the Figma sizes exactly.

## Open items (need Nic's input)

- The prompt's frame map labels `274:3808` as a "project hero state"; the frame
  actually contains the **AcrossChat card**. Built as such.
- Floating-island icons 2–4 (chat / résumé / contact) have no destinations yet —
  marked `{TODO}` in `FloatingIsland.tsx`.
- AcrossChat detail page (`/work/acrosschat`) and the Research / Solution /
  Future Plans tabs render `{TODO: copy}` — no Figma content provided.
- Mobile **Areas of Practice** order (Service Design first) differs from the
  desktop frame; the mobile order is used here.

## Develop

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
```
