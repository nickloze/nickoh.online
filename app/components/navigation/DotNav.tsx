"use client";

import { IconHouse } from "../ui/icons";

interface DotNavProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}

/**
 * The persistent vertical dot indicator. The first dot is a house (the Landing
 * section); the rest are circles. The column never moves during a section
 * cross-fade — only the active dot's colour updates.
 */
export default function DotNav({ count, activeIndex, onSelect }: DotNavProps) {
  return (
    <nav
      aria-label="Section navigation"
      className="pointer-events-none absolute inset-0 z-20 flex items-center pb-[94px] md:pb-0"
    >
      <div className="pointer-events-auto ml-[var(--deck-edge)] flex flex-col items-center xl:ml-0">
        {Array.from({ length: count }, (_, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Go to section ${i + 1} of ${count}`}
              aria-current={isActive ? "true" : undefined}
              className="flex items-center justify-center rounded-full p-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
            >
              {i === 0 ? (
                <IconHouse
                  className={`h-3 w-3 transition-colors duration-300 ${
                    isActive ? "text-dot-active" : "text-dot"
                  }`}
                />
              ) : (
                <span
                  className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                    isActive ? "bg-dot-active" : "bg-dot"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
