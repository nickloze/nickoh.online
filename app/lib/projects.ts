/* The four projects — the home feed cards and the project pages.

   Every string is lifted from the Figma file (k56TffzeUrNoE61NvHqRj3), with
   the obvious typos corrected in code (Nic's call; the list went back to him
   to mirror in Figma):
     "seleceted" → "selected" · "AI Communciation" → "AI Communication" ·
     "Everyday a new" → "Every day a new" · "connection that suggest" →
     "that suggests" · "different task" → "different tasks" · "What its" →
     "What it's" · "young adults health" → "young adults' health".
   Where the home card and the project page disagree (SOS 2025 vs 2026,
   "Refine" vs "Refine AI"), each keeps what Figma shows.

   Frames: Refine 672:3003 · Petch 567:780 · SOS 605:1398 · Shopping AI
   615:2321; cards on the home frame 373:2659. */

export type Slug = "refine" | "petch" | "sos" | "checkout-experience";

/* One media slot. `still` always exists (the Figma frame at 2×, or the
   video's first frame once a video is in); `src` is the looping video, when
   there is one. `w × h` is the slot as drawn at 1512. */
export type Media = { still: string; src?: string; w: number; h: number; alt: string };

export type Block =
  /* 995 × 550 (SOS's last is 995 × 857); Refine's carry a 34px title */
  | { type: "media"; media: Media; title?: string; caption?: string }
  /* Petch: two 485.5 × 550 side by side, gap 24 */
  | { type: "pair"; items: [Media, Media] }
  /* Petch: three 272 × 561.5 phones on the page, gap 42 */
  | { type: "phones"; items: Media[] }
  /* Petch: a second 34px paragraph between the phones and the gallery */
  | { type: "statement"; text: string };

export type Row = { label: "PROBLEM" | "SOLUTION" | "APPROACH"; heading: string; body: string };

export type Project = {
  slug: Slug;
  /* the home feed card (373:2676 · 373:2688 · 373:2700 · 585:1248) */
  card: {
    title: string;
    client: string;
    year: string;
    /* How the card crops the cover. The card is 995 × 521.49 and shows the
       project cover (995 × 550) — by default centred. `top` is in 995-wide
       units, `scale` enlarges the cover layer so it still fills the card. */
    crop?: { top: number; scale: number };
  };
  cover: Media;
  page: {
    title: string;
    meta: { project: string; year: string };
    subtitle: string;
    tags: string[];
    lede: string;
    rows: Row[];
    blocks: Block[];
  };
};

/* Every file for a project sits in /public/work/<slug>/, named by slot. */
const slot = (slug: Slug, name: string, w: number, h: number, alt: string, video = false): Media => ({
  still: `/work/${slug}/${name}.jpg`,
  src: video ? `/work/${slug}/${name}.mp4` : undefined,
  w,
  h,
  alt,
});

/* Which slots have a video yet — filled in as the media pipeline confirms
   each match (see scripts/encode-video.sh). A slot left out shows its still. */
const VIDEO: Record<Slug, string[]> = {
  refine: ["cover", "01", "02", "03"],
  petch: ["cover", "phone-1", "phone-2", "phone-3", "01", "02", "pair-1", "pair-2"],
  sos: ["cover", "01", "02", "03", "04"],
  "checkout-experience": ["cover", "01", "02", "03"],
};
const m = (slug: Slug, name: string, w: number, h: number, alt: string) =>
  slot(slug, name, w, h, alt, VIDEO[slug].includes(name));

