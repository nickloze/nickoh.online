"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { projects } from "../../lib/data";
import { SCROLL_IDLE_MS } from "../../motion/feed";
import { useScrollRestore } from "../../hooks/useScrollRestore";
import ProjectCard from "./ProjectCard";

/* Figma 373:2675 "Works" (@desktop) / 373:2715 (@mobile): the only scrolling
   region on the page. Scrollbar hidden by Nic's call; the mobile frame adds a
   fade over the bottom of the window (441:365). While the feed is moving, the
   card nearest the middle of the window expands slightly. */
const WorkFeed = forwardRef<HTMLElement, { className?: string }>(function WorkFeed(
  { className = "" },
  ref,
) {
  const scroller = useRef<HTMLElement>(null);
  useImperativeHandle(ref, () => scroller.current as HTMLElement);
  useScrollRestore(scroller, "home");

  const [near, setNear] = useState<number | null>(null);
  const idle = useRef<number | undefined>(undefined);
  const raf = useRef(0);

  const onScroll = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const box = el.getBoundingClientRect();
      const mid = box.top + box.height / 2;
      let best = 0;
      let bestDist = Infinity;
      el.querySelectorAll<HTMLElement>("[data-card]").forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setNear(best);
    });
    window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => setNear(null), SCROLL_IDLE_MS);
  }, []);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      window.clearTimeout(idle.current);
    },
    [],
  );

  return (
    <div className={`relative min-h-0 ${className}`}>
      <section
        ref={scroller}
        role="region"
        aria-label="Work"
        tabIndex={0}
        onScroll={onScroll}
        className="scrollbar-hidden h-full overflow-y-auto overscroll-contain scroll-smooth outline-none focus-visible:ring-2 focus-visible:ring-fg/40"
      >
        <div className="flex flex-col items-end">
          {projects.map((p, i) => (
            <div key={p.slug} data-card className="w-full">
              <ProjectCard project={p} index={i} expanded={near === i} />
            </div>
          ))}
        </div>
      </section>
      {/* @mobile — 441:365, the fade over the bottom of the window */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[191px] [background-image:var(--gradient-feed-fade)] desktop:hidden"
      />
    </div>
  );
});

export default WorkFeed;
