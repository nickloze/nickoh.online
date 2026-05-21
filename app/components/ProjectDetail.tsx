"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PROJECT_TABS, type ProjectTab, type WorkProject } from "../lib/sections";
import FloatingIsland from "./navigation/FloatingIsland";
import TagPill from "./ui/TagPill";

interface ProjectDetailProps {
  project: WorkProject;
}

/**
 * A project detail page (Figma 275:4105 / 275:4224): a fixed top tab strip, a
 * hero image that fades on scroll, the project write-up, and the persistent
 * floating island. The island's Work Library icon returns to the deck and
 * replays the title card.
 */
export default function ProjectDetail({ project }: ProjectDetailProps) {
  const [tab, setTab] = useState<ProjectTab>("Overview");
  const router = useRouter();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 320], [1, 0]);

  const returnToDeck = () => {
    try {
      sessionStorage.setItem("replayWorkTitleCard", "1");
    } catch {
      /* sessionStorage unavailable — the deck just won't replay the card */
    }
    router.push("/");
  };

  const selectTab = (next: ProjectTab) => {
    setTab(next);
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  // Only the Overview tab has real copy; the others await content.
  const body = tab === "Overview" && project.overview ? project.overview : "{TODO: copy}";

  return (
    <main className="relative min-h-[100dvh] bg-white">
      <nav
        aria-label="Project sections"
        className="fixed inset-x-0 top-0 z-30 flex justify-center gap-3 bg-white pb-3 pt-[calc(env(safe-area-inset-top)+16px)]"
      >
        {PROJECT_TABS.map((name) => (
          <button
            key={name}
            type="button"
            aria-current={name === tab ? "true" : undefined}
            onClick={() => selectTab(name)}
            className={`rounded text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 ${
              name === tab ? "text-ink" : "text-muted"
            }`}
          >
            {name}
          </button>
        ))}
      </nav>

      <div className="flex flex-col items-center px-[34px] pb-[200px] pt-[calc(env(safe-area-inset-top)+64px)]">
        {project.hero && (
          <motion.div
            style={reduce ? undefined : { opacity: heroOpacity }}
            className="relative aspect-[2/3] w-full max-w-[300px] overflow-hidden"
          >
            <Image
              src={project.hero}
              alt={`${project.name} project preview`}
              fill
              priority
              sizes="300px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-b from-transparent to-white" />
          </motion.div>
        )}

        <article className="mt-[10px] flex w-full max-w-[257px] flex-col gap-7">
          <div className="flex flex-col gap-7">
            <header className="flex flex-col">
              <h1 className="fs-primary text-ink">{project.name}</h1>
              <p className="fs-primary text-muted">{project.subtitle}</p>
            </header>
            <p className="text-[20px] text-ink">{body}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {project.tags.map((label) => (
              <TagPill key={label} size="sm">
                {label}
              </TagPill>
            ))}
          </div>
        </article>
      </div>

      {/* Content fades out behind the island as it scrolls. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-[200px] bg-gradient-to-t from-white via-white to-transparent" />

      <FloatingIsland onWorkLibrary={returnToDeck} />
    </main>
  );
}
