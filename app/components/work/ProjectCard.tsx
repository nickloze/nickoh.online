"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "../../lib/data";
import { EXPAND_SCALE, EXPAND_SPRING } from "../../motion/feed";

/* Figma "Parent" → "Slide 4:3 - 1" + "project-card › content-row".
   @desktop  373:2676 — 20px Inter row, pt 12 / pb 48
   @mobile   437:5314 — 12px Inter row, pt 12 / pb 24, title wraps at 121
   The card is inert: nothing happens on click yet. Hovering, or scrolling it
   toward the centre of the feed, expands the image by 3%. */
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
  const { cover, crop } = project;

  return (
    <article className="flex w-full flex-col items-start">
      <motion.div
        className="relative w-full overflow-hidden rounded-card shadow-card [aspect-ratio:var(--ratio-mobile)] desktop:[aspect-ratio:var(--ratio-desktop)]"
        style={
          {
            "--ratio-desktop": project.ratio.desktop,
            "--ratio-mobile": project.ratio.mobile,
          } as React.CSSProperties
        }
        animate={{ scale: expanded && !reduce ? EXPAND_SCALE : 1 }}
        transition={EXPAND_SPRING}
        whileHover={reduce ? undefined : { scale: EXPAND_SCALE }}
      >
        <div
          className="absolute"
          style={crop ? { ...crop, position: "absolute" } : { inset: 0 }}
        >
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 64rem) calc(100vw - 558px), calc(100vw - 68px)"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      </motion.div>

      <div className="flex w-full items-start justify-between pt-card-pt pb-card-pb-mobile desktop:pb-card-pb">
        <h2 className="max-w-[121px] font-sans text-[12px] leading-[normal] font-normal tracking-[-0.18px] text-fg desktop:max-w-none desktop:text-[20px] desktop:tracking-[-0.3px]">
          {project.title}
        </h2>
        <p className="flex shrink-0 items-center gap-[9.058px] font-sans text-[12px] leading-[normal] whitespace-nowrap desktop:text-[20px]">
          <span className="text-fg-muted tracking-[-0.18px] desktop:tracking-[-0.3px]">
            {project.client}
          </span>
          <span className="text-fg tracking-[-0.24px] desktop:tracking-[-0.4px]">{project.year}</span>
        </p>
      </div>
    </article>
  );
}
