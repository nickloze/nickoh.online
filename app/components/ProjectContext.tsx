"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { neighbours, projectBySlug, type Slug } from "../lib/projects";

/* Which project is open, and how it got there.

   The URL is the only source of truth (`/work/<slug>`); everything visual —
   the card placeholder, the dissolve, the frozen feed, the project layer — is
   derived from it in the same render. Link navigation commits inside a React
   transition, so driving any of those from click state would let the card
   vanish a beat before the project mounts and break the shared-element
   handoff.

   `morph` names the one card that owns the handoff:
     open from the feed         morph = that card; its cover flies up
     prev / next                morph = none; the project layer crossfades,
                                and `gen` moves on so no card in the hidden
                                feed can hand a stale cover over later
     close, cover still seen    the cover flies back into its card
     close, scrolled deep       the project fades; the card is simply there
     deep link                  morph = the linked card (already a placeholder
                                from the server render), so closing still
                                flies back into it

   `gen` is folded into every layoutId (`cover-refine-3`): bumping it retires
   all pairings at once. */

export type Origin = "feed" | "nav" | "handoff" | "deeplink";
/* How the layer that is LEAVING should leave. The field is still `closeMode`
   — it is read by the exiting layer, whether it is leaving for the feed or
   for the next project. */
export type ExitMode = "morph" | "fade" | "handoff";
export type CloseMode = ExitMode;

type Session = {
  open: Slug | null;
  morph: Slug | null;
  gen: number;
  origin: Origin | null;
  /* how the last close runs — read by the exiting project layer */
  closeMode: CloseMode;
  /* opened from the feed in this tab, so "All work" can simply go back */
  fromFeed: boolean;
};

function advance(
  prev: Session,
  open: Slug | null,
  coverVisible: boolean,
  reduce: boolean,
  armed: Slug | null,
): Session {
  if (open === prev.open) return prev;
  if (open && !prev.open) {
    return {
      open,
      morph: reduce ? null : open,
      gen: reduce ? prev.gen + 1 : prev.gen,
      origin: "feed",
      closeMode: prev.closeMode,
      fromFeed: true,
    };
  }
  if (open && prev.open) {
    /* The next-project card is a NAV: it takes the nav shape exactly — morph
       null and a fresh gen — and inherits every property that path is already
       proven to have. All "handoff" adds is a y on each layer.

       closeMode is written explicitly rather than inherited through the
       spread. That also fixes a live bug: it used to ride along in `...prev`,
       so after any morph-close every later step kept closeMode "morph" and the
       exiting layer took ProjectView's `delay: DETAILS_OUT.duration` arm — a
       dead 150ms before it began to fade, on the most-travelled path here. */
    const handed = armed === open;
    return {
      ...prev,
      open,
      morph: null,
      gen: prev.gen + 1,
      origin: handed ? "handoff" : "nav",
      closeMode: handed ? "handoff" : "fade",
    };
  }
  const canMorph = !reduce && prev.morph === prev.open && coverVisible;
  return {
    open: null,
    morph: null,
    gen: canMorph ? prev.gen : prev.gen + 1,
    origin: null,
    closeMode: canMorph ? "morph" : "fade",
    fromFeed: false,
  };
}

type Ctx = Session & {
  /* the feed scroller and whichever project scroller is showing */
  feedRef: RefObject<HTMLElement | null>;
  projectRef: RefObject<HTMLElement | null>;
  /* the project scroller reports whether its cover can still be seen */
  setCoverVisible: (visible: boolean) => void;
  close: () => void;
  /* the plain step — prev / next and the arrow keys. Never arms a handoff. */
  go: (slug: Slug) => void;
  /* `go` plus the arm: the next-project card takes this path, so the layer it
     opens rises into place instead of flatly crossfading. */
  handoff: (slug: Slug) => void;
};

const ProjectContext = createContext<Ctx | null>(null);

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject outside <ProjectProvider>");
  return ctx;
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const params = useParams<{ slug?: string }>();
  const open = projectBySlug(params?.slug)?.slug ?? null;
  const router = useRouter();
  const reduce = useReducedMotion() ?? false;

  const feedRef = useRef<HTMLElement | null>(null);
  const projectRef = useRef<HTMLElement | null>(null);
  const coverVisibleRef = useRef(true);
  /* Which navigation, if any, the reader armed by pressing the next-project
     card. A MODIFIER on a transition the URL still
     triggers, never the trigger: it is matched against the new `open`, so an
     overtaken navigation degrades to the plain crossfade, and it is cleared
     on every transition below — an arm that never lands cannot survive to
     mark a later ordinary step as a handoff. */
  const pending = useRef<Slug | null>(null);

  /* Adjust-state-during-render: when the URL's project changes, the new
     session is computed and committed in this same render. */
  const [session, setSession] = useState<Session>(() => ({
    open,
    morph: open,
    gen: 0,
    origin: open ? "deeplink" : null,
    closeMode: "fade",
    fromFeed: false,
  }));
  let current = session;
  if (open !== session.open) {
    /* The project scroller reports whether its cover is still in view on
       every scroll, and the next-project card leaves an arm behind it; both
       are snapshots of the moment the transition begins. */
    // eslint-disable-next-line react-hooks/refs -- read once, at the transition
    current = advance(session, open, coverVisibleRef.current, reduce, pending.current);
    setSession(current);
  }

  /* A new project always starts with its cover in view and no arm left over.
     Cleared here rather than inside advance(), which runs during render and is
     double-invoked in StrictMode. */
  useEffect(() => {
    if (current.open) coverVisibleRef.current = true;
    pending.current = null;
  }, [current.open]);
  const setCoverVisible = useCallback((visible: boolean) => {
    coverVisibleRef.current = visible;
  }, []);

  const close = useCallback(() => {
    if (current.fromFeed) router.back();
    else router.push("/", { scroll: false });
  }, [current.fromFeed, router]);

  const go = useCallback(
    (slug: Slug) => router.replace(`/work/${slug}`, { scroll: false }),
    [router],
  );

  /* `replace`, never `push`: walking A → B → C stays one history entry, so
     pressing Back lands on the feed rather than on B. */
  const handoff = useCallback(
    (slug: Slug) => {
      pending.current = slug;
      router.replace(`/work/${slug}`, { scroll: false });
    },
    [router],
  );

  /* Keyboard and panel navigation should never stall on a fetch. */
  useEffect(() => {
    if (!current.open) return;
    const { prev, next } = neighbours(current.open);
    router.prefetch(`/work/${prev.slug}`);
    router.prefetch(`/work/${next.slug}`);
    router.prefetch("/");
  }, [current.open, router]);

  const value = useMemo<Ctx>(
    () => ({
      ...current,
      feedRef,
      projectRef,
      setCoverVisible,
      close,
      go,
      handoff,
    }),
    [current, setCoverVisible, close, go, handoff],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

/* layoutIds for the two layers that fly: the clipped cover box and the fixed
   995:550 media layer inside it. */
export const coverId = (slug: Slug, gen: number) => `cover-${slug}-${gen}`;
export const coverMediaId = (slug: Slug, gen: number) => `cover-media-${slug}-${gen}`;
