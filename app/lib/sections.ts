export type SectionId =
  | "landing"
  | "about"
  | "work-petch"
  | "work-acrosschat";

export interface SectionMeta {
  id: SectionId;
  /** Human-readable label, used for the dot-nav accessible names. */
  label: string;
}

/** The five sections, in scroll order. Drives the dot count and navigation. */
export const SECTIONS: SectionMeta[] = [
  { id: "landing", label: "Landing" },
  { id: "about", label: "About Me" },
  { id: "work-petch", label: "Work Library — Petch" },
  { id: "work-acrosschat", label: "Work Library — AcrossChat" },
];

/** Index of the first Work Library section — the title card plays on entry. */
export const FIRST_WORK_INDEX = SECTIONS.findIndex((s) => s.id === "work-petch");

export const LANDING = {
  heading: "Welcome to my Online Home!",
  /** Rendered in near-black; the rest of the intro is muted. */
  introLead: "I’m Nicholas from Singapore",
  introRest:
    ", a Creative Technologist and Product/Service Designer who treats problem-solving as the real intervention. Service design is the lens, Digital is the medium. Form follows function, believing anything can be solved beautifully.",
};

/** Areas-of-practice tags. The mobile frame (269:2756) and the desktop frame
 *  (240:1461) order them differently — Service Design leads on mobile, UI/UX
 *  leads on desktop — so each breakpoint keeps its own order. Beyond Design is
 *  the same on both. */
export const ABOUT = {
  areasOfPractice: ["Service Design", "Branding Identity", "AI Technologist", "UI/UX"],
  areasOfPracticeDesktop: ["UI/UX", "Service Design", "AI Technologist", "Branding Identity"],
  beyondDesign: ["Climbing", "Fitness", "Cooking"],
};

export interface WorkProject {
  /** URL slug, e.g. /work/petch. */
  slug: string;
  name: string;
  subtitle: string;
  /** Short blurb shown on the Work Library card. */
  description: string;
  /** Long-form copy for the project detail Overview tab. */
  overview: string;
  tags: string[];
  /** Hero photo shown on the project detail page; empty if none yet. */
  hero: string;
}

/** The four screens of a project case study, in scroll order
 *  (frames 275:4105 / 299:6016 / 299:6017 / 290:5028). */
export const PROJECT_TABS = ["Overview", "Research", "Solution", "Outcome"] as const;
export type ProjectTab = (typeof PROJECT_TABS)[number];

/** Work Library projects. New projects are added here under the same label. */
export const PETCH: WorkProject = {
  slug: "petch",
  name: "Petch",
  subtitle: "Personalised Gamified AI Health Companion",
  description:
    "Your pocket-sized AI health companion. Bridging the gap between knowing and doing, one check-in at a time.",
  overview:
    "Petch is an AI-powered health app that bridges the health literacy gap for young adults aged 18-35. The problem isn't knowing, it's doing. Petch closes that gap through gamified learning that personalises to understand your health by tracking your patterns and habits, with the end goal of turning healthier actions into lasting habits.",
  tags: ["UI/UX", "AI", "Gamification"],
  hero: "/figma/petch/overview1.png",
};

export const ACROSSCHAT: WorkProject = {
  slug: "acrosschat",
  name: "AcrossChat",
  subtitle: "Samaritans of Singapore Campaign",
  description:
    "Bringing the family group chats to life through an intelligence layer in Telegram that surfaces activities to bring families together.",
  // {TODO: copy} — no AcrossChat detail frames provided yet.
  overview: "",
  tags: ["AI", "Branding Identity", "User Experience"],
  hero: "",
};

/** All Work Library projects, in carousel order. */
export const WORK_PROJECTS: WorkProject[] = [PETCH, ACROSSCHAT];

export function getProject(slug: string): WorkProject | undefined {
  return WORK_PROJECTS.find((p) => p.slug === slug);
}
