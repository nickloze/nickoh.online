"use client";

/* Selected work (#projects) — full-width case-study cards.
   The image slot is independent of the clickable meta block: clicking the meta
   opens the slide-over, while hover effects are pure CSS (see the <style> below)
   so hovering never re-renders the card and never re-touches the image.
   Ported from project/projects-stack.jsx. */

import type { CSSProperties } from "react";
import { Icon } from "./ui/icons";
import RuleHeader from "./ui/RuleHeader";
import SlotImage from "./ui/SlotImage";
import type { Project } from "../lib/data";

function ProjectCard({
  project: p,
  onClick,
  isMobile,
}: {
  project: Project;
  onClick: () => void;
  isMobile: boolean;
}) {
  return (
    <div
      className="pcard"
      style={
        {
          "--card-accent": p.accent,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 16,
          background: "#0A0A0A",
          border: "1px solid var(--border-section)",
          borderRadius: 8,
          transition: "border-color 200ms ease, background 200ms ease, box-shadow 200ms ease",
          borderColor: "rgb(24, 24, 27)",
        } as CSSProperties
      }
    >
      {/* image area — aspect-locked 16/9 so framing is identical at every width */}
      <div style={{ overflow: "hidden", borderRadius: 8, width: "100%", margin: "0 auto", aspectRatio: "16 / 9" }}>
        <div
          className="pcard-zoom"
          style={{
            width: "100%",
            height: "100%",
            transformOrigin: "center",
            transition: "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <SlotImage
            slotId={p.slot}
            alt={`${p.name} — ${p.subtitle}`}
            fit="contain"
            sizes="(max-width: 880px) 92vw, 1024px"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>

      {/* clickable meta block → opens case study */}
      <button
        onClick={onClick}
        aria-label={`open ${p.name} case study`}
        style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left", width: "100%", cursor: "pointer" }}
      >
        {/* eyebrow + name row */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 10, color: "var(--zinc-600)", letterSpacing: "0.02em" }}>{p.eyebrow}</span>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "baseline",
              gap: isMobile ? 2 : 8,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 500, color: "var(--zinc-100)", lineHeight: 1.3 }}>{p.name}</span>
            <span style={{ fontSize: 20, fontWeight: 500, color: "var(--zinc-400)", lineHeight: 1.3 }}>
              {p.subtitle}
            </span>
          </div>
        </div>

        {/* description */}
        <p
          style={{
            margin: 0,
            fontSize: isMobile ? 15 : 19,
            fontWeight: 400,
            color: "var(--zinc-300)",
            lineHeight: 1.32,
            letterSpacing: "-0.01em",
            textWrap: "pretty",
          }}
        >
          {p.tagline}
        </p>

        {/* tags + year */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, paddingTop: 12 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {p.tags.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 10,
                  color: "var(--zinc-500)",
                  padding: "2px 6px",
                  background: "var(--zinc-950)",
                  border: "1px solid var(--border-section)",
                  borderRadius: 4,
                  whiteSpace: "nowrap",
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <span
            className="tabular pcard-year"
            style={{
              fontSize: 10,
              color: "var(--zinc-600)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "color 200ms ease",
              flexShrink: 0,
            }}
          >
            {p.year}
            <Icon.ChevronRight size={11} className="pcard-chev" style={{ transition: "transform 200ms ease" }} />
          </span>
        </div>
      </button>
    </div>
  );
}

const PCARD_CSS = `
.pcard { border-color: var(--border-section); }
.pcard:hover {
  border-color: rgba(255,255,255,0.18);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.05), 0 0 12px -7px rgba(255,255,255,0.12);
}
.pcard .pcard-zoom { transform: scale(1); }
.pcard:hover .pcard-zoom { transform: scale(1.02); }
.pcard:hover .pcard-year { color: var(--card-accent); }
.pcard .pcard-chev { transform: translateX(0); }
.pcard:hover .pcard-chev { transform: translateX(1px); }
`;

export default function ProjectsStack({
  projects,
  onSelect,
  isMobile,
}: {
  projects: Project[];
  onSelect: (p: Project) => void;
  isMobile: boolean;
}) {
  return (
    <section
      id="projects"
      style={{
        borderBottom: "1px solid var(--border-section)",
        fontFamily: "var(--sans)",
        padding: isMobile ? "32px 20px" : "32px",
      }}
    >
      <RuleHeader label="selected work" />

      <style>{PCARD_CSS}</style>

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} onClick={() => onSelect(p)} isMobile={isMobile} />
        ))}
      </div>
    </section>
  );
}
