"use client";

/* Project case-study slide-over panel.
   Hero image → title stack → context/year + practice chips → problem / approach
   / scenario → image gallery → footer. Always mounted; visibility is driven by
   translateX so the open/close animation runs both ways, and the last project
   stays rendered through the close animation so the panel doesn't blank out.
   Ported from project/slideover.jsx. */

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Icon } from "./ui/icons";
import SlotImage from "./ui/SlotImage";
import type { Project } from "../lib/data";

/* section eyebrow label (problem / approach / practice / scenario) */
function SectionLabel({ children, color = "var(--zinc-500)" }: { children: ReactNode; color?: string }) {
  return (
    <span style={{ color, letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1.3, fontSize: 12 }}>
      {children}
    </span>
  );
}

/* context / year metadata column */
function MetaCol({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontSize: 10, color: "var(--zinc-600)", letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1.3 }}>
        {label}
      </span>
      <span style={{ fontSize: 12, color: "var(--zinc-300)", lineHeight: 1.35 }}>{value}</span>
    </div>
  );
}

/* problem / approach narrative block */
function NarrativeBlock({ label, body }: { label: string; body: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <SectionLabel>{label}</SectionLabel>
      <p style={{ margin: 0, color: "var(--zinc-300)", lineHeight: 1.7, maxWidth: 800, fontSize: 16 }}>{body}</p>
    </div>
  );
}

/* a drop-target image tile (now a static image). Sizing modes:
   • aspect + height → height drives size, width follows the ratio, centered
   • aspect only     → ratio locked, width-driven
   • neither         → plain fixed height, full width */
function ImageTile({
  slotId,
  alt,
  isMobile,
  grow,
  height,
  aspect,
  fit,
  sizes = "(max-width: 880px) 100vw, 1000px",
}: {
  slotId: string;
  alt: string;
  isMobile: boolean;
  grow?: boolean;
  height?: number;
  aspect?: string;
  fit?: "cover" | "contain";
  sizes?: string;
}) {
  const h = height != null ? height : isMobile ? 220 : 350;
  const sizing: CSSProperties =
    aspect && height != null
      ? { height: h, aspectRatio: aspect, width: "auto", maxWidth: "100%", margin: "0 auto" }
      : aspect
        ? { width: "100%", aspectRatio: aspect, height: "auto" }
        : { width: "100%", height: h };

  return (
    <SlotImage
      slotId={slotId}
      alt={alt}
      fit={fit || "cover"}
      sizes={sizes}
      style={{ display: "block", flex: grow ? "1 1 0" : undefined, minWidth: 0, ...sizing }}
    />
  );
}

/* text-left / image-right row (AcrossChat gallery layout); imageLeft flips it */
function GalleryRow({
  slotId,
  alt,
  text,
  isMobile,
  imageLeft,
}: {
  slotId: string;
  alt: string;
  text: string;
  isMobile: boolean;
  imageLeft?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column-reverse" : imageLeft ? "row-reverse" : "row",
        gap: isMobile ? 14 : 46,
        alignItems: isMobile ? "stretch" : "center",
      }}
    >
      <p style={{ flex: 1, minWidth: 0, margin: 0, lineHeight: 1.6, textWrap: "pretty", color: "rgb(255, 255, 255)", fontSize: 16 }}>
        {text}
      </p>
      <SlotImage
        slotId={slotId}
        alt={alt}
        fit="cover"
        sizes="(max-width: 880px) 92vw, 413px"
        style={{ display: "block", flexShrink: 0, width: isMobile ? "100%" : 413, height: 450 }}
      />
    </div>
  );
}

