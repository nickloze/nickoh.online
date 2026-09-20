"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import type { Media } from "../../lib/projects";
import { VIDEO_IN } from "../../motion/project";

/* One media slot: the still underneath, the looping video on top.

   The video never autoplays by attribute — `useVideoPlayback` decides which
   one runs, from where the reader has scrolled to. It is muted and inline (so
   iOS lets it play), fetched only when it is near (`preload="none"` until
   then), and fades in over the still once it is actually running, so a
   blocked or slow video simply leaves the still showing.

   Cards and project covers share one file. So that the cover never snaps
   back to frame 0 as it flies up (or the card as it flies back), the frame
   on screen is handed over: the leaving video's current frame is drawn to a
   canvas under the arriving one, which seeks to the same time before it
   fades in. */

type Handoff = { time: number; canvas: HTMLCanvasElement };
const handoffs = new Map<string, Handoff>();

function drawFrame(v: HTMLVideoElement): Handoff | null {
  if (v.readyState < 2 || !v.videoWidth) return null;
  const scale = Math.min(1, 1200 / v.videoWidth);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(v.videoWidth * scale);
  canvas.height = Math.round(v.videoHeight * scale);
  try {
    canvas.getContext("2d")?.drawImage(v, 0, 0, canvas.width, canvas.height);
  } catch {
    return null;
  }
  canvas.className = "absolute inset-0 size-full object-cover";
  canvas.setAttribute("aria-hidden", "true");
  return { time: v.currentTime, canvas };
}

/* Called on a card's click, before the route commits and the card's video
   is swapped out for its placeholder. */
export function captureFrame(key: string, within: Element | null) {
  const v = within?.querySelector<HTMLVideoElement>(`video[data-handoff="${key}"]`);
  const frame = v && drawFrame(v);
  if (frame) handoffs.set(key, frame);
}

/* The arriving video takes a captured frame, or — closing, when the project
   layer is still on its way out — reads it straight off the leaving video. */
function takeFrame(key: string, self: HTMLVideoElement): Handoff | null {
  const kept = handoffs.get(key);
  if (kept) {
    handoffs.delete(key);
    return kept;
  }
  for (const v of document.querySelectorAll<HTMLVideoElement>(`video[data-handoff="${key}"]`)) {
    if (v !== self) return drawFrame(v);
  }
  return null;
}

export default function LoopVideo({
  media,
  sizes,
  priority = false,
  handoff,
}: {
  media: Media;
  sizes: string;
  priority?: boolean;
  /* covers and cards pass their slug so the frame carries across */
  handoff?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const frameSlot = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const v = video.current;
    const slot = frameSlot.current;
    if (!handoff || !v || !slot) return;
    const frame = takeFrame(handoff, v);
    if (!frame) return;
    slot.appendChild(frame.canvas);
    v.preload = "auto";
    const seek = () => {
      v.currentTime = frame.time;
    };
    if (v.readyState >= 1) seek();
    else v.addEventListener("loadedmetadata", seek, { once: true });
    return () => {
      v.removeEventListener("loadedmetadata", seek);
      frame.canvas.remove();
    };
  }, [handoff]);

  const reveal = () => {
    const v = video.current;
    if (v && !v.paused && !v.seeking) setReady(true);
  };

  return (
    <div className="absolute inset-0">
      <Image src={media.still} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
      <div ref={frameSlot} className="absolute inset-0" />
      {media.src ? (
        <video
          ref={video}
          src={media.src}
          data-loop-video
          data-handoff={handoff}
          muted
          playsInline
          loop
          preload="none"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={reveal}
          onSeeked={reveal}
          className="absolute inset-0 size-full object-cover"
          style={{ opacity: ready ? 1 : 0, transition: `opacity ${VIDEO_IN.duration}s` }}
        />
      ) : null}
    </div>
  );
}
