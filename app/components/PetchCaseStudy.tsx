"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PROJECT_TABS } from "../lib/sections";
import FloatingIsland from "./navigation/FloatingIsland";
import OutcomeScreen from "./sections/petch/OutcomeScreen";
import OverviewScreen from "./sections/petch/OverviewScreen";
import ResearchScreen from "./sections/petch/ResearchScreen";
import SolutionScreen from "./sections/petch/SolutionScreen";

/** The four case study screens, indexed to match PROJECT_TABS. */
const SCREENS = [OverviewScreen, ResearchScreen, SolutionScreen, OutcomeScreen];

/**
 * @mobile — the Petch case study: a paginated deck of four full-page screens
 * (Overview → Research → Solution → Outcome). Each screen fills the viewport
 * and snaps into place; one swipe up advances one screen. The tab strip mirrors
 * the active screen and jumps to one when tapped, and the floating island's
 * Work Library icon returns to the home deck (replaying its title card).
 */
export default function PetchCaseStudy() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const router = useRouter();

  // Highlight the tab for whichever screen is crossing the viewport's middle.
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = sectionRefs.current.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActiveIndex(index);
        }
      },
      { root, rootMargin: "-50% 0px -50% 0px" },
    );
    for (const section of sectionRefs.current) {
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  // Snap directly to a screen. An instant jump — a smooth programmatic scroll
  // is unreliable against `scroll-snap-stop: always` on the sections.
  const goToScreen = useCallback((index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "instant", block: "start" });
  }, []);

  const returnToDeck = useCallback(() => {
    try {
      sessionStorage.setItem("replayWorkTitleCard", "1");
    } catch {
      /* sessionStorage unavailable — the deck just won't replay the card */
    }
    router.push("/");
  }, [router]);

  return (
    <main className="petch-case-study fixed inset-0 bg-white">
      <div
        ref={scrollRef}
        className="no-scrollbar h-full snap-y snap-mandatory overflow-y-scroll overscroll-contain"
      >
        {SCREENS.map((Screen, index) => (
          <section
            key={PROJECT_TABS[index]}
            ref={(element) => {
              sectionRefs.current[index] = element;
            }}
            aria-label={`${PROJECT_TABS[index]} — Petch case study`}
            className="relative flex h-full w-full snap-start snap-always flex-col items-center overflow-hidden"
          >
            <Screen />
          </section>
        ))}
      </div>

      {/* @mobile — section tab strip, pinned above the snapping screens. */}
      <nav
        aria-label="Petch case study sections"
        className="absolute inset-x-0 top-0 z-30 flex justify-center gap-3 bg-white pb-3 pt-[calc(env(safe-area-inset-top)+16px)]"
      >
        {PROJECT_TABS.map((name, index) => (
          <button
            key={name}
            type="button"
            onClick={() => goToScreen(index)}
            aria-current={index === activeIndex ? "true" : undefined}
            className={`rounded text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 ${
              index === activeIndex ? "text-ink" : "text-muted"
            }`}
          >
            {name}
          </button>
        ))}
      </nav>

      <FloatingIsland onWorkLibrary={returnToDeck} />
    </main>
  );
}
