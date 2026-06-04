"use client";

/* Left rail — identity, primary nav pills, and the "Currently" block.

   @desktop / @ipad (≥880px): a collapsed 64px icon rail by default that expands
     to 296px on hover and *floats over* the scrolling main content instead of
     reflowing it (an outer spacer reserves only the collapsed width in the flex
     flow; the visible panel is absolutely positioned and animates its width).
     The identity shrinks to a square "NK" logo when collapsed and the labels
     fade in as it expands.
   @mobile (<880px): UNCHANGED — an off-canvas overlay that slides in from the
     left. The mobile sidebar is intentionally left exactly as it was.

   Ported from project/app.jsx (Sidebar + GroupHeader). */

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { Icon } from "./ui/icons";
import { navItems } from "../lib/data";

function GroupHeader({
  label,
  onAction,
  actionIcon,
}: {
  label: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "6px 14px", marginBottom: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--zinc-300)", letterSpacing: "0.02em" }}>
        {label}
      </span>
      <Icon.ChevronRight size={12} style={{ color: "var(--zinc-600)", marginLeft: 4 }} />
      <span style={{ flex: 1 }} />
      {onAction && (
        <button
          onClick={onAction}
          aria-label={`add ${label}`}
          style={{
            width: 20,
            height: 20,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--zinc-500)",
            borderRadius: 4,
            transition: "background 150ms ease, color 150ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(24,24,27,0.8)";
            e.currentTarget.style.color = "var(--zinc-300)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--zinc-500)";
          }}
        >
          {actionIcon || <Icon.Plus size={14} />}
        </button>
      )}
    </div>
  );
}

