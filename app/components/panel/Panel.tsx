import { forwardRef } from "react";
import Availability from "./Availability";
import Folder from "./Folder";

/* Figma 373:2661 "Introduction Section".
   @desktop — 406 wide, full height, folder at the top and the availability
              line pinned to the bottom.
   @mobile  — the folder alone, sitting under the feed window (441:243). The
              panel is given the height of the folder's tallest state (35 tab
              row + 202 box = 237 units) so the row never resizes: the box
              grows downward from a fixed top, the way it does @desktop, and
              the feed above it stays where it is when a tab changes. Without
              this the bottom-anchored grid row would pin the folder's bottom
              and move its top instead. */
const Panel = forwardRef<HTMLDivElement, { className?: string }>(function Panel(
  { className = "" },
  ref,
) {
  return (
    <aside
      ref={ref}
      className={`flex h-[calc(14.8125*var(--folder-unit))] flex-col items-start justify-between desktop:h-auto ${className}`}
    >
      <Folder />
      <div className="hidden desktop:block">
        <Availability />
      </div>
    </aside>
  );
});

export default Panel;
