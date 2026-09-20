"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, type Variants } from "motion/react";
import type { Project } from "../../lib/projects";
import {
  CLOSE_MORPH_MAX_SCROLL,
  CLOSE_MORPH_MIN_VISIBLE,
  CROSSFADE,
  DETAILS_IN,
  DETAILS_OUT,
} from "../../motion/project";
import { COMMIT_LIFT, COMMIT_RISE } from "../../motion/next";
import { DESKTOP_QUERY, useMediaQuery } from "../../hooks/useMediaQuery";
import { useVideoPlayback } from "../../hooks/useVideoPlayback";
import { useProject, type ExitMode } from "../ProjectContext";
import Cover from "../media/Cover";
import Blocks from "./Blocks";
import Narrative from "./Narrative";
import NextProject from "./NextProject";
import ProjectHeader from "./ProjectHeader";

/* A project page — Figma 672:3003 (Refine), 567:780 (Petch), 605:1398 (SOS),
   615:2321 (Shopping AI). One adaptive layer:

   @desktop  sits exactly over the feed's column (995 wide at 1512), with the
             panel still on its left; the column scrolls on its own. Its first
             screen is fitted to the column: cover, 58, then the title block
             (~247) end exactly at the column's bottom edge — the frame's
             bottom padding line, 918 of the 982 Figma frame — so a shorter
             viewport shrinks the cover (cropped evenly, never below 240) and
             a taller one leaves it at 550. The story follows on scroll.
   @mobile   takes the whole screen (the folder slides away) at the same
             36 / 35 margins as the feed.
   @mobile (tablet) — the same, at the shared 40px margins.

   How it arrives depends on how it was reached (ProjectContext):
     from its card   the cover flies up from the card and the details fade up
                     beneath it as it lands
     prev / next     the whole layer crossfades
     the next card   the same crossfade, with the outgoing layer sliding up
                     and the arriving one rising from below
     a direct link   it is simply there

   How it leaves is decided when the close begins (`closeMode`): the details
   drop out fast and the cover flies home, or — scrolled deep, or after
   prev / next — the whole layer fades. */

type Entrance = "fly" | "fade" | "none";

/* `pushed` is the entrance after the next-project card is pressed: the
   arriving page rises from below as the outgoing one slides up, so the click
   reads as having pushed this page up into place. The arrow keys keep the
   flat crossfade. Both ys are transforms, so MotionConfig reducedMotion="user"
   drops them on its own and the crossfade survives — the honest degradation.
   Adding y: 0 to `shown` and `hidden` is inert for every existing path: fly
   and deeplink both pass initial={false}. */
const layer: Variants = {
  hidden: { opacity: 0, y: 0 },
  pushed: { opacity: 0, y: COMMIT_RISE },
  shown: { opacity: 1, y: 0, transition: CROSSFADE.in },
  gone: (mode: ExitMode) =>
    mode === "morph"
      ? { opacity: 0, transition: { ...CROSSFADE.out, delay: DETAILS_OUT.duration } }
      : mode === "handoff"
        ? { opacity: 0, y: -COMMIT_LIFT, transition: CROSSFADE.out }
        : { opacity: 0, transition: CROSSFADE.out },
};

const section: Variants = {
  hidden: { opacity: 0, y: DETAILS_IN.y },
  shown: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DETAILS_IN.duration,
      delay: DETAILS_IN.delay + i * DETAILS_IN.stagger,
      ease: DETAILS_IN.ease,
    },
  }),
  gone: { opacity: 0, transition: DETAILS_OUT },
};