export const projects: Project[] = [
  {
    slug: "refine",
    card: { title: "Your cursor becomes an AI shortcut", client: "Refine", year: "2026" },
    cover: m("refine", "cover", 995, 550, "Refine running over a Notion-style project page on macOS"),
    page: {
      title: "AI, Without Leaving Your Flow",
      meta: { project: "Refine AI", year: "2026" },
      subtitle: "Inline AI editing tool",
      tags: ["AI Productivity", "Interaction Design", "Workflow Innovation"],
      lede: "Refine is an inline AI tool that surfaces where your application is, and executes different tasks based on your cursor.",
      rows: [
        {
          label: "PROBLEM",
          heading: "Every AI interaction starts with leaving your work.",
          body: "AI is powerful, but using it often breaks the flow of work. Whether editing text, understanding an image, or completing a task, users must constantly switch between applications and AI tools. These repetitive context switches create friction that accumulates throughout the day.",
        },
        {
          label: "SOLUTION",
          heading: "A smarter AI tool is good. An invisible one is better.",
          body: "Refine treats AI as an invisible layer that lives across every application, not a separate destination. Familiar interactions like text selection, region selection, contextual actions bring AI directly into the workflow, right where you're already working. The result: AI adapts to you, instead of you adapting to it.",
        },
      ],
      blocks: [
        {
          type: "media",
          media: m("refine", "01", 995, 550, "Refine rewriting a selected draft inside a Mail window"),
          title: "Never leave the draft",
          caption:
            "No pasting into a chat and back. Select, press ⌥R, and the rewrite replaces your text in the field you're already in.",
        },
        {
          type: "media",
          media: m("refine", "02", 995, 550, "Refine answering about a region drawn over an analytics dashboard"),
          title: "Skip the screenshot",
          caption:
            "No cropping, saving, uploading, or explaining what you're looking at. Draw a box and the answer streams in next to it.",
        },
        {
          type: "media",
          media: m("refine", "03", 995, 550, "Refine's right-click menu over a budget spreadsheet"),
          title: "A Right-click that always knows",
          caption:
            "What it's about, how it connects to your screen, and what to do about it. Pick one and an answer appears beside the click.",
        },
      ],
    },
  },
  {
    slug: "petch",
    card: { title: "Personal health just became fun", client: "Petch", year: "2026" },
    cover: m("petch", "cover", 995, 550, "Petch, the gamified AI health companion"),
    page: {
      title: "Personal health just became fun",
      meta: { project: "Petch", year: "2026" },
      subtitle: "Gamified AI Health Companion",
      tags: ["AI Products", "Product Design", "UX Research"],
      lede: "Petch is a gamified AI health companion, personalised to guide young adults' health through digital omotenashi.",
      rows: [
        {
          label: "PROBLEM",
          heading: "Health information doesn’t translate to action",
          body: "Research shows that health literacy among young adults in Singapore remains low — not due to a lack of information, but a lack of engagement. Young adults aged 18–35 generally know what's good for their health, yet rarely seek it out or act on that knowledge.",
        },
        {
          label: "SOLUTION",
          heading: "Health advice is great. A health companion is better.",
          body: "Petch transforms health learning into everyday action, providing users empathetic guidance, tailored insights, and anticipatory support throughout their health journey. Daily lessons and check-ins become missions, with redeemable rewards to encourage lasting engagement.",
        },
      ],
      blocks: [
        {
          type: "phones",
          items: [
            m("petch", "phone-1", 272.08, 561.55, "Petch quizzing sleep knowledge in a lesson"),
            m("petch", "phone-2", 272.08, 561.55, "Petch noticing an 11am energy crash and offering a check-in"),
            m("petch", "phone-3", 272.08, 561.55, "Petch's health overview with sleep, sugar and gym habits"),
          ],
        },
        {
          type: "statement",
          text: "Through daily check-ins, Petch makes personal health more engaging by helping users turn what they know into meaningful action through quizzes, challenges, and rewards.",
        },
        { type: "media", media: m("petch", "01", 995, 550, "A daily check-in starting from “Tired from School”") },
        { type: "media", media: m("petch", "02", 995, 550, "A personalised sleep lesson and quiz") },
        {
          type: "pair",
          items: [
            m("petch", "pair-1", 485.5, 550, "Committing to one action to earn a reward"),
            m("petch", "pair-2", 485.5, 550, "Coins landing and a one-day streak"),
          ],
        },
      ],
    },
  },
  {
    slug: "sos",
    card: {
      title: "Turning conversations into connections",
      client: "Samaritans of Singapore",
      year: "2025",
      /* Figma lifts the phone 36.44 higher on the card (y −2064.44 in 521.49)
         than on the cover (−2028 in 550); one video can only approximate it. */
      crop: { top: -36.44, scale: 1.0144 },
    },
    cover: m("sos", "cover", 995, 550, "Telegram Intelligence in a family group chat"),
    page: {
      title: "Turning Conversations Into Connections",
      meta: { project: "Samaritans of Singapore", year: "2026" },
      subtitle: "Telegram Intelligence",
      tags: ["Family Connection", "Product Design", "AI Communication"],
      lede: "Telegram Intelligence is an AI-powered family companion that transforms everyday conversations in the group chat into meaningful real-world experiences and connection.",
      rows: [
        {
          label: "PROBLEM",
          heading: "Immediate prevention isn't enough.",
          body: "According to SOS Singapore's 2025 reports, youths aged 10–19 remain one of the most vulnerable demographics, with family-related challenges emerging as a significant contributing factor. While current SOS suicide prevention efforts focus on moments of crisis, there’s an opportunity to intervene earlier by strengthening family relationships before problems escalate.",
        },
        {
          label: "APPROACH",
          heading: "Every family chat keeps you in touch. This one gets you together.",
          body: "Families interact daily through group chats, yet these conversations stay transactional — rarely creating space for the harder, more honest ones. Telegram Intelligence embeds an AI that reads context and shared interests to spark real connection that suggests activities and discussions, opening the door for kids to be more honest and vulnerable with their peers.",
        },
      ],
      blocks: [
        {
          type: "media",
          media: m("sos", "01", 995, 550, "A pinned daily conversation starter in the family chat"),
          caption: "Every day a new conversation starter is pinned at the top for users to reply and surface the AI",
        },
        {
          type: "media",
          media: m("sos", "02", 995, 550, "The AI joining the family conversation"),
          caption: "It comes to life when surfaced by a user or when it sees an opening to join the conversation",
        },
        {
          type: "media",
          media: m("sos", "03", 995, 550, "Suggested next steps the family can tap on"),
          caption:
            "Telegram Intelligence turns the conversation into action by surfacing suggested next steps the family can tap on.",
        },
        {
          type: "media",
          media: m("sos", "04", 995, 857, "The family chat after a plan has been made together"),
          caption: "Family members get involved, stay connected and grow closer with the help of Telegram Intelligence",
        },
      ],
    },
  },
  {
    slug: "checkout-experience",
    card: { title: "Transparent shopping experience", client: "Concept", year: "2026" },
    cover: m("checkout-experience", "cover", 995, 550, "An AI Insights card suggesting a skincare reorder"),
    page: {
      title: "Shop Less. Decide Better.",
      meta: { project: "Mobile shopping experience reimagined", year: "2026" },
      subtitle: "AI Shopping Companion",
      tags: ["Checkout Experience", "Product Design", "Conceptual"],
      lede: "An AI companion that helps customers navigate choices, compare products, and check out with confidence",
      rows: [
        {
          label: "PROBLEM",
          heading: "AI got you to the product. Not to the decision.",
          body: "Users increasingly shop through AI directly. However, once they click into the product link, they're faced again to convince themselves about their purchasing decision. The challenge is no longer finding products; it's carrying the reasoning through to a confident decision.",
        },
        {
          label: "APPROACH",
          heading: "AI as your shopping enabler, not a separate chatbot.",
          body: "AI shopping pulls users away from the moment of purchase. I explored working towards the end of the shopping journey instead – bringing AI before one checks out. The goal isn't to replace the decision, but to reduce the effort it takes to reach it.",
        },
      ],
      blocks: [
        {
          type: "media",
          media: m("checkout-experience", "01", 995, 550, "The cart surfacing personalised insights from order history"),
          caption:
            "Shopping cart reads a customer's order history and surfaces personalised insights the moment their items are selected.",
        },
        {
          type: "media",
          media: m("checkout-experience", "02", 995, 550, "The analysis panel comparing an order with spending habits"),
          caption:
            "The analysis panel compares the current order against spending habits and turns each into one-tap actions.",
        },
        {
          type: "media",
          media: m("checkout-experience", "03", 995, 550, "An AI assistant answering questions about orders"),
          caption:
            "An AI assistant that shoppers can ask plain-language questions based on their orders and shopping preferences.",
        },
      ],
    },
  },
];

export const projectBySlug = (slug: string | undefined) => projects.find((p) => p.slug === slug);

/* Prev / next wrap around: Refine ← → Checkout Experience. */
export function neighbours(slug: Slug) {
  const i = projects.findIndex((p) => p.slug === slug);
  const n = projects.length;
  return {
    index: i,
    total: n,
    prev: projects[(i - 1 + n) % n],
    next: projects[(i + 1) % n],
  };
}

/* The card is 995 × 521.49 and the cover 995 × 550 (home 373:2677 → project
   672:3013). The card shows the cover's media layer, clipped. */
export const CARD_RATIO = 995 / 521.49;
export const COVER_RATIO = 995 / 550;
