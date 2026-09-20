import type { MouseEvent } from "react";

/* Every in-app link is a real <a href>, so middle-click, cmd-click and a
   crawler all behave. A *plain* click is the only one the app intercepts to
   move in place instead of navigating — anything with a modifier, or any
   button but the left one, is the browser's to handle. */
export function isPlainClick(e: MouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}
