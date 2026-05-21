interface SectionShellProps {
  children: React.ReactNode;
}

/**
 * Shared section frame. On mobile, content stacks in a single column, centered
 * in the band above the floating island. From tablet up it uses the desktop
 * layout — content centered in a fixed-height row container — scaling up to the
 * full Figma dimensions on desktop.
 */
export default function SectionShell({ children }: SectionShellProps) {
  return (
    <div className="absolute inset-0 flex items-center pb-[94px] md:pb-0">
      <div className="w-full pl-[var(--deck-pad-l)] pr-[var(--deck-edge)] md:flex md:h-[450px] md:items-center md:pr-[40px] xl:pl-[84px] xl:pr-0">
        {children}
      </div>
    </div>
  );
}
