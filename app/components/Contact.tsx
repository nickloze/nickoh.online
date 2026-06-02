"use client";

/* Contact (#contact) — closing sign-off: availability line, CTA pills, a
   database-row contact list, and the copyright footer.
   Ported from project/app.jsx (Contact). */

import type { MouseEvent } from "react";
import RuleHeader from "./ui/RuleHeader";
import CtaButtons from "./CtaButtons";
import { contactRows } from "../lib/data";

export default function Contact({ isMobile }: { isMobile: boolean }) {
  const onRowEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    const v = e.currentTarget.querySelector<HTMLElement>("[data-v]");
    if (v) v.style.color = "var(--zinc-100)";
    const a = e.currentTarget.querySelector<HTMLElement>("[data-arrow]");
    if (a) a.style.color = "var(--zinc-400)";
  };
  const onRowLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    const v = e.currentTarget.querySelector<HTMLElement>("[data-v]");
    if (v) v.style.color = "var(--zinc-300)";
    const a = e.currentTarget.querySelector<HTMLElement>("[data-arrow]");
    if (a) a.style.color = "var(--zinc-700)";
  };

  return (
    <section id="contact" style={{ padding: isMobile ? "40px 20px" : "40px 32px", fontFamily: "var(--sans)" }}>
      <RuleHeader label="contact" />

      <div
        style={{
          marginTop: isMobile ? 28 : 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 32,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, alignSelf: "stretch" }}>
          <div
            style={{
              fontSize: isMobile ? 20 : 24,
              color: "var(--zinc-100)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              textAlign: "left",
            }}
          >
            Let&apos;s connect and build something together.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 4px" }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#7CFFB2",
                flexShrink: 0,
                boxShadow: "0 0 10px rgba(124,255,178,0.5)",
              }}
            />
            <span style={{ fontSize: 16, color: "var(--zinc-400)", letterSpacing: "-0.01em" }}>
              Available for work starting August
            </span>
          </div>
        </div>

        <CtaButtons isMobile={isMobile} variant="contact" />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", alignSelf: "stretch" }}>
          {contactRows.map((c) => (
            <a
              key={c.label}
              href={c.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 0",
                alignSelf: "stretch",
                transition: "opacity 180ms ease",
              }}
              onMouseEnter={onRowEnter}
              onMouseLeave={onRowLeave}
            >
              <span style={{ fontSize: 12, color: "var(--zinc-600)", width: 80, flexShrink: 0 }}>{c.label}</span>
              <span
                data-v
                style={{
                  fontSize: 12,
                  color: "var(--zinc-300)",
                  transition: "color 180ms ease",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                }}
              >
                {c.value}
              </span>
              <svg
                data-arrow
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--zinc-700)", transition: "color 180ms ease", flexShrink: 0 }}
              >
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
            gap: 4,
            marginTop: 8,
          }}
        >
          <span style={{ fontSize: 10, color: "var(--zinc-500)" }}>©Nicholas Koh</span>
          <span style={{ fontSize: 10, color: "var(--zinc-500)" }}>2026</span>
        </div>
      </div>
    </section>
  );
}
