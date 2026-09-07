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

/* About — node 414:3218 as instanced on the main frame (434:3687), which
   italicises both "Nicholas" and "form sharpens function". */
export const bio: Segment[] = [
  { text: "Hello! I'm ", serif: true },
  { text: "Nicholas", italic: true },
  {
    text: ", a product designer who loves building experiences that simplify complex problems. I work best where ",
    serif: true,
  },
  { text: "form sharpens function", italic: true },
  {
    text: ", always hunting for the shortcut hiding within a long route, where I believe simple carries character",
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

/* Project feed — nodes 373:2676 / 373:2688 / 373:2700 (@desktop) and
   438:5359 (@mobile). Ratios are the slide boxes as drawn: 954 × 512.77,
   954 × 450.42 and 331 × 225.74. */
export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  cover: { src: string; width: number; height: number; alt: string };
  ratio: { desktop: number; mobile: number };
  /* Node 373:2689 draws its image larger than the box: 108.71% wide,
     118.23% tall, shifted −2.73% / −7.28%. */
  crop?: { width: string; height: string; left: string; top: string };
};

const DESKTOP_FIRST = 954 / 512.77496; /* aspect 2400 / 1290 on 373:2677 */
const DESKTOP_REST = 954 / 450.42001;
const MOBILE = 331 / 225.74106;

export const projects: Project[] = [
  {
    slug: "refine",
    title: "Your cursor becomes an AI shortcut",
    client: "Refine",
    year: "2026",
    cover: { src: "/work/refine/cover.jpg", width: 3840, height: 2160, alt: "" },
    ratio: { desktop: DESKTOP_FIRST, mobile: MOBILE },
  },
  {
    slug: "petch",
    title: "Personal health gamified",
    client: "Petch",
    year: "2026",
    cover: { src: "/work/petch/cover.png", width: 1488, height: 904, alt: "" },
    ratio: { desktop: DESKTOP_REST, mobile: MOBILE },
    crop: { width: "108.71%", height: "118.23%", left: "-2.73%", top: "-7.28%" },
  },
  {
    slug: "stripe",
    title: "Transparent shopping experience",
    client: "Stripe",
    year: "2026",
    cover: { src: "/work/stripe/cover.png", width: 1200, height: 900, alt: "" },
    ratio: { desktop: DESKTOP_REST, mobile: MOBILE },
  },
];
