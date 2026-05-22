"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import CategoryButton from "./CategoryButton";
import ScreenColumn from "./ScreenColumn";

type SolutionKey = "personalisation" | "empathy" | "anticipatory";

/** Shown until a category is picked — the longer framing copy. */
const DEFAULT_BODY =
  "Digital Omotenashi reimagines the Japanese art of wholehearted hospitality as a design framework for digital care. Petch brings that philosophy to life, anticipating health needs, personalising every touchpoint, and turning passive knowing into active doing.";

interface Category {
  key: SolutionKey;
  label: string;
  image: string;
  alt: string;
  /** The shorter copy variant swapped in when this category is active. */
  body: string;
}

const CATEGORIES: Category[] = [
  {
    key: "personalisation",
    label: "Personalisation",
    image: "/figma/petch/solution1.png",
    alt: "A personalised Petch lesson about the user's sleep timing",
    body: "Petch turns your daily data into personalised lessons, helping you understand your health and commit to actions that actually stick.",
  },
  {
    key: "empathy",
    label: "Empathy",
    image: "/figma/petch/solution2.png",
    alt: "The Petch companion character",
    body: "Your pet health companion becomes a support symbol of omotenashi across all touch-points during your real-time health learning journey.",
  },
  {
    key: "anticipatory",
    label: "Anticipatory Care",
    image: "/figma/petch/solution3.png",
    alt: "A Petch health overview listing the day’s habits",
    body: "Petch breaks down your health into different levels, surfacing clear, easy-to-understand insights you might not have considered.",
  },
];

/** easeOutQuint — matches the deck's section cross-fade. */
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * @mobile — screen 3 of the Petch case study (Figma 299:6017). It opens as text
 * only; tapping a category pill shortens the paragraph and drops that
 * category's image into view. Tapping the active pill again returns to the
 * default copy.
 */
export default function SolutionScreen() {
  const [active, setActive] = useState<SolutionKey | null>(null);
  const reduce = useReducedMotion();

  const toggle = (key: SolutionKey) =>
    setActive((current) => (current === key ? null : key));
  const current = CATEGORIES.find((category) => category.key === active) ?? null;

  return (
    <ScreenColumn className="justify-center">
      {/* Image area collapses to nothing until a category is picked, then
          drops down into view as it fades in. */}
      <motion.div
        initial={false}
        animate={{ height: current ? "auto" : 0, opacity: current ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
        className="w-full overflow-hidden"
      >
        {current && (
          <div className="pb-5">
            <Image
              key={current.key}
              src={current.image}
              alt={current.alt}
              width={1200}
              height={563}
              sizes="440px"
              className="h-auto w-full rounded-[10px] border-2 border-surface"
            />
          </div>
        )}
      </motion.div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[20px] text-muted">
          Built on a single framework:
          <br />
          Digital Omotenashi
        </h2>
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((category) => (
            <CategoryButton
              key={category.key}
              active={active === category.key}
              onClick={() => toggle(category.key)}
            >
              {category.label}
            </CategoryButton>
          ))}
        </div>
        <motion.p
          key={active ?? "default"}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-[14px] text-ink"
        >
          {current?.body ?? DEFAULT_BODY}
        </motion.p>
      </div>
    </ScreenColumn>
  );
}
