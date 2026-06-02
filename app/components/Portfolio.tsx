"use client";

/* Root of the portfolio. Owns the frame (sidebar + scrolling main + slide-over),
   the viewport split, the active-section scroll-spy, and the global Escape /
   mobile-nav state. One responsive codebase — @desktop (≥880px) shows the fixed
   296px rail; @mobile (<880px) collapses it to a slide-in overlay with a top
   header bar. Ported from project/app.jsx (App). */

import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Hero from "./Hero";
import ProjectsStack from "./ProjectsStack";
import Stack from "./Stack";
import Contact from "./Contact";
import Slideover from "./Slideover";
import { Icon } from "./ui/icons";
import { projects, type Project } from "../lib/data";

/* Width-only viewport hook. Initialised to a desktop default so the server
   render and the first client render agree (no hydration mismatch); the real
   size lands in the mount effect. The @mobile/@desktop boundary is 880px. */
function useViewport() {
  const [size, setSize] = useState({ w: 1440, h: 900 });
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

export default function Portfolio() {
  const { w } = useViewport();
  const isMobile = w < 880;

  const [active, setActive] = useState("about");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  /* esc closes the slide-over first, then the mobile sidebar */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedProject) setSelectedProject(null);
        else if (mobileSidebarOpen) setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProject, mobileSidebarOpen]);

  /* scroll-spy — highlight the nav item for whichever section brackets the
     scroll position (+120px so the change fires once a section is well in view) */
  useEffect(() => {
    const ref = mainRef.current;
    if (!ref) return;
    let raf = 0;
    const sections = ["about", "projects", "stack", "contact"];
    const compute = () => {
      raf = 0;
      const scrollPos = ref.scrollTop + 120;
      for (const s of sections) {
        const el = document.getElementById(s);
        if (!el) continue;
        if (el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight > scrollPos) {
          setActive(s);
          break;
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    ref.addEventListener("scroll", onScroll, { passive: true });
    compute();
    return () => {
      ref.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const scrollTo = useCallback((id: string) => {
    setActive(id); // optimistic: move the highlight before the scroll settles
    const el = document.getElementById(id);
    if (el && mainRef.current) {
      mainRef.current.scrollTo({ top: el.offsetTop - 24, behavior: "smooth" });
    }
  }, []);

  /* close the mobile sidebar when a project opens */
  useEffect(() => {
    if (selectedProject) setMobileSidebarOpen(false);
  }, [selectedProject]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-black)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {isMobile && !selectedProject && (
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 12px",
            // @mobile — clear the Dynamic Island / status bar safe area
            paddingTop: "env(safe-area-inset-top)",
            height: "calc(52px + env(safe-area-inset-top))",
            flexShrink: 0,
            background: "var(--bg-panel)",
            borderBottom: "1px solid var(--border-default)",
            zIndex: 50,
            borderRadius: "0px 0px 12px 12px",
          }}
        >
          <button
            onClick={() => setMobileSidebarOpen((o) => !o)}
            aria-label="open navigation"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              flexShrink: 0,
              color: "var(--zinc-300)",
              background: "var(--bg-raised)",
              border: "1px solid var(--border-default)",
              borderRadius: "50%",
            }}
          >
            <Icon.Menu size={16} />
          </button>
          <span
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--zinc-100)",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Nicholas Koh&apos;s Online Home
          </span>
          {/* spacer to keep the title centered against the menu button */}
          <span style={{ width: 36, flexShrink: 0 }} />
        </header>
      )}

      <div style={{ display: "flex", flex: 1, minHeight: 0, position: "relative" }}>
        {/* mobile sidebar backdrop — kept mounted so it can fade out */}
        {isMobile && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 55,
              opacity: mobileSidebarOpen ? 1 : 0,
              pointerEvents: mobileSidebarOpen ? "auto" : "none",
              transition: "opacity 320ms cubic-bezier(0.32, 0.72, 0.24, 1)",
            }}
          />
        )}

        <Sidebar
          active={active}
          onNav={scrollTo}
          isMobile={isMobile}
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <main
          ref={mainRef}
          className="scroll-thin"
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: "auto",
            background: "var(--bg-black)",
            // @mobile — keep content clear of the home indicator
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <Hero isMobile={isMobile} />
          {/* Experience held back for now — restore by un-commenting:
              <Experience isMobile={isMobile} /> */}
          <ProjectsStack projects={projects} onSelect={setSelectedProject} isMobile={isMobile} />
          <Stack isMobile={isMobile} />
          <Contact isMobile={isMobile} />
        </main>

        <Slideover project={selectedProject} onClose={() => setSelectedProject(null)} isMobile={isMobile} />
      </div>
    </div>
  );
}
