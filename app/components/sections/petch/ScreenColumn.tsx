import type { ReactNode } from "react";

interface ScreenColumnProps {
  children: ReactNode;
  /** Extra classes for the column — e.g. `gap-*` or `justify-*`. */
  className?: string;
}

/**
 * @mobile — the centred 300px content column shared by every Petch case study
 * screen. It fills exactly one viewport (so every screen snaps one-per-swipe)
 * and pads itself clear of the fixed tab strip above and the floating island
 * below.
 */
export default function ScreenColumn({ children, className = "" }: ScreenColumnProps) {
  return (
    <div
      className={`flex w-[300px] max-w-[calc(100vw-36px)] flex-1 flex-col pt-[calc(env(safe-area-inset-top)+54px)] pb-[calc(env(safe-area-inset-bottom)+130px)] ${className}`}
    >
      {children}
    </div>
  );
}
