"use client";

/* Hero / about (#about) — greeting, headline, bio, and the CTA pills.
   The headline breaks across three lines @desktop and reflows to a single run
   @mobile. Ported from project/app.jsx (Hero). */

import CtaButtons from "./CtaButtons";

export default function Hero({ isMobile }: { isMobile: boolean }) {
  return (
    <section
      id="about"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "left",
        gap: isMobile ? 40 : "clamp(56px, 9vw, 120px)",
        fontFamily: "var(--sans)",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          maxWidth: 860,
          gap: 32,
          justifyContent: "flex-start",
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            lineHeight: 1.1,
            fontWeight: 500,
            letterSpacing: 0,
            fontSize: 32,
          }}
        >
          Hello! I&apos;m Nicholas,
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: isMobile ? "clamp(28px, 7.5vw, 36px)" : 40,
            fontWeight: 400,
            color: "rgb(255, 255, 255)",
            letterSpacing: "-0.8px",
            lineHeight: 1.2,
          }}
        >
          I design interfaces and{!isMobile && <br />}
          {isMobile ? " " : ""}build tools that help make the{!isMobile && <br />}
          {isMobile ? " " : ""}gap between knowing to doing{" "}
          <span style={{ textDecoration: "underline", textUnderlineOffset: "4px" }}>easier.</span>
        </h1>
      </div>

      {/* paragraph + buttons grouped */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 32, width: "100%" }}>
        <p
          style={{
            margin: 0,
            fontWeight: 400,
            color: "var(--zinc-300)",
            lineHeight: 1.32,
            letterSpacing: "-0.02em",
            maxWidth: 1010,
            textWrap: "pretty",
            fontSize: 28,
          }}
        >
          I&apos;m a Creative Technologist and Product/Service Designer from Singapore, who treats
          problem-solving as the real intervention. Service design is the lens, digital is the
          medium. Form follows function, believing anything can be solved beautifully.
        </p>

        <CtaButtons isMobile={isMobile} variant="hero" />
      </div>
    </section>
  );
}
