"use client";

/* Skill stack (#stack) — three category cards. Tools, not opinions.
   Categories with more than three items split into a two-column item list.
   Ported from project/app.jsx (Stack). */

import RuleHeader from "./ui/RuleHeader";
import { stack } from "../lib/data";

export default function Stack({ isMobile }: { isMobile: boolean }) {
  return (
    <section
      id="stack"
      style={{
        padding: isMobile ? "40px 20px" : "40px 32px",
        borderBottom: "1px solid var(--border-section)",
        fontFamily: "var(--sans)",
      }}
    >
      <RuleHeader label="stack" />

      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        {stack.map((group) => (
          <div
            key={group.cat}
            style={{
              border: "1px solid var(--border-section)",
              background: "var(--bg-stack-card)",
              borderRadius: 8,
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "var(--zinc-600)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ width: 8, height: 8, border: "1px solid var(--zinc-600)", flexShrink: 0 }} />
              {group.cat}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: group.items.length > 3 ? "1fr 1fr" : "1fr",
                gap: 6,
              }}
            >
              {group.items.map((item) => (
                <div
                  key={item}
                  style={{ fontSize: 12, color: "var(--zinc-300)", display: "flex", alignItems: "center", gap: 8 }}
                >
                  <span style={{ width: 4, height: 4, background: "var(--zinc-600)", flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
