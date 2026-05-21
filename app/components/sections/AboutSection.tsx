"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useState } from "react";
import { ABOUT } from "../../lib/sections";
import { IconChevrons } from "../ui/icons";
import TagPill from "../ui/TagPill";
import SectionShell from "./SectionShell";

/** Staggered fade-and-rise for the expanded content (per the design spec). */
const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

/**
 * Section 2 — About Me. Two layouts share the section frame:
 *  - Mobile (<md): arrives collapsed ("About Me+" with a bobbing chevron);
 *    tapping the chevron expands it to the tag stacks. Unchanged from the
 *    iPhone frames.
 *  - Desktop (md+): the Figma frame (240:1461) — "About Me+" sits beside the
 *    Areas of Practice and Beyond Design tag groups, all shown at once.
 */
export default function AboutSection() {
  return (
    <SectionShell>
      <AboutMobile />
      <AboutDesktop />
    </SectionShell>
  );
}

/** Mobile (<md) — collapsed/expanded About, exactly as the iPhone frames. */
function AboutMobile() {
  const [expanded, setExpanded] = useState(false);
  const reduce = useReducedMotion();
  const { areasOfPractice, beyondDesign } = ABOUT;

  if (!expanded) {
    return (
      <div className="flex w-full items-center justify-between md:hidden">
        <p className="fs-primary text-muted">About Me+</p>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-expanded={false}
          aria-label="Show areas of practice"
          className="-m-2 flex shrink-0 items-center rounded-full p-2 text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
        >
          <motion.span
            animate={reduce ? undefined : { x: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="block"
          >
            <IconChevrons className="h-[28.8px] w-[28.8px]" />
          </motion.span>
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={listVariants}
      initial={reduce ? false : "hidden"}
      animate="show"
      className="flex w-full flex-col gap-6 md:hidden"
    >
      <TagGroup label="Areas of Practice" items={areasOfPractice} labelGap="gap-4" />
      <TagGroup label="Beyond Design" items={beyondDesign} labelGap="gap-3" />
    </motion.div>
  );
}

function TagGroup({
  label,
  items,
  labelGap,
}: {
  label: string;
  items: string[];
  labelGap: string;
}) {
  return (
    <div className={`flex flex-col items-start ${labelGap}`}>
      <motion.p variants={itemVariants} className="fs-primary text-muted">
        {label}
      </motion.p>
      <div className="flex flex-col items-start gap-1">
        {items.map((tag) => (
          <motion.div key={tag} variants={itemVariants}>
            <TagPill>{tag}</TagPill>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Desktop (md+) — "About Me+" label beside the tag groups (Figma 240:1461). */
function AboutDesktop() {
  const { areasOfPracticeDesktop, beyondDesign } = ABOUT;
  return (
    <div className="hidden w-full md:flex md:items-center md:gap-[60px]">
      <p className="fs-primary shrink-0 whitespace-nowrap text-muted">About Me+</p>
      <div className="flex min-w-0 flex-1 flex-col gap-9">
        <DesktopTagGroup label="Areas of Practice" items={areasOfPracticeDesktop} />
        <DesktopTagGroup label="Beyond Design" items={beyondDesign} />
      </div>
    </div>
  );
}

function DesktopTagGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-col items-start gap-4">
      <p className="fs-primary text-muted">{label}</p>
      <div className="flex flex-wrap items-start gap-2">
        {items.map((tag) => (
          <TagPill key={tag}>{tag}</TagPill>
        ))}
      </div>
    </div>
  );
}
