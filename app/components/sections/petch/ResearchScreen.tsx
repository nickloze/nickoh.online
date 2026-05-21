"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import CategoryButton from "./CategoryButton";
import ScreenColumn from "./ScreenColumn";

type ResearchKey = "survey" | "experts";

const HEADING = "Information isn’t the issue, Engagement is.";

/** The paragraph copy for the default framing and each toggled finding. The
 *  three Figma frames of node 299:6016 are exactly these three states. */
const PARAGRAPHS: Record<"default" | ResearchKey, string> = {
  default:
    "Despite the abundance of health apps and tracking services available today, health literacy among young adults remains low. Through a mixed-methods study combining literature review, surveys, and interviews with medical professionals, one pattern kept surfacing:",
  survey:
    "Respondents voiced the same frustration again and again: nothing was motivating them to intrinsically care about their health. Existing tools track data, but they don’t build the desire to learn or change.",
  experts:
    "Medical professionals reinforced this from another angle. Health information, they noted, is often weighed down by jargon and overloaded terminology. Unfortunately, making it inaccessible at the exact moment it should feel actionable.",
};

/**
 * @mobile — screen 2 of the Petch case study (Figma 299:6016). Two pills toggle
 * the paragraph between the survey finding and the expert finding; tapping the
 * active pill again returns to the default framing.
 */
export default function ResearchScreen() {
  const [active, setActive] = useState<ResearchKey | null>(null);
  const reduce = useReducedMotion();

  const toggle = (key: ResearchKey) =>
    setActive((current) => (current === key ? null : key));

  return (
    <ScreenColumn>
      <div className="relative mb-3 min-h-0 w-full flex-1">
        <Image
          src="/figma/petch/research1.png"
          alt={
            "A research participant holding the Petch app, beside the quote: “Reminds people without them realising they need the reminder…”"
          }
          fill
          sizes="300px"
          className="object-contain"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[20px] text-muted">{HEADING}</h2>
        <motion.p
          key={active ?? "default"}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-[14px] text-ink"
        >
          {PARAGRAPHS[active ?? "default"]}
        </motion.p>
        <div className="flex flex-col items-start gap-1">
          <CategoryButton active={active === "survey"} onClick={() => toggle("survey")}>
            What the survey’s revealed
          </CategoryButton>
          <CategoryButton active={active === "experts"} onClick={() => toggle("experts")}>
            What the experts confirmed
          </CategoryButton>
        </div>
      </div>
    </ScreenColumn>
  );
}