export default function ProjectView({ project }: { project: Project }) {
  const s = useProject();
  const { slug } = project;

  /* Fixed at mount: whether this page's cover is the one flying, and with
     which generation of layoutIds. */
  const [fly] = useState(() => s.morph === slug);
  const [gen] = useState(() => s.gen);
  const [entrance] = useState<Entrance>(() =>
    s.origin === "deeplink" ? "none" : fly ? "fly" : "fade",
  );
  const [pushed] = useState(() => s.origin === "handoff");

  const scroller = useRef<HTMLElement>(null);
  const firstScreen = useRef<HTMLDivElement>(null);
  const coverBox = useRef<HTMLDivElement>(null);
  const headBox = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const { projectRef, setCoverVisible } = s;

  /* This is the scroller the panel's wheel and the keyboard now drive. */
  useLayoutEffect(() => {
    const el = scroller.current;
    projectRef.current = el;
    return () => {
      if (projectRef.current === el) projectRef.current = null;
    };
  }, [projectRef]);

  /* Focus lands on the title when a card opens it. Prev / next leave focus on
     the control that was used; a direct load leaves it alone. */
  useEffect(() => {
    if (entrance !== "fly") return;
    const id = requestAnimationFrame(() => title.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  }, [entrance]);

  /* @desktop — the first screen may be as short as the column, but no shorter
     than the cover at its floor plus the title block: below that it grows (and
     the page scrolls) instead of letting the title block spill into the
     story's margin. The title block wraps at narrow widths, so it is measured;
     the cover is watched too, so the floor is re-read when the tier changes. */
  useLayoutEffect(() => {
    const box = firstScreen.current;
    const cover = coverBox.current;
    const head = headBox.current;
    if (!box || !cover || !head) return;
    const sync = () => {
      const floor = parseFloat(getComputedStyle(cover).minHeight) || 0;
      const gap = head.offsetTop - cover.offsetTop - cover.offsetHeight;
      box.style.setProperty("--first-min", `${floor + gap + head.offsetHeight}px`);
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(head);
    observer.observe(cover);
    return () => observer.disconnect();
  }, []);

  const onScroll = useCallback(() => {
    const el = scroller.current;
    const cover = coverBox.current;
    if (!el || !cover || projectRef.current !== el) return;
    // @desktop — the cover can be shorter than 550, so follow its real height
    // @mobile (and tablet) — the fixed distance they have always had
    const limit = desktop ? cover.offsetHeight - CLOSE_MORPH_MIN_VISIBLE : CLOSE_MORPH_MAX_SCROLL;
    setCoverVisible(el.scrollTop < limit);
  }, [desktop, projectRef, setCoverVisible]);

  useVideoPlayback(scroller, { enabled: true });

  const detailsFrom = entrance === "fly" ? "hidden" : false;

  return (
    <motion.section
      ref={scroller}
      layoutScroll
      tabIndex={0}
      aria-label={`${project.card.client} — project`}
      onScroll={onScroll}
      variants={layer}
      initial={entrance === "fade" ? (pushed ? "pushed" : "hidden") : false}
      animate="shown"
      exit="gone"
      className={[
        "scrollbar-hidden overflow-y-auto overscroll-contain outline-none",
        // @mobile — the whole screen, clear of the status bar and bottom bar
        "fixed inset-0 z-20 pt-[max(8px,env(safe-area-inset-top))] pr-[var(--spacing-mobile-right)] pb-[calc(var(--spacing-mobile-bottom)+env(safe-area-inset-bottom))] pl-[var(--spacing-mobile-left)]",
        // @mobile (tablet)
        "tablet:px-[var(--spacing-tablet-side)] tablet:pt-[var(--spacing-tablet-side)]",
        // @desktop — exactly over the feed column, and a size container so the
        // first screen below can be as tall as the column (100cqh)
        "desktop:absolute desktop:z-auto desktop:p-0 desktop:pb-0 desktop:[container-type:size]",
      ].join(" ")}
    >
      {/* No trailing padding: the next-project panel is the last thing in
            the column and its bottom edge is the column's, so every story ends
            on the frame's bottom padding line — @desktop, level with
            "Available for Work" in the panel beside it. */}
      <div className="flex flex-col">
        {/* The first screen: the cover and the title block. @desktop it is
            never taller than the column, so the cover — the only part that
            can give — takes exactly the height the title block leaves, down
            to 240; when the column is taller it stays at its natural 550. If
            the column is too short even for that, the screen grows to hold
            the floor and the title block (--first-min, measured above). */}
        <div
          ref={firstScreen}
          className="flex flex-col desktop:max-h-[100cqh] desktop:min-h-[var(--first-min,0px)]"
        >
          <div
            ref={coverBox}
            data-play-group=""
            className="relative w-full [aspect-ratio:995/550] desktop:min-h-[240px]"
          >
            <Cover
              project={project}
              variant="page"
              gen={gen}
              fly={fly}
              priority
              sizes="(min-width: 64rem) 995px, (min-width: 48rem) calc(100vw - 80px), calc(100vw - 71px)"
            />
          </div>

          {/* Each section names its own initial / animate / exit: a child that
              sets its own initial label stops inheriting its parent's. */}
          <motion.div
            ref={headBox}
            className="mt-[24px] shrink-0 tablet:mt-[58px]"
            variants={section}
            custom={0}
            initial={detailsFrom}
            animate="shown"
            exit="gone"
          >
            <ProjectHeader project={project} titleRef={title} />
          </motion.div>
        </div>

        <motion.div
          className="mt-[64px] tablet:mt-[140px]"
          variants={section}
          custom={1}
          initial={detailsFrom}
          animate="shown"
          exit="gone"
        >
          <Narrative project={project} />
        </motion.div>

        <motion.div
          className="mt-[64px] tablet:mt-[140px]"
          variants={section}
          custom={2}
          initial={detailsFrom}
          animate="shown"
          exit="gone"
        >
          <Blocks blocks={project.page.blocks} />
        </motion.div>

        {/* The story ends on the next project. */}
        <motion.div
          className="mt-[64px] tablet:mt-[140px]"
          variants={section}
          custom={3}
          initial={detailsFrom}
          animate="shown"
          exit="gone"
        >
          <NextProject project={project} />
        </motion.div>
      </div>
    </motion.section>
  );
}
