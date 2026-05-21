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
 * Section 2 — About Me. Arrives collapsed ("About Me+" with a bobbing chevron
 * affordance); tapping the chevron expands it to the Areas of Practice and
 * Beyond Design tag stacks, which fade-and-rise in with a short stagger.
 */
export default function AboutSection() {
  const [expanded, setExpanded] = useState(false);
  const reduce = useReducedMotion();
  const { areasOfPractice, beyondDesign } = ABOUT;

  if (!expanded) {
    return (
      <SectionShell>
        <div className="flex w-full items-center justify-between">
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
      </SectionShell>
    );
  }

  return (
    <SectionShell>
      <motion.div
        variants={listVariants}
        initial={reduce ? false : "hidden"}
        animate="show"
        className="flex w-full flex-col gap-6"
      >
        <TagGroup label="Areas of Practice" items={areasOfPractice} labelGap="gap-4" />
        <TagGroup label="Beyond Design" items={beyondDesign} labelGap="gap-3" />
      </motion.div>
    </SectionShell>
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
