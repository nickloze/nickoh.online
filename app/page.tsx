/* nickoh.online — one page, two viewports, same DOM.

   @desktop  Figma 373:2659 — folder panel fixed on the left, the work feed
             scrolling on the right.
   @mobile   Figma 441:243  — the feed scrolls in a window on top, the folder
             sits below it.

   Nothing on this page navigates yet: project cards are inert until a detail
   view is designed. */

import Shell from "./components/Shell";

export default function Home() {
  return <Shell />;
}
