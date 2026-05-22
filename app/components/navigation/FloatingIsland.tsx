"use client";

import type { ReactNode } from "react";
import { IconChat, IconDoc, IconLibrary, IconMail } from "../ui/icons";

interface FloatingIslandProps {
  /** Key of the action to highlight with a pill, e.g. "work". */
  activeKey?: string | null;
  /** Invoked when the Work Library icon is tapped. */
  onWorkLibrary?: () => void;
}

interface IslandAction {
  key: string;
  label: string;
  icon: ReactNode;
}

// @mobile/@desktop — icon scaled proportionally to the smaller island
// (Figma node 290:4964): the 24px button keeps the prior icon:button ratio.
const ICON_CLASS = "h-[16.667px] w-[16.667px]";

/**
 * The persistent floating island of quick actions. It lives outside the
 * section cross-fade, so it never moves between sections. The Work Library
 * icon is wired up; the remaining destinations are still {TODO}.
 */
export default function FloatingIsland({ activeKey, onWorkLibrary }: FloatingIslandProps) {
  const actions: (IslandAction & { onClick?: () => void })[] = [
    { key: "work", label: "Work Library", icon: <IconLibrary className={ICON_CLASS} />, onClick: onWorkLibrary },
    { key: "messages", label: "Messages", icon: <IconChat className={ICON_CLASS} /> },
    { key: "resume", label: "Résumé", icon: <IconDoc className={ICON_CLASS} /> },
    { key: "contact", label: "Contact", icon: <IconMail className={ICON_CLASS} /> },
  ];

  return (
    <div
      role="group"
      aria-label="Quick actions"
      className="fixed bottom-[calc(22px+env(safe-area-inset-bottom))] left-1/2 z-30 flex -translate-x-1/2 items-center rounded-[21.333px] bg-surface p-[8px] md:bottom-auto md:top-[75%] md:-translate-y-1/2"
    >
      {actions.map((action) => {
        const isActive = action.key === activeKey;
        return (
          <button
            key={action.key}
            type="button"
            aria-label={action.label}
            aria-current={isActive ? "true" : undefined}
            onClick={action.onClick}
            className={`flex h-[24px] w-[24px] items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 ${
              isActive ? "bg-dot text-ink-soft" : "text-muted hover:bg-black/[0.04]"
            }`}
          >
            {action.icon}
          </button>
        );
      })}
    </div>
  );
}
