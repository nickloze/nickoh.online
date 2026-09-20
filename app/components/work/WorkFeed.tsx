"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "motion/react";
import { projects } from "../../lib/projects";
import { EXPAND_ROOM, FADE_RETREAT, SCROLL_IDLE_MS } from "../../motion/feed";
import { useScrollRestore } from "../../hooks/useScrollRestore";
import { useVideoPlayback } from "../../hooks/useVideoPlayback";
import { useProject } from "../ProjectContext";
import ProjectCard from "./ProjectCard";

/* Figma 373:2675 "Works" (@desktop) / 503:4535 (@mobile): the scrolling feed.
   Scrollbar hidden by Nic's call; the @mobile frame lays a fade over the
   bottom of the window (503:4536). While the feed is moving, the card nearest
   the middle expands slightly; the card under the reading line plays its
   video (useVideoPlayback).

   It never unmounts. While a project is open it is frozen (overflow hidden,
   so its scroll position is kept exactly), inert and dissolved around the
   opened card's empty slot — so closing lands the reader where they were. */
export default function WorkFeed() {
  const { open, origin, feedRef } = useProject();
  const scroller = useRef<HTMLElement>(null);
  useScrollRestore(scroller, "home");
  useVideoPlayback(scroller, { enabled: open === null });

  const setScroller = useCallback(
    (el: HTMLElement | null) => {
      scroller.current = el;
      feedRef.current = el;
    },
    [feedRef],
  );

  /* A project reached without its card (a link, prev / next): park the
     hidden feed on that card, so closing lands on it — upper part of the
     window, clear of the @mobile fade. Only the feed moves; scrollIntoView
     would also nudge the page. */
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el || !open || origin === "feed") return;
    const card = el.querySelector<HTMLElement>(`[data-card="${open}"]`);
    if (!card) return;
    /* the section is the cards' offsetParent, so offsetTop is in scroll
       coordinates */
    const room = el.clientHeight - card.offsetHeight;
    const top = card.offsetTop - Math.max(0, Math.min(room / 2, room * 0.25 + 24));
    el.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  }, [open, origin]);

  /* Closing hands focus back to the card that was open. */
  const lastOpen = useRef(open);
  useEffect(() => {
    const was = lastOpen.current;
    lastOpen.current = open;
    if (open || !was) return;
    scroller.current
      ?.querySelector<HTMLElement>(`[data-card="${was}"] a`)
      ?.focus({ preventScroll: true });
  }, [open]);

  const [near, setNear] = useState<number | null>(null);
  const idle = useRef<number | undefined>(undefined);
  const raf = useRef(0);

  /* @mobile — how much of the fade is showing. A motion value rather than
     state: it is written on every scroll frame, and the four cards have no
     reason to re-render for it. */
  const fade = useMotionValue(0);
  const syncFade = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const below = el.scrollHeight - el.clientHeight - el.scrollTop;
    fade.set(Math.max(0, Math.min(1, below / FADE_RETREAT)));
  }, [fade]);

  /* After the restored scroll position is in (useScrollRestore runs its
     layout effect first), and again whenever the window changes size or a
     project hands the feed back. */
  useLayoutEffect(syncFade, [syncFade, open]);
  useEffect(() => {
    window.addEventListener("resize", syncFade);
    return () => window.removeEventListener("resize", syncFade);
  }, [syncFade]);

  const onScroll = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    syncFade();
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
  }, [syncFade]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      window.clearTimeout(idle.current);
    },
    [],
  );

  const frozen = open !== null;

  return (
    <>
      <motion.section
        ref={setScroller}
        layoutScroll
        role="region"
        aria-label="Work"
        tabIndex={frozen ? -1 : 0}
        inert={frozen}
        onScroll={frozen ? undefined : onScroll}
        className={`scrollbar-hidden relative overscroll-contain scroll-smooth outline-none focus-visible:ring-2 focus-visible:ring-fg/40 ${
          frozen ? "overflow-hidden" : "overflow-y-auto"
        }`}
        /* Room for the hover / scroll expansion so the scroller's clip never
           cuts the cover's rounded corners (see EXPAND_ROOM). The column, and
           the scroller's bottom edge, stay exactly where they were.

           The feed keeps no room below its last card: the fade gets out of
           its way instead (FADE_RETREAT), so the scroll ends on the card
           rather than on a gap held open under a band. */
        style={{
          marginInline: -EXPAND_ROOM.x,
          paddingInline: EXPAND_ROOM.x,
          marginTop: -EXPAND_ROOM.y,
          paddingTop: EXPAND_ROOM.y,
          height: `calc(100% + ${EXPAND_ROOM.y}px)`,
        }}
      >
        <div className="flex flex-col items-end">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} expanded={!frozen && near === i} />
          ))}
        </div>
      </motion.section>
      {/* @mobile — 503:4536, the fade over the bottom of the window. Full
          bleed rather than fitted to the column: a card expanding grows past
          the column by EXPAND_ROOM, and a fade that stopped at the column's
          edge cut a hard line down either side of it exactly while it zoomed.
          At the foot it reaches on past the feed, under the folder (which is
          z-10 above it), to the bottom of the screen — hung off this box
          rather than position:fixed, which on iOS resolves against the large
          viewport and would slide the band out of step with the h-dvh frame
          as the URL bar comes and goes. The band's own stops are in px, so it
          still fades out where it always did, just above the feed's clip. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute [background-image:var(--gradient-feed-fade)] tablet:hidden"
        style={{
          left: "calc(-1 * var(--spacing-mobile-left))",
          right: "calc(-1 * var(--spacing-mobile-right))",
          bottom: "calc(-1 * var(--height-feed-foot))",
          height: "var(--height-feed-fade)",
          opacity: fade,
        }}
      />
    </>
  );
}
