"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** After a section change, input stays locked while the gesture — including
 *  trackpad momentum — plays out, then releases this many ms after it goes
 *  quiet. Short enough that the lock is filled by the visible cross-fade with
 *  no dead "lag" time, long enough that one gesture moves exactly one section. */
const RELEASE_DELAY_MS = 140;
/** Minimum wheel delta to count as intent — filters trackpad jitter. */
const WHEEL_THRESHOLD = 20;
/** Minimum vertical travel for a touch swipe to count, in px. */
const SWIPE_THRESHOLD = 40;

/**
 * Paginated section navigation. One wheel gesture, swipe, or arrow/page key
 * advances exactly one section: input locks on the change and stays locked
 * while the gesture's momentum plays out, then releases promptly — so the pace
 * is steady and deliberate without feeling unresponsive. Dot clicks jump
 * immediately.
 */
export function useSectionNavigation(count: number, paused = false) {
  const [activeIndex, setActiveIndex] = useState(0);
  /** +1 when advancing to a later section, -1 when going back. */
  const [direction, setDirection] = useState(1);
  const activeRef = useRef(0);
  const lockedRef = useRef(false);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Mirrors the `paused` arg so the window listeners can read it live.
   *  While paused (e.g. the title card is playing) all input is ignored. */
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  /** (Re)arm the unlock — called on every input event so the lock outlasts a
   *  gesture's momentum, then releases RELEASE_DELAY_MS after it goes quiet. */
  const armRelease = useCallback(() => {
    if (unlockTimer.current) clearTimeout(unlockTimer.current);
    unlockTimer.current = setTimeout(() => {
      lockedRef.current = false;
    }, RELEASE_DELAY_MS);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(count - 1, index));
      if (next === activeRef.current) return;
      setDirection(next > activeRef.current ? 1 : -1);
      activeRef.current = next;
      lockedRef.current = true;
      setActiveIndex(next);
      armRelease();
    },
    [count, armRelease],
  );

  useEffect(() => {
    const step = (delta: number) => goTo(activeRef.current + delta);

    const onWheel = (e: WheelEvent) => {
      if (pausedRef.current) return;
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      if (lockedRef.current) {
        armRelease(); // keep the lock alive until the gesture truly settles
        return;
      }
      step(e.deltaY > 0 ? 1 : -1);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (pausedRef.current) return;
      let delta = 0;
      let target = -1;
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
          delta = 1;
          break;
        case "ArrowUp":
        case "PageUp":
          delta = -1;
          break;
        case "Home":
          target = 0;
          break;
        case "End":
          target = count - 1;
          break;
        default:
          return;
      }
      e.preventDefault();
      if (lockedRef.current) {
        armRelease();
        return;
      }
      if (target >= 0) goTo(target);
      else step(delta);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (pausedRef.current) return;
      if (lockedRef.current) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < SWIPE_THRESHOLD) return;
      step(delta > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [goTo, armRelease, count]);

  useEffect(() => {
    return () => {
      if (unlockTimer.current) clearTimeout(unlockTimer.current);
    };
  }, []);

  return { activeIndex, direction, goTo };
}
