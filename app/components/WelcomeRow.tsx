"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Welcome! I’m a Creative Technologist and Product/Service Designer who treats problem-solving as the real intervention. Service design is the lens, Digital is the medium. Form follows function, believing anything can be solved beautifully.",
  "Lately I’ve been thinking about how the smallest interaction can change someone’s entire experience. The boring details — the spacing, the delay, the order of three words — are where the design actually happens.",
  "Currently experimenting with how AI can act less like a tool and more like a quiet collaborator — one that disappears into the background until the moment you actually need it.",
];

const INTERVAL_MS = 12_000;

export default function WelcomeRow() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % MESSAGES.length);
    }, INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="flex items-center gap-[6.25vw] border-b-[0.0781vw] border-divider p-[1.6667vw]">
      <div
        aria-hidden
        className="flex shrink-0 flex-col items-center gap-[0.625vw]"
      >
        {MESSAGES.map((_, i) => (
          <span
            key={i}
            className="block h-[1.25vw] w-[1.25vw] rounded-full transition-colors duration-500"
            style={{ backgroundColor: i === idx ? "#43414c" : "#302f36" }}
          />
        ))}
      </div>
      <p
        key={idx}
        className="fade-swap text-[1.4583vw] leading-[1.875vw] tracking-[-0.01em] text-text-muted"
      >
        {MESSAGES[idx]}
      </p>
    </section>
  );
}
