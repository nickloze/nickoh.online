"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { socials } from "../../lib/data";

/* Figma 426:3263 — three rows in EB Garamond 22. The bullet marks the row
   that would be taken: it rests on LinkedIn and follows hover/focus. */
export default function SocialsBody() {
  const [hot, setHot] = useState<number | null>(null);
  const current = hot ?? 0;

  return (
    <ul className="font-serif text-[1.375em] leading-[1.318]" onPointerLeave={() => setHot(null)}>
      {socials.map((s, i) => {
        const on = i === current;
        return (
          <li key={s.label}>
            <a
              href={s.href}
              target={s.external ? "_blank" : undefined}
              rel={s.external ? "noopener noreferrer" : undefined}
              className={`block outline-none transition-colors duration-150 ${on ? "text-fg" : "text-fg-dim"}`}
              onPointerEnter={() => setHot(i)}
              onFocus={() => setHot(i)}
              onBlur={() => setHot(null)}
            >
              {on && (
                <motion.span layoutId="socials-bullet" aria-hidden="true" className="inline-block">
                  •&nbsp;
                </motion.span>
              )}
              {s.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