export default function Sidebar({
  active,
  onNav,
  isMobile,
  mobileOpen,
  onClose,
}: {
  active: string;
  onNav: (id: string) => void;
  isMobile: boolean;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  // Hover drives the desktop/iPad expand. Declared before any early return so
  // the hook order stays stable across a viewport flip at the 880px boundary.
  const [hovered, setHovered] = useState(false);

  // ──────────────────────────────────────────────────────────────────────────
  // @mobile — PRESERVED. Off-canvas overlay, identity is text-only, full-width
  // pills. Do not change this branch; the mobile sidebar is signed off as-is.
  // ──────────────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <aside
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 60,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 320ms cubic-bezier(0.32, 0.72, 0.24, 1)",
          width: 296,
          boxShadow: mobileOpen ? "0 25px 50px -12px rgba(0,0,0,0.7)" : "none",
          background: "var(--bg-panel)",
          borderRight: "1px solid var(--border-default)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--sans)",
        }}
      >
        {/* identity */}
        <div style={{ padding: "18px 14px 14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: 12,
              padding: "8px 10px",
              borderRadius: 8,
            }}
          >
            <span
              style={{
                flex: 1,
                textAlign: "left",
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
          </div>
        </div>

        {/* primary nav — big pills */}
        <nav style={{ padding: "0 10px 14px", borderBottom: "1px solid var(--border-section)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {navItems.map((item) => {
              const IconC = Icon[item.iconName];
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNav(item.id);
                    onClose();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: isActive ? "var(--bg-raised)" : "transparent",
                    color: isActive ? "var(--zinc-100)" : "var(--zinc-400)",
                    boxShadow: isActive ? "inset 0 0 0 1px rgba(255,255,255,0.04)" : "none",
                    transition: "background 160ms ease, color 160ms ease",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(24,24,27,0.6)";
                      e.currentTarget.style.color = "var(--zinc-200)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--zinc-400)";
                    }
                  }}
                >
                  <IconC size={18} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, letterSpacing: "-0.005em", fontSize: 12 }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* currently */}
        <div style={{ padding: "14px 10px" }}>
          <GroupHeader label="Currently" />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 14px", color: "var(--zinc-300)" }}>
              <Icon.Sparkles size={16} style={{ color: "var(--zinc-500)" }} />
              <span style={{ flex: 1, fontSize: 12 }}>Petch</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 14px", color: "var(--zinc-300)" }}>
              <Icon.Coffee size={16} style={{ color: "var(--zinc-500)" }} />
              <span style={{ flex: 1, fontSize: 12 }}>Vibe Coding</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 14px", color: "var(--zinc-300)" }}>
              <Icon.Mountain size={16} style={{ color: "var(--zinc-500)" }} />
              <span style={{ flex: 1, fontSize: 12 }}>Climbing 24/7</span>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // @desktop / @ipad — collapsed icon rail that expands on hover and floats
  // over the main content (no reflow).
  // ──────────────────────────────────────────────────────────────────────────
  const COLLAPSED_W = 64;
  const EXPANDED_W = 296;
  const expanded = hovered;

  // Label that fades + collapses to zero width when the rail is collapsed.
  const labelStyle: CSSProperties = {
    flex: 1,
    letterSpacing: "-0.005em",
    fontSize: 12,
    whiteSpace: "nowrap",
    overflow: "hidden",
    opacity: expanded ? 1 : 0,
    width: expanded ? "auto" : 0,
    transition: "opacity 160ms ease",
  };

  return (
    /* Outer spacer reserves only the collapsed-rail width in the flex flow, so
       hover-expansion floats over the content instead of pushing it. */
    <aside style={{ position: "relative", flexShrink: 0, width: COLLAPSED_W, alignSelf: "stretch" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
          width: expanded ? EXPANDED_W : COLLAPSED_W,
          transition: "width 260ms cubic-bezier(0.32, 0.72, 0.24, 1)",
          boxShadow: expanded ? "0 25px 50px -12px rgba(0,0,0,0.55)" : "none",
          background: "var(--bg-panel)",
          borderRight: "1px solid var(--border-default)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "var(--sans)",
        }}
      >
        {/* identity — square "NK" logo (always visible) + name (fades in) */}
        <div style={{ padding: "18px 14px 14px" }}>
          <button
            aria-label="identity"
            style={{ display: "flex", alignItems: "center", width: "100%", gap: 12, padding: 0, borderRadius: 8 }}
          >
            {/* empty square logo placeholder — drop a real mark in here later */}
            <span
              aria-hidden
              style={{
                flexShrink: 0,
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "var(--bg-raised)",
                border: "1px solid var(--border-default)",
                display: "inline-flex",
              }}
            />
            <span
              style={{
                flex: 1,
                textAlign: "left",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--zinc-100)",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                opacity: expanded ? 1 : 0,
                transition: "opacity 160ms ease",
              }}
            >
              Nicholas Koh&apos;s Online Home
            </span>
          </button>
        </div>

        {/* primary nav — icon always shown, label fades in on expand */}
        <nav style={{ padding: "0 10px 14px", borderBottom: "1px solid var(--border-section)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {navItems.map((item) => {
              const IconC = Icon[item.iconName];
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNav(item.id)}
                  title={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: isActive ? "var(--bg-raised)" : "transparent",
                    color: isActive ? "var(--zinc-100)" : "var(--zinc-400)",
                    boxShadow: isActive ? "inset 0 0 0 1px rgba(255,255,255,0.04)" : "none",
                    transition: "background 160ms ease, color 160ms ease",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(24,24,27,0.6)";
                      e.currentTarget.style.color = "var(--zinc-200)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--zinc-400)";
                    }
                  }}
                >
                  <IconC size={18} style={{ flexShrink: 0 }} />
                  <span style={labelStyle}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* currently — header fades out when collapsed; the status icons remain */}
        <div style={{ padding: "14px 10px" }}>
          <div style={{ opacity: expanded ? 1 : 0, transition: "opacity 160ms ease" }}>
            <GroupHeader label="Currently" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", fontSize: 13, color: "var(--zinc-300)" }}>
              <Icon.Sparkles size={16} style={{ flexShrink: 0, color: "var(--zinc-500)" }} />
              <span style={labelStyle}>Petch</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", fontSize: 13, color: "var(--zinc-300)" }}>
              <Icon.Coffee size={16} style={{ flexShrink: 0, color: "var(--zinc-500)" }} />
              <span style={labelStyle}>Vibe Coding</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", fontSize: 13, color: "var(--zinc-300)" }}>
              <Icon.Mountain size={16} style={{ flexShrink: 0, color: "var(--zinc-500)" }} />
              <span style={labelStyle}>Climbing 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
