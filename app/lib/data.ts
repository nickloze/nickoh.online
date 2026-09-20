/* Every string here is lifted from the Figma file (k56TffzeUrNoE61NvHqRj3).
   Nothing is invented; missing copy is left missing. */

export type Tab = "about" | "chat" | "cv";

/* A run of text; `italic` runs render in EB Garamond Italic, `serif` runs in
   EB Garamond Regular, the rest in Inter. */
export type Segment = { text: string; italic?: boolean; serif?: boolean };

/* Folder tab labels — component set 434:3685, property "Details". */
export const tabs: { id: Tab; label: string }[] = [
  { id: "about", label: "About" },
  { id: "chat", label: "Let’s Chat" },
  { id: "cv", label: "Download CV" },
];

/* About — node 414:3218 as instanced on the main frame (434:3687). Figma
   italicises only "form sharpens function"; "Nicholas" stays italic by Nic's
   call. No closing full stop, as drawn. */
export const bio: Segment[] = [
  { text: "Hello! I'm ", serif: true },
  { text: "Nicholas", italic: true },
  {
    text: ", a product designer who loves building experiences that simplify complex problems. I work best where ",
    serif: true,
  },
  { text: "form sharpens function", italic: true },
  {
    text: ", always hunting for the shortcut hiding within a long route",
    serif: true,
  },
];

/* Let's Chat — node 426:3263. Labels from Figma; hrefs carried over from the
   previous build's contact rows. */
export type Social = { label: string; href: string; external?: boolean };
export const socials: Social[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nickloze/", external: true },
  { label: "WhatsApp", href: "https://wa.me/6593362344", external: true },
  { label: "Gmail", href: "mailto:nicklozekoh@gmail.com" },
];

/* Download CV — the PDF already in /public; opened in a new tab. */
export const cv = {
  href: "/nicholas-koh-resume.pdf",
  label: "Download CV",
};

/* Node 456:2597 — "Available for Work", with "for" in Garamond italic. */
export const availability: Segment[] = [
  { text: "Available" },
  { text: " " },
  { text: "for", italic: true },
  { text: " " },
  { text: "Work" },
];

/* Projects — the feed cards and the project pages — live in ./projects.ts. */
