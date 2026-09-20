"use client";

import Image from "next/image";
import Link from "next/link";
import { isPlainClick } from "../../lib/click";
import { neighbours, type Project } from "../../lib/projects";
import { useProject } from "../ProjectContext";

/* The end of a story is the next project.

   No Figma frame — Nic's call, from the reference he gave: the next project's
   cover lying behind a scrim, with a small label and its name over it, as the
   last thing in the column. It replaces the prev / next / "All work" block
   that used to sit in the panel, so this panel is now the only way on and the
   only way back — the chip at its top right goes home.

   The reader reaches it by simply finishing the page, and it ends exactly on
   the frame's bottom padding line, level with "Available for Work" in the
   panel beside it (ProjectView drops the column's trailing padding for it).

   Both controls are real links, and a click is the whole interaction — there
   is no gesture (Nic's call: the hard scroll is gone). A chip cannot be nested
   inside the card's own <a>, so the card's link is an overlay *behind* the
   chip rather than a wrapper around the text.

   THE HAZE no longer answers the pointer (Nic's call — the brightening is
   gone). Two constant layers do two different jobs:
     --gradient-next-cover   the frame's ramp over the cover, Figma 806:3193.
     --gradient-next-scrim   under the words only, what holds the label and
                             the name above 4.5:1 as a wrapping name pushes
                             down the box.
   Neither has a state, so the type's contrast is fixed rather than something
   a hover could be caught mid-way through.

   WHAT ANSWERS THE POINTER is the card itself: it rises 6px (app/motion/
   next.ts). Hover, focus-within and :active all get it, so a mouse, a
   keyboard and a tap are told the same thing — on a phone the press is the
   only chance to say it.

   The cover here is the STILL, never LoopVideo: a second video decoding at the
   foot of the column would fight `useVideoPlayback`'s one-play-group-per-
   scroller rule, and a still is what a preview wants to be. The video starts
   when the project itself opens.

   @desktop  995 × 240 — the cover cropped to the floor the page's own cover is
             allowed to shrink to, so the panel is a strip of the page to come
             and never a second hero.
   @mobile   331 × 160 — a taller crop, because at 331 the desktop strip leaves
             no room under the name.
   @mobile (tablet) — the @desktop crop at the tablet margins. */

export default function NextProject({ project }: { project: Project }) {
  const { close, handoff } = useProject();
  const { next } = neighbours(project.slug);

  return (
    <section aria-label="Next project" className="flex flex-col">
      {/* fainter than the story's own rules — this one closes the page rather
          than starting another row */}
      <hr className="h-[0.5px] border-0 bg-fg-faint" />

      {/* One grid cell holds the strip's minimum height, the media and the
          text, so the panel is the taller of the two: a long name at a narrow
          width grows the box instead of being clipped out of it. */}
      {/* The 6px rise, on the card as a whole (app/motion/next.ts). It is
          gated on the CARD's own link rather than on the box, so the chip
          sitting inside the box — which goes somewhere else entirely — does
          not lift the card the reader is not about to open. :active carries
          the tap, hover the mouse, focus-visible the keyboard. The transition
          is on transform alone, so nothing else here is dragged onto a
          timeline, and the curve is its own — an ease-in-out rather than the
          site's ease-out, which over 6px is all front-loaded jump
          (app/motion/next.ts). */}
      <div className="group relative mt-[24px] grid w-full grid-cols-1 overflow-hidden rounded-[var(--radius-card-mobile)] transition-transform duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform [&:has([data-next-panel]:hover)]:-translate-y-[6px] [&:has([data-next-panel]:focus-visible)]:-translate-y-[6px] [&:has([data-next-panel]:active)]:-translate-y-[6px] motion-reduce:transition-none motion-reduce:[&:has([data-next-panel]:hover)]:translate-y-0 motion-reduce:[&:has([data-next-panel]:focus-visible)]:translate-y-0 motion-reduce:[&:has([data-next-panel]:active)]:translate-y-0 tablet:mt-[45px] tablet:rounded-card">
        <div
          aria-hidden="true"
          className="[grid-area:1/1] w-full [aspect-ratio:331/160] tablet:[aspect-ratio:995/240]"
        />

        {/* the cover, centred on its own 995 : 550 shape so the strip crops it
            evenly top and bottom — the same rule Cover uses on the page */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 [aspect-ratio:995/550]">
            <Image
              src={next.cover.still}
              alt=""
              fill
              sizes="(min-width: 64rem) 995px, (min-width: 48rem) calc(100vw - 80px), calc(100vw - 71px)"
              className="object-cover"
            />
          </div>
          {/* Figma 806:3193's ramp, constant. No flat dim — the frame does
              not have one, and it is what made the top read as a slab. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[image:var(--gradient-next-cover)]"
          />
        </div>

        <div className="relative z-10 [grid-area:1/1] mt-auto flex min-w-0 flex-col gap-[8px] bg-[image:var(--gradient-next-scrim)] p-[20px] pt-[72px] tablet:gap-[12px] tablet:p-[32px] tablet:pt-[96px]">
          <p className="flex items-center gap-[6px] font-sans text-[13px] leading-[18px] tracking-[-0.02em] text-fg-muted transition-colors group-hover:text-fg tablet:text-[14px]">
            Next project
            <span aria-hidden="true">&#8600;</span>
          </p>
          <p className="font-sans text-[24px] leading-[normal] font-medium tracking-[-0.02em] text-fg tablet:text-[36px]">
            {next.page.title}
          </p>
        </div>

        {/* the whole card opens the next project */}
        <Link
          href={`/work/${next.slug}`}
          replace
          scroll={false}
          data-next-panel
          aria-label={`Next project: ${next.page.title}`}
          onClick={(e) => {
            if (!isPlainClick(e)) return;
            e.preventDefault();
            handoff(next.slug);
          }}
          className="absolute inset-0 z-20 rounded-[var(--radius-card-mobile)] outline-none focus-visible:ring-2 focus-visible:ring-fg/40 focus-visible:ring-inset tablet:rounded-card"
        />

        {/* …and the chip over it goes home. It borrows the project tag pills'
            shape (ProjectHeader), so it is the site's own chip rather than a
            new object. On a touch screen its hit area grows to a 44px band. */}
        <Link
          href="/"
          scroll={false}
          onClick={(e) => {
            if (!isPlainClick(e)) return;
            e.preventDefault();
            close();
          }}
          className="absolute top-[16px] right-[16px] z-30 flex items-center gap-[6px] rounded-full bg-pill px-[12px] py-[5px] font-sans text-[13px] leading-[normal] tracking-[-0.02em] whitespace-nowrap text-fg-muted outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-fg/40 tablet:top-[20px] tablet:right-[20px] tablet:px-[16px] tablet:py-[6px] tablet:text-[16px] pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-[44px] pointer-coarse:before:-translate-y-1/2 pointer-coarse:before:content-['']"
        >
          <span aria-hidden="true">&#8598;</span>
          Back home
        </Link>
      </div>
    </section>
  );
}
