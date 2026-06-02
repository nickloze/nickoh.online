/* Portfolio content — single source of truth.
   Ported from the Claude Design handoff (project/data.jsx). Every project carries
   the four-part narrative (overview / problem / solution / outcome) plus the
   case-study fields the slide-over renders. */

import type { IconName } from "../components/ui/icons";

export type NavItem = {
  id: string;
  iconName: IconName;
  label: string;
  count: string;
};

export type ProjectLink = { label: string; url: string };

export type GalleryRowData = {
  slot: string;
  text: string;
  imageLeft?: boolean;
};

export type Project = {
  id: string;
  name: string;
  status: "live" | "wip";
  type: string;
  year: string;
  accent: string;
  eyebrow: string;
  subtitle: string;
  tags: string[];
  /* persistence key from the handoff — also the image lookup key (see SLOT_IMAGES) */
  slot: string;
  tagline: string;
  role: string;
  timeline: string;
  context: string;
  detailYear?: string;
  heroSubtitle: string;
  heroBlurb: string;
  practice: string[];
  approach: string;
  buildDetails?: string[];
  gallery?: string[];
  galleryRows?: GalleryRowData[];
  galleryMiddleSingle?: boolean;
  scenarioText?: string;
  overview: string;
  problem: string;
  solution: string;
  outcome: string;
  stack?: string[];
  links?: ProjectLink[];
};

export const navItems: NavItem[] = [
  { id: "about", iconName: "User", label: "Home", count: "01" },
  { id: "projects", iconName: "FolderGit2", label: "Projects", count: "02" },
  { id: "stack", iconName: "Code2", label: "Skill Stack", count: "09" },
  { id: "contact", iconName: "Mail", label: "Contact", count: "04" },
];

export const projects: Project[] = [
  {
    id: "001",
    name: "Petch",
    status: "live",
    type: "thesis",
    year: "2026",
    accent: "#7CFFB2",
    eyebrow: "Graduation Project",
    subtitle: "Gamified AI Health Companion",
    tags: ["Healthcare Tech", "AI Chatbot"],
    slot: "slot-petch",
    tagline:
      "A health education application that personalises and anticipates your health needs, with the goal of turning action into healthy habit formation. Built on the Knowing-Doing Gap framework and Digital Omotenashi.",
    role: "Solo — design, research, build",
    timeline: "2026",
    context: "LASALLE Graduation Project",
    detailYear: "2026",
    heroSubtitle: "Gamified AI Personal Health Companion",
    heroBlurb:
      "Gamified AI health companion for young adults. A pet that mirrors your mood, built on the Knowing-Doing Gap framework and Digital Omotenashi.",
    practice: ["Gamification", "Product Design", "AI Integration"],
    approach:
      "I designed Petch as a pet that mirrors your mood, not a coach that tracks your behavior. The pet's state is your state, surfaced gently. Built on the philosophy of Digital Omotenashi — anticipatory care that doesn't demand attention.",
    buildDetails: [
      "Four app surfaces: onboarding, home, community, action",
      "Knowing-Doing Loop as operational engine",
    ],
    gallery: ["g1", "g2", "g3", "g4"],
    overview:
      "Petch is a mobile companion that surfaces your wellbeing through the state of a small creature — quiet, anticipatory, and built around the framework of Digital Omotenashi. It targets the 18–35 cohort who already know what's good for them but don't act on it.",
    problem:
      "Young adults aged 18–35 know what's good for their health, but don't act on it. Existing wellness apps optimise for streaks and shame — neither closes the gap between knowing and doing, and both train users to negotiate with the app rather than themselves.",
    solution:
      "The pet's state is your state, surfaced gently — never coached, never gamified into compliance. A Knowing-Doing Loop runs in the background, mapping moments where a small nudge could land. Four surfaces (onboarding, home, community, action) carry the experience; Claude Haiku keeps API cost at dissertation scale.",
    outcome:
      "Currently in playtest with the dissertation cohort, ahead of a June 2026 final submission. Early signals: testers reported the pet metaphor felt less surveillant than a tracker dashboard, and the Knowing-Doing Loop produced more honest journaling than direct-prompt approaches.",
    stack: ["React Native", "Supabase", "Claude API"],
    links: [
      { label: "live demo", url: "petch.app" },
      { label: "case study", url: "nickoh.online/petch" },
    ],
  },
  {
    id: "002",
    name: "AcrossChat",
    status: "wip",
    type: "concept",
    year: "2025",
    accent: "#FFB870",
    eyebrow: "University Project",
    subtitle: "A Telegram Intelligence Layer for Family Group Chats",
    tags: ["Family Tech", "LLM"],
    slot: "slot-acrosschat",
    tagline:
      "A read-only layer over an existing family group chat that quietly surfaces shared activities, places, and conversations worth remembering. Family group, rethought.",
    role: "Concept & prototype",
    timeline: "Mar 2025 — present",
    context: "Conceptual",
    detailYear: "2025",
    heroSubtitle: "A Telegram Intelligence Layer for Family Group Chats",
    heroBlurb:
      "A read-only layer over an existing family group chat that quietly surfaces shared activities, places, and conversations worth remembering. Family group, rethought.",
    practice: ["Product Design", "LLM", "Family Tech"],
    approach:
      "A read-only intelligence layer that ingests the existing Telegram thread, extracts moments with AI to build a quiet ear that guides conversations, a product that never posts back to the chat — the family's primary surface stays untouched. Becoming the ultimate family prompter.",
    buildDetails: [
      "Read-only ingest over the existing Telegram thread",
      "LLM moment extraction: places, plans, photos",
      "Quiet weekly digest as the primary surface",
      "On-demand place graph for shared locations",
      "Volume control to keep the digest from feeling surveillant",
    ],
    gallery: ["g1", "g2", "g3", "g4"],
    galleryRows: [
      {
        slot: "g1",
        text: "The family group chat is alive but unanchored. AcrossChat picks up on the latent intentions within the chat and activates to give nudges in direction.",
        imageLeft: true,
      },
      {
        slot: "g2",
        text: "AcrossChat’s prompt when replied to reads the subtext of the mutual thread (food, the day, each other, etc). The typing indicator and glow hint that the layer is listening.",
      },
      {
        slot: "g3",
        text: "AcrossChat translates subtext into a proposal. The intelligence layer has converted ambient chatter into a concrete, low-friction invitation.",
        imageLeft: true,
      },
      {
        slot: "g4",
        text: "\"Dinner at Nex? 7pm Today? Let's vote!\" surfaces as a decision the family can act on together, allowing what was said to be gotten across. Bringing the activity out of the chat.",
      },
    ],
    scenarioText:
      "A family group chat is full of small talk — Mom wonders about meals in Japan, Dad shares a photo from his day — but the conversation never quite turns into anything. AcrossChat reads the latent intention beneath the chatter and surfaces it as a simple, actionable prompt: \"Dinner at NEX, 7pm — Japanese?\" What was just idle messaging becomes a real plan the family votes on and acts on together.",
    overview:
      "AcrossChat sits on top of an existing family group chat and quietly surfaces what's worth remembering — places visited, plans made, photos shared — without asking anyone to change how they already talk.",
    problem:
      "Family group chats are noisy archives. The moments worth remembering — places visited, plans made, photos shared get buried under logistics within hours, and no one wants to migrate the family to a new app to fix it.",
    solution:
      "A read-only intelligence layer that ingests the existing Telegram thread, extracts moments with AI to build a quiet ear that guides conversations, a product that never posts back to the chat — the family's primary surface stays untouched. Becoming the ultimate family prompter.",
    outcome:
      "Working prototype at the digest stage; place graph next. The hardest design problem so far has been the volume control — extracting too much makes the digest feel surveillant, too little and it's no different from scrolling back.",
    stack: ["Telegram API", "Next.js", "LLM"],
    links: [{ label: "concept doc", url: "nickoh.online/acrosschat" }],
  },
];

