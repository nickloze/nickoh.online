"use client";

import { useCallback, useEffect, useState } from "react";
import { useSectionNavigation } from "../hooks/useSectionNavigation";
import { ACROSSCHAT, FIRST_WORK_INDEX, PETCH, SECTIONS } from "../lib/sections";
import SectionStage from "./SectionStage";
import WorkLibraryTitleCard from "./WorkLibraryTitleCard";
import DotNav from "./navigation/DotNav";
import FloatingIsland from "./navigation/FloatingIsland";
import AboutSection from "./sections/AboutSection";
import LandingSection from "./sections/LandingSection";
import WorkLibrarySection from "./sections/WorkLibrarySection";

/** The five section views, indexed to match SECTIONS. */
const SECTION_VIEWS = [
  <LandingSection key="landing" />,
  <AboutSection key="about" />,
  <WorkLibrarySection key="petch" project={PETCH} />,
  <WorkLibrarySection key="acrosschat" project={ACROSSCHAT} />,
];

const isWorkIndex = (index: number) => SECTIONS[index]?.id.startsWith("work-") ?? false;

/**
 * Orchestrates the single-page portfolio deck: owns the active-section state,
 * wires up paginated navigation, and plays the Work Library title card on
 * entry into the Work sections (and on return from a project page).
 */
export default function Portfolio() {
  const [showTitleCard, setShowTitleCard] = useState(false);
  const { activeIndex, direction, goTo } = useSectionNavigation(SECTIONS.length, showTitleCard);
  // Play the Work Library title card the instant navigation enters a Work
  // section from outside it. Decided during render (not in an effect) so the
  // card mounts in the same commit as the section — there is no frame where
  // the project shows before the card has covered it.
  // @mobile only — @desktop has no title-card transition (boundary is `md`, 768px).
  const [prevIndex, setPrevIndex] = useState(activeIndex);
  if (activeIndex !== prevIndex) {
    setPrevIndex(activeIndex);
    if (
      isWorkIndex(activeIndex) &&
      !isWorkIndex(prevIndex) &&
      !window.matchMedia("(min-width: 768px)").matches
    ) {
      setShowTitleCard(true);
    }
  }

  // Returning from a project page replays the Work Library title card.
  useEffect(() => {
    let replay = false;
    try {
      replay = sessionStorage.getItem("replayWorkTitleCard") === "1";
      if (replay) sessionStorage.removeItem("replayWorkTitleCard");
    } catch {
      /* sessionStorage unavailable — skip the replay */
    }
    if (replay) goTo(FIRST_WORK_INDEX);
  }, [goTo]);

  const dismissTitleCard = useCallback(() => setShowTitleCard(false), []);

  return (
    <main className="fixed inset-0 overflow-hidden bg-white">
      <div className="relative mx-auto h-full w-full max-w-[1080px]">
        <SectionStage activeIndex={activeIndex} direction={direction}>
          {SECTION_VIEWS[activeIndex]}
        </SectionStage>
        <DotNav count={SECTIONS.length} activeIndex={activeIndex} onSelect={goTo} />
        <FloatingIsland
          activeKey={isWorkIndex(activeIndex) ? "work" : null}
          onWorkLibrary={() => goTo(FIRST_WORK_INDEX)}
        />
        {showTitleCard && <WorkLibraryTitleCard onComplete={dismissTitleCard} />}
      </div>
    </main>
  );
}
