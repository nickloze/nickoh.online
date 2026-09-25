"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CARD_RATIO, type Project } from "../../lib/projects";
import { captionFollow, EXPAND_SCALE, EXPAND_SPRING, HOVER_SCALE } from "../../motion/feed";
import { DISSOLVE } from "../../motion/project";
import { HOVER_QUERY, useMediaQuery } from "../../hooks/useMediaQuery";
import { useProject } from "../ProjectContext";
import Cover from "../media/Cover";
import { captureFrame } from "../media/LoopVideo";

/* Figma "Parent" → "Slide" + "project-card › content-row" on 373:2659.
   @desktop  373:2676 — 995 × 521.49 cover, 20px Inter row, pt 12 / pb 48
   @mobile   437:5314 — the same 1.908 cover at the column width (the mock's
             older 331 × 225.74 slot was drawn around a still), 15px Inter row
             (bumped 3px up from Figma's 12px, per Nic's request) that wraps
             at 121, pt 12 / pb 24. Below 402 the row's text scales
             down with the column (--caption-size, floor 12px) so a narrow
             phone keeps the same line breaks
   @mobile (tablet) — the @mobile card at @desktop type sizes

   The whole card — image or text — opens the project. Scrolling it toward
   the middle of the feed expands it by 1.5%, and hovering the cover (where
   hover exists) by 2.5% — a hover is answered from a standing start, so it
   has to say more than the scroll does (app/motion/feed.ts). The growth
   rides a wrapper outside the flying box so the scale never leaks into the
   shared-element handoff. The caption row zooms WITH it, on the same spring
   and the same scale, so cover and row read as one card growing rather than
   a picture that swells while its label sits still. One `grow` figure drives
   both, so they can never disagree about the state — and hover wins over the
   scroll while both are true, since it is the stronger of the two.

   While its project is open the card holds its exact box as an empty
   placeholder; every other card, and every caption row, dissolves. */
export default function ProjectCard({
  project,
  index,
  expanded,
}: {
  project: Project;
  index: number;
  expanded: boolean;
}) {
  const reduce = useReducedMotion();
  const canHover = useMediaQuery(HOVER_QUERY);
  const { open, morph, gen } = useProject();
  const article = useRef<HTMLElement>(null);
  const { slug, card } = project;

  const [hovered, setHovered] = useState(false);
  const flown = morph === slug; /* its cover is on the project page */
  const hidden = open !== null && !flown;
  const still = reduce || open !== null;
  const grow = still ? 1 : hovered ? HOVER_SCALE : expanded ? EXPAND_SCALE : 1;

  return (
    <article ref={article} data-card={slug} className="flex w-full flex-col items-start">
      <Link
        href={`/work/${slug}`}
        scroll={false}
        onClick={() => captureFrame(slug, article.current)}
        className="group block w-full rounded-[var(--radius-card-mobile)] outline-none focus-visible:ring-2 focus-visible:ring-fg/40 tablet:rounded-card"
      >
        <motion.div
          data-play-group
          className="relative w-full"
          style={{ aspectRatio: CARD_RATIO }}
          initial={false}
          animate={{ scale: grow, opacity: hidden ? 0 : 1 }}
          transition={{ scale: EXPAND_SPRING, opacity: DISSOLVE }}
          /* hover is state rather than `whileHover` so the caption row below
             can read it too; `canHover` keeps a tap from leaving a phone card
             stuck expanded */
          onPointerEnter={() => canHover && setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          {flown ? null : (
            /* Keyed by gen: Motion registers a layoutId when the element
               mounts, so a retired pairing needs a fresh element, not a new
               id on the old one. It only changes while the feed is hidden. */
            <Cover
              key={gen}
              project={project}
              variant="card"
              gen={gen}
              fly
              priority={index === 0}
              sizes="(min-width: 64rem) 995px, (min-width: 48rem) calc(100vw - 80px), calc(100vw - 31px)"
            />
          )}
        </motion.div>

        {/* `origin-top` plus captionFollow is what makes this a card zoom
            rather than a row nudge: scaled about its own top edge and pushed
            down by how far that edge sits below the cover's centre, every
            point in the row lands exactly where scaling the whole card about
            the cover's centre would put it. */}
        <motion.div
          className="flex w-full origin-top items-start justify-between pt-card-pt pb-card-pb-mobile tablet:pb-card-pb"
          initial={false}
          animate={{
            scale: grow,
            y: captionFollow(grow),
            opacity: open !== null ? 0 : 1,
          }}
          transition={{ scale: EXPAND_SPRING, y: EXPAND_SPRING, opacity: DISSOLVE }}
        >
          {/* @mobile — sized in em of --caption-size (15px at 402, smaller
              below it), so the 121px wrap, the 9.058 gap and the tracking all
              scale with the text and the line breaks stay the 402 frame's */}
          <h2 className="max-w-[10.0833em] font-sans text-[length:var(--caption-size)] leading-[normal] font-normal tracking-[-0.015em] text-fg tablet:max-w-none tablet:text-[20px] tablet:tracking-[-0.3px]">
            {card.title}
          </h2>
          <p className="flex shrink-0 items-center gap-[0.7548em] font-sans text-[length:var(--caption-size)] leading-[normal] whitespace-nowrap tablet:gap-[9.058px] tablet:text-[20px]">
            <span className="text-fg-muted tracking-[-0.015em] tablet:tracking-[-0.3px]">{card.client}</span>
            <span className="text-fg tracking-[-0.02em] tablet:tracking-[-0.4px]">{card.year}</span>
          </p>
        </motion.div>
      </Link>
    </article>
  );
}