export type ExperienceEntry = {
  role: string;
  company: string;
  location: string;
  period: string;
  notes: string;
};

/* Retained from the handoff but not rendered (see Portfolio — the Experience
   section is held back for now). Restore by un-commenting it there. */
export const experience: ExperienceEntry[] = [
  {
    role: "Part-time Marketing & Admin",
    company: "Kstone",
    location: "Singapore",
    period: "2024 — Present",
    notes: "Marketing collateral, supplier sourcing, fabrication support.",
  },
  {
    role: "Design Student",
    company: "LASALLE College of the Arts",
    location: "Singapore",
    period: "2023 — 2026",
    notes: "BA(Hons) — focus on Creative Technology & Product Design.",
  },
];

export type StackGroup = { cat: string; items: string[] };

export const stack: StackGroup[] = [
  { cat: "design", items: ["Figma", "Figma Weave", "Affinity", "Adobe", "Apple Creator Studio"] },
  { cat: "ai workflow", items: ["Claude Code", "MCP"] },
  { cat: "systems", items: ["Notion", "Supabase"] },
];

export type ContactRow = { label: string; value: string; href: string };

export const contactRows: ContactRow[] = [
  { label: "Email", value: "nicklozekoh@gmail.com", href: "mailto:nicklozekoh@gmail.com" },
  { label: "Linkedin", value: "/in/nickoh-archive", href: "#" },
  { label: "Instagram", value: "@nichawyee", href: "#" },
];

/* The handoff stored dropped images in a sidecar keyed by slot id. Those were
   extracted to /public/work/* — this maps each slot id to its file. */
export const SLOT_IMAGES: Record<string, string> = {
  "slot-petch": "/work/petch/cover.png",
  "slot-petch-g1": "/work/petch/g1.png",
  "slot-petch-g2": "/work/petch/g2.png",
  "slot-petch-g3": "/work/petch/g3.png",
  "slot-petch-g4": "/work/petch/g4.png",
  "slot-acrosschat": "/work/acrosschat/cover.png",
  "slot-acrosschat-g1": "/work/acrosschat/g1.png",
  "slot-acrosschat-g2": "/work/acrosschat/g2.png",
  "slot-acrosschat-g3": "/work/acrosschat/g3.png",
  "slot-acrosschat-g4": "/work/acrosschat/g4.png",
};
