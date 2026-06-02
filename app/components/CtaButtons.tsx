"use client";

/* Contact CTA buttons — WhatsApp / Grab CV / Email.
   @desktop: full pills.
   @mobile:  icon-only circles that "peel" open into the full pill on first tap;
             a second tap on the open pill follows the href. Tapping outside
             collapses them all. Ported from project/cta-buttons.jsx. */

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";

type CtaVariant = "hero" | "contact";

type CtaDef = {
  label: string;
  href: string;
  key: string;
  external?: boolean;
  download?: boolean;
};

const CTA_BUTTONS: CtaDef[] = [
  { label: "Say hello on WhatsApp", href: "https://wa.me/6593362344", key: "whatsapp", external: true },
  { label: "Grab my CV", href: "/nicholas-koh-resume.pdf", key: "cv", download: true },
  { label: "Slide into my inbox", href: "mailto:nicklozekoh@gmail.com", key: "email" },
];

function CtaIcon({ k }: { k: string }) {
  if (k === "cv") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <polyline points="9 15 12 18 15 15" />
      </svg>
    );
  }
  if (k === "email") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }
  if (k === "whatsapp") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.42 5.83c0 4.54-3.7 8.24-8.25 8.24a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24Zm-3.2 4.3c-.15 0-.4.06-.6.29-.21.23-.8.78-.8 1.9 0 1.12.82 2.2.93 2.36.11.15 1.6 2.45 3.9 3.43.54.23.97.37 1.3.48.55.17 1.05.15 1.44.09.44-.07 1.35-.55 1.54-1.08.19-.53.19-.99.13-1.08-.05-.09-.2-.15-.43-.26-.23-.11-1.35-.67-1.56-.74-.21-.08-.36-.11-.51.11-.15.23-.59.74-.72.89-.13.15-.27.17-.5.06-.23-.12-.96-.36-1.83-1.13-.68-.6-1.13-1.35-1.27-1.58-.13-.23-.01-.35.1-.47.1-.1.23-.27.34-.4.11-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.5-1.25-.7-1.71-.18-.45-.37-.39-.5-.4-.13 0-.28-.01-.43-.01Z" />
      </svg>
    );
  }
  return null;
}

/* palettes keep each section's existing look */
const CTA_PALETTES: Record<CtaVariant, {
  bg: string; border: string; color: string;
  bgHover: string; borderHover: string; colorHover: string;
}> = {
  hero: {
    bg: "rgba(24,24,27,0.4)", border: "rgb(44,44,44)", color: "var(--zinc-200)",
    bgHover: "#1c1c20", borderHover: "var(--border-hover)", colorHover: "var(--zinc-100)",
  },
  contact: {
    bg: "#141414", border: "#18181B", color: "var(--zinc-300)",
    bgHover: "#1c1c20", borderHover: "var(--border-hover)", colorHover: "var(--zinc-100)",
  },
};

function CtaButton({
  b, isMobile, variant, expanded, onExpand,
}: {
  b: CtaDef;
  isMobile: boolean;
  variant: CtaVariant;
  expanded: boolean;
  onExpand: (key: string) => void;
}) {
  const p = CTA_PALETTES[variant] || CTA_PALETTES.hero;
  const collapsed = isMobile && !expanded;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    /* first tap on mobile peels this one open instead of navigating;
       a second tap on the open pill follows the href */
    if (isMobile && !expanded) {
      e.preventDefault();
      onExpand(b.key);
    }
  };

  return (
    <a
      href={b.href}
      target={b.external ? "_blank" : undefined}
      rel={b.external ? "noopener noreferrer" : undefined}
      download={b.download ? "" : undefined}
      onClick={handleClick}
      aria-label={collapsed ? b.label : undefined}
      aria-expanded={isMobile ? expanded : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        overflow: "hidden",
        whiteSpace: "nowrap",
        flexShrink: 0,
        color: p.color,
        background: p.bg,
        border: `1px solid ${p.border}`,
        borderRadius: isMobile ? 999 : 24,
        letterSpacing: "-0.01em",
        fontSize: 16,
        height: isMobile ? 52 : "auto",
        minWidth: isMobile ? 52 : "auto",
        padding: isMobile ? (collapsed ? 0 : "0 16px") : variant === "contact" ? "10px 20px" : "12px 20px",
        transition: "padding 360ms cubic-bezier(0.32,0.72,0.24,1), background 160ms ease, border-color 160ms ease, color 160ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = p.bgHover;
        e.currentTarget.style.borderColor = p.borderHover;
        e.currentTarget.style.color = p.colorHover;
        const inner = e.currentTarget.querySelector<HTMLElement>("[data-btn-inner]");
        if (inner) inner.style.transform = "scale(1.025)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = p.bg;
        e.currentTarget.style.borderColor = p.border;
        e.currentTarget.style.color = p.color;
        const inner = e.currentTarget.querySelector<HTMLElement>("[data-btn-inner]");
        if (inner) inner.style.transform = "scale(1)";
      }}
    >
      <span
        data-btn-inner
        style={{
          display: "inline-flex",
          alignItems: "center",
          transformOrigin: "center",
          transition: "transform 160ms ease",
        }}
      >
        <CtaIcon k={b.key} />
        <span
          style={{
            maxWidth: collapsed ? 0 : isMobile ? 230 : 260,
            opacity: collapsed ? 0 : 1,
            marginLeft: collapsed ? 0 : 8,
            overflow: "hidden",
            whiteSpace: "nowrap",
            transition: "max-width 360ms cubic-bezier(0.32,0.72,0.24,1), opacity 220ms ease, margin-left 360ms cubic-bezier(0.32,0.72,0.24,1)",
          }}
        >
          {b.label}
        </span>
      </span>
    </a>
  );
}

export default function CtaButtons({ isMobile, variant = "hero" }: { isMobile: boolean; variant?: CtaVariant }) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  /* clicking anywhere outside the three pills collapses them all (mobile only) */
  useEffect(() => {
    if (!isMobile || expandedKey == null) return;
    const onDocPointer = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setExpandedKey(null);
      }
    };
    document.addEventListener("pointerdown", onDocPointer, true);
    return () => document.removeEventListener("pointerdown", onDocPointer, true);
  }, [isMobile, expandedKey]);

  /* collapse everything when leaving mobile so desktop pills are never stuck */
  useEffect(() => {
    if (!isMobile && expandedKey != null) setExpandedKey(null);
  }, [isMobile, expandedKey]);

  const wrapStyle: CSSProperties = {
    display: "flex",
    flexWrap: isMobile ? "nowrap" : "wrap",
    gap: isMobile ? 10 : 12,
    width: "100%",
    justifyContent: isMobile ? "flex-start" : "center",
    alignItems: "center",
  };

  return (
    <div ref={wrapRef} style={wrapStyle}>
      {CTA_BUTTONS.map((b) => (
        <CtaButton
          key={b.key}
          b={b}
          isMobile={isMobile}
          variant={variant}
          expanded={isMobile ? expandedKey === b.key : false}
          onExpand={setExpandedKey}
        />
      ))}
    </div>
  );
}
