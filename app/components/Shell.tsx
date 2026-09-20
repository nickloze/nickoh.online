"use client";

import { useCallback, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { projectBySlug } from "../lib/projects";
import { useProjectKeys } from "../hooks/useProjectKeys";
import { useWheelForward } from "../hooks/useWheelForward";
import Panel from "./panel/Panel";
import ProjectView from "./project/ProjectView";
import { ProjectProvider, useProject } from "./ProjectContext";
import WorkFeed from "./work/WorkFeed";

/* One DOM tree, three tiers — the "shared adaptive layout" case. It lives in
   the (site) layout, so it stays mounted across `/` and `/work/<slug>`: the
   folder keeps its tab, the feed keeps its scroll, and a project opens over
   the feed rather than replacing the page.

   @desktop  Figma 373:2659 — 64 padding, 24 gap, panel 365.4 | feed 995 at
             1512. An open project sits exactly over the feed's column; the
             panel stays exactly as it is.
   @mobile   Figma 441:243 — 36 / 35 side padding, the feed window on top and
             the folder under it, 13 above the browser bar. An open project
             takes the whole screen.
   @mobile (tablet) — the @mobile layout at 40px margins, desktop sizes.

   The document itself never scrolls (globals.css); a wheel over the panel is
   forwarded to whichever scroller is showing. */
export default function Shell() {
  return (
    <ProjectProvider>
      <Frame />
    </ProjectProvider>
  );
}

function Frame() {
  const { open, closeMode, close, go, feedRef, projectRef } = useProject();
  const project = projectBySlug(open ?? undefined);

  const panel = useRef<HTMLElement>(null);
  const active = useCallback(() => projectRef.current ?? feedRef.current, [projectRef, feedRef]);
  useWheelForward(panel, active);
  useProjectKeys(open, { close, go });

  return (
    <main
      className={[
        "grid h-dvh bg-bg text-fg gap-col-gap",
        // @mobile
        "grid-rows-[minmax(0,1fr)_auto] [grid-template-areas:'feed'_'panel']",
        "pt-[max(8px,env(safe-area-inset-top))] pr-[var(--spacing-mobile-right)] pb-[calc(var(--spacing-mobile-bottom)+env(safe-area-inset-bottom))] pl-[var(--spacing-mobile-left)]",
        // @mobile (tablet)
        "tablet:px-[var(--spacing-tablet-side)] tablet:pt-[var(--spacing-tablet-side)] tablet:pb-[calc(var(--spacing-tablet-side)+env(safe-area-inset-bottom))]",
        // @desktop
        "desktop:grid-cols-[var(--width-panel)_minmax(0,1fr)] desktop:grid-rows-[minmax(0,1fr)] desktop:[grid-template-areas:'panel_feed']",
        "desktop:p-frame",
      ].join(" ")}
    >
      <Panel ref={panel} className="[grid-area:panel] min-h-0" />

      <div className="relative min-h-0 [grid-area:feed]">
        <WorkFeed />
        {/* stays in the default "sync" mode: the arriving layer has to be
            painting before the leaving one is gone, or the column blinks */}
        <AnimatePresence custom={closeMode}>
          {project ? <ProjectView key={project.slug} project={project} /> : null}
        </AnimatePresence>
      </div>
    </main>
  );
}
