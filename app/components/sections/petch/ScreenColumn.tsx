import type { ReactNode } from "react";

interface ScreenColumnProps {
  children: ReactNode;
  /** Extra classes for the column — e.g. `gap-*` or `justify-*`. */
  className?: string;
}

/**
 * @mobile — the centred content column shared by the paginated Petch case study
 * screens (Overview, Research, Solution). It fills the frame width with an 18px
 * margin each side and stands exactly one viewport tall (so every screen snaps
 * one-per-swipe), padding itself clear of the fixed tab strip above and the
 * floating island below.
 */
export default function ScreenColumn({ children, className = "" }: ScreenColumnProps) {
  return (
    <div
      className={`flex w-[calc(100vw-36px)] max-w-[440px] flex-1 flex-col pt-[calc(env(safe-area-inset-top)+54px)] pb-[calc(env(safe-area-inset-bottom)+100px)] ${className}`}
    >
      {children}
    </div>
  );
}
