"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CONTACT, CV_FILE, SOCIAL_LINKS } from "../../lib/links";
import { IconChat, IconDoc, IconLibrary, IconMail } from "../ui/icons";
import IslandPopover, { type PopoverItem } from "./IslandPopover";

interface FloatingIslandProps {
  /** Key of the action to highlight with a pill, e.g. "work". */
  activeKey?: string | null;
  /** Invoked when the Work Library icon is tapped. */
  onWorkLibrary?: () => void;
}

/** The three icons that open a popover. */
type PopoverKey = "messages" | "resume" | "contact";

// @mobile/@desktop — icon scaled proportionally to the smaller island
// (Figma node 290:4964): the 24px button keeps the prior icon:button ratio.
const ICON_CLASS = "h-[16.667px] w-[16.667px]";

const SOCIAL_ITEMS: PopoverItem[] = SOCIAL_LINKS.map((link) => ({
  label: link.label,
  href: link.href,
  kind: "external",
}));

const RESUME_ITEMS: PopoverItem[] = [
  { label: "Download my CV", href: CV_FILE, kind: "download" },
];

const CONTACT_ITEMS: PopoverItem[] = [
  { label: "WhatsApp", href: `https://wa.me/${CONTACT.whatsapp}`, kind: "external" },
  { label: "Email", href: `mailto:${CONTACT.email}`, kind: "mail" },
];

interface PopoverAction {
  key: PopoverKey;
  /** Accessible label for the trigger button. */
  label: string;
  icon: ReactNode;
  /** Accessible name for the popover itself. */
  popoverLabel: string;
  items: PopoverItem[];
  /**
   * "menu" toggles open/closed on each click. "prompt" only opens on click,
   * and also opens on hover (@desktop) — it closes by pointer-away, an outside
   * tap, or Escape.
   */
  behavior: "menu" | "prompt";
}

const POPOVER_ACTIONS: PopoverAction[] = [
  {
    key: "messages",
    label: "Messages",
    icon: <IconChat className={ICON_CLASS} />,
    popoverLabel: "Social links",
    items: SOCIAL_ITEMS,
    behavior: "menu",
  },
  {
    key: "resume",
    label: "Résumé",
    icon: <IconDoc className={ICON_CLASS} />,
    popoverLabel: "Download CV",
    items: RESUME_ITEMS,
    behavior: "prompt",
  },
  {
    key: "contact",
    label: "Contact",
    icon: <IconMail className={ICON_CLASS} />,
    popoverLabel: "Contact",
    items: CONTACT_ITEMS,
    behavior: "menu",
  },
];

/** Active / idle styling for an island icon button. The active pill matches
 *  the Figma selected state (node 274:3766): a `dot`-grey circle. */
const buttonClassName = (active: boolean) =>
  `flex h-[24px] w-[24px] items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 ${
    active ? "bg-dot text-ink-soft" : "text-muted hover:bg-black/[0.04]"
  }`;

/**
 * The persistent floating island of quick actions. It lives outside the
 * section cross-fade, so it never moves between sections. The Work Library
 * icon navigates the deck; Messages, Résumé and Contact each open a popover
 * and take the Figma selected state while their popover is open.
 */
export default function FloatingIsland({ activeKey, onWorkLibrary }: FloatingIslandProps) {
  const [openMenu, setOpenMenu] = useState<PopoverKey | null>(null);
  // Hover-to-open is @desktop only — @mobile is tap-only (no hover logic).
  const [hoverCapable, setHoverCapable] = useState(false);
  const islandRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Partial<Record<PopoverKey, HTMLButtonElement | null>>>({});
  const popoverBaseId = useId();

  useEffect(() => {
    setHoverCapable(window.matchMedia("(hover: hover)").matches);
  }, []);

  // While a popover is open, dismiss it on an outside pointer or Escape.
  useEffect(() => {
    if (!openMenu) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!islandRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      triggerRefs.current[openMenu]?.focus();
      setOpenMenu(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  return (
    <div
      ref={islandRef}
      role="group"
      aria-label="Quick actions"
      className="fixed bottom-[calc(22px+env(safe-area-inset-bottom))] left-1/2 z-30 flex -translate-x-1/2 items-center rounded-[21.333px] bg-surface p-[8px] md:bottom-auto md:top-[75%] md:-translate-y-1/2"
    >
      {/* Work Library — navigates the deck; never opens a popover. */}
      <button
        type="button"
        aria-label="Work Library"
        aria-current={activeKey === "work" ? "true" : undefined}
        onClick={() => {
          setOpenMenu(null);
          onWorkLibrary?.();
        }}
        className={buttonClassName(activeKey === "work")}
      >
        <IconLibrary className={ICON_CLASS} />
      </button>

      {/* Messages, Résumé, Contact — each opens a popover above its icon. */}
      {POPOVER_ACTIONS.map((action) => {
        const isOpen = openMenu === action.key;
        const popoverId = `${popoverBaseId}-${action.key}`;
        // @desktop — the Résumé prompt also opens on hover.
        const useHover = action.behavior === "prompt" && hoverCapable;

        return (
          <div
            key={action.key}
            className="relative"
            onMouseEnter={useHover ? () => setOpenMenu(action.key) : undefined}
            onMouseLeave={
              useHover
                ? () => setOpenMenu((prev) => (prev === action.key ? null : prev))
                : undefined
            }
          >
            <button
              ref={(el) => {
                triggerRefs.current[action.key] = el;
              }}
              type="button"
              aria-label={action.label}
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              aria-controls={isOpen ? popoverId : undefined}
              onClick={() => {
                if (action.behavior === "prompt") {
                  setOpenMenu(action.key);
                } else {
                  setOpenMenu((prev) => (prev === action.key ? null : action.key));
                }
              }}
              className={buttonClassName(isOpen)}
            >
              {action.icon}
            </button>

            {isOpen && (
              <IslandPopover
                id={popoverId}
                label={action.popoverLabel}
                items={action.items}
                onSelect={() => setOpenMenu(null)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