export default function Slideover({
  project,
  onClose,
  isMobile,
}: {
  project: Project | null;
  onClose: () => void;
  isMobile: boolean;
}) {
  const open = !!project;

  /* keep the last-shown project around during the close anim so it doesn't blank */
  const [shown, setShown] = useState<Project | null>(project);
  useEffect(() => {
    if (project) {
      setShown(project);
    } else {
      const t = setTimeout(() => setShown(null), 460);
      return () => clearTimeout(t);
    }
  }, [project]);

  const p = shown;
  const PAD = isMobile ? "24px 26px 56px" : "24px 40px 48px";

  return (
    <>
      {/* dim overlay */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          opacity: open ? 0.7 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 300ms ease",
          zIndex: 40,
        }}
      />

      {/* panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={p ? `${p.name} case study` : "project case study"}
        style={{
          position: "absolute",
          top: 0,
          left: isMobile ? 0 : 296,
          right: 0,
          height: "100%",
          background: "var(--bg-slideover)",
          borderLeft: "1px solid var(--border-default)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 420ms cubic-bezier(0.32, 0.72, 0.24, 1)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--sans)",
        }}
      >
        {p && (
          <>
            {/* panel header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: isMobile ? "12px 16px" : "12px 24px",
                borderBottom: "1px solid var(--border-section)",
                background: "var(--bg-black)",
                flexShrink: 0,
              }}
            >
              <button
                onClick={onClose}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--zinc-400)" }}
                aria-label="back to portfolio"
              >
                <Icon.ArrowLeft size={14} />
                Back
              </button>
            </div>

            {/* scrollable body */}
            <div className="scroll-thin" style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", padding: PAD, gap: 40 }}>
                {/* ───── 1. HERO: image + title stack + metadata ───── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 28 : 40 }}>
                    <ImageTile slotId={p.slot} alt={`${p.name} cover`} isMobile={isMobile} aspect="16/9" fit="contain" />

                    {/* titles */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 672 }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <h1 style={{ margin: 0, fontSize: isMobile ? 34 : 44, fontWeight: 400, color: "var(--zinc-100)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
                          {p.name}
                        </h1>
                        <div style={{ color: "#FFFFFF", lineHeight: 1.65, fontSize: 20 }}>{p.heroSubtitle}</div>
                      </div>
                      <p style={{ margin: 0, color: "var(--zinc-400)", lineHeight: 1.65, letterSpacing: "-0.02em", fontSize: 16, maxWidth: 807, width: "100%" }}>
                        {p.heroBlurb}
                      </p>
                    </div>
                  </div>

                  {/* metadata rows */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        gap: 24,
                        padding: "20px 0",
                        borderBottom: "1px solid rgb(24, 24, 27)",
                      }}
                    >
                      <div style={{ width: isMobile ? "auto" : 240 }}>
                        <MetaCol label="context" value={p.context} />
                      </div>
                      <MetaCol label="year" value={p.detailYear || p.year} />
                    </div>

                    <div style={{ display: "flex", padding: "20px 0", borderBottom: "1px solid rgb(24, 24, 27)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <SectionLabel>practice</SectionLabel>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {(p.practice || []).map((c) => (
                            <span
                              key={c}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "6px 12px",
                                fontSize: 12,
                                color: "var(--zinc-300)",
                                background: "var(--zinc-950)",
                                border: "1px solid var(--border-section)",
                                borderRadius: 4,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ───── 2. NARRATIVE: problem / approach / scenario ───── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <NarrativeBlock label="problem" body={p.problem} />
                  <NarrativeBlock label="approach" body={p.approach} />

                  {p.scenarioText ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <SectionLabel>scenario</SectionLabel>
                      <p style={{ color: "var(--zinc-300)", lineHeight: 1.7, fontSize: 16, margin: 0, maxWidth: 842, textWrap: "pretty", width: "100%" }}>
                        {p.scenarioText}
                      </p>
                    </div>
                  ) : (
                    p.buildDetails &&
                    p.buildDetails.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <SectionLabel>scenario</SectionLabel>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {p.buildDetails.map((d, i) => (
                            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                              <span className="tabular" style={{ fontSize: 13, color: "var(--zinc-600)", letterSpacing: "0.05em", lineHeight: 1.3, flexShrink: 0 }}>
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span style={{ color: "var(--zinc-300)", lineHeight: 1.3, fontSize: 16 }}>{d}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* ───── 3. IMAGE GALLERY ───── */}
                {p.galleryRows && p.galleryRows.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 56 : 64 }}>
                    {p.galleryRows.map((row, i) => (
                      <div key={i} style={{ display: "contents" }}>
                        {isMobile && i > 0 && <div style={{ height: 1, background: "var(--border-section)", width: "100%" }} />}
                        <GalleryRow
                          slotId={`${p.slot}-${row.slot}`}
                          alt={`${p.name} screen ${i + 1}`}
                          text={row.text}
                          imageLeft={row.imageLeft}
                          isMobile={isMobile}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  p.gallery &&
                  p.gallery.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <ImageTile slotId={`${p.slot}-${p.gallery[0]}`} alt={`${p.name} screen 1`} isMobile={isMobile} aspect="16/9" fit="contain" />
                      {p.galleryMiddleSingle ? (
                        <ImageTile slotId={`${p.slot}-${p.gallery[1]}`} alt={`${p.name} screen 2`} isMobile={isMobile} aspect="16/9" fit="contain" />
                      ) : (
                        // grid (not flex grow): a 1fr track gives each square a
                        // definite width so aspect-ratio can derive its height.
                        // flex:1 1 0 collapsed these to 0px in the mobile column.
                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                          <ImageTile slotId={`${p.slot}-${p.gallery[1]}`} alt={`${p.name} screen 2`} isMobile={isMobile} aspect="1/1" fit="contain" sizes="(max-width: 880px) 92vw, 480px" />
                          <ImageTile slotId={`${p.slot}-${p.gallery[2]}`} alt={`${p.name} screen 3`} isMobile={isMobile} aspect="1/1" fit="contain" sizes="(max-width: 880px) 92vw, 480px" />
                        </div>
                      )}
                      <ImageTile slotId={`${p.slot}-${p.gallery[3]}`} alt={`${p.name} screen 4`} isMobile={isMobile} aspect="16/9" fit="contain" />
                    </div>
                  )
                )}

                {/* ───── 4. FOOTER ───── */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                    <span style={{ fontSize: 10, color: "#FFFFFF", whiteSpace: "nowrap" }}>{p.name}</span>
                    <span style={{ fontSize: 10, color: "var(--zinc-500)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.heroSubtitle}
                    </span>
                  </div>
                  <span className="tabular" style={{ fontSize: 10, color: "#FFFFFF", flexShrink: 0 }}>
                    {p.detailYear || p.year}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
