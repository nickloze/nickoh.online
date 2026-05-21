import type { ReactNode } from "react";

interface CategoryButtonProps {
  /** Whether this button's content is the one currently shown. */
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

/**
 * @mobile — a pill toggle used on the Research and Solution screens. Tapping it
 * swaps the screen's paragraph (and, on Solution, reveals an image); tapping
 * the active pill again clears the selection. Active is filled black, inactive
 * is the muted surface chip.
 */
export default function CategoryButton({ active, onClick, children }: CategoryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-[40px] px-4 py-2 text-left text-[14px] tracking-[-0.02em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 ${
        active ? "bg-ink text-white" : "bg-surface text-ink"
      }`}
    >
      {children}
    </button>
  );
}
