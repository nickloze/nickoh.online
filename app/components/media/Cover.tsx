"use client";

import { motion } from "motion/react";
import { COVER_RATIO, type Project } from "../../lib/projects";
import { MORPH } from "../../motion/project";
import { coverId, coverMediaId } from "../ProjectContext";
import LoopVideo from "./LoopVideo";

/* A project's cover — the element that flies when a project opens.

   Two layers carry the same layoutIds in the card and on the project page:
     the box     the rounded, clipping frame. It fills whatever its parent
                 gives it: 995 × 521.49 on the card, up to 995 × 550 on the
                 page — where @desktop it is shorter when the viewport is, so
                 the title block fits above the bottom of the frame. Only its
                 height changes.
     the media   always the cover's own 995 : 550 shape, at the box's width.
                 On the card it is centred (or placed by `card.crop`) and
                 clipped; on the page it is centred too, so a shorter box crops
                 it top and bottom evenly. It has its own layoutId, so it
                 glides into place instead of popping, and it is never
                 squashed mid-flight.

   `fly` is decided by the caller: cards always carry their ids; a project
   page only when it was opened from its card (ProjectContext's `morph`). */

const CARD_H = 521.49;
const COVER_H = 550;

function mediaPlacement(crop: Project["card"]["crop"]) {
  /* in 995-wide units → % of the card's height / width */
  const top = crop?.top ?? -(COVER_H - CARD_H) / 2;
  const scale = crop?.scale ?? 1;
  return {
    top: `${((top / CARD_H) * 100).toFixed(4)}%`,
    height: `${(((COVER_H * scale) / CARD_H) * 100).toFixed(4)}%`,
    width: `${(scale * 100).toFixed(4)}%`,
    left: 0,
  };
}

export default function Cover({
  project,
  variant,
  gen,
  fly,
  sizes,
  priority = false,
}: {
  project: Project;
  variant: "card" | "page";
  gen: number;
  fly: boolean;
  sizes: string;
  priority?: boolean;
}) {
  const { slug } = project;
  const onCard = variant === "card";

  return (
    <motion.div
      layoutId={fly ? coverId(slug, gen) : undefined}
      transition={{ layout: MORPH }}
      className="absolute inset-0 overflow-hidden rounded-[var(--radius-card-mobile)] tablet:rounded-card"
    >
      <motion.div
        layoutId={fly ? coverMediaId(slug, gen) : undefined}
        transition={{ layout: MORPH }}
        className={onCard ? "absolute" : "absolute top-1/2 left-0 w-full -translate-y-1/2"}
        style={onCard ? mediaPlacement(project.card.crop) : { aspectRatio: COVER_RATIO }}
      >
        <LoopVideo media={project.cover} sizes={sizes} priority={priority} handoff={slug} />
      </motion.div>
    </motion.div>
  );
}
