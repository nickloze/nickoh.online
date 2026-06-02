/* Production replacement for the handoff's <image-slot> web component.
   The prototype let the user drop images into slots persisted in a sidecar; in
   the real site those images live in /public/work and are served through
   next/image (auto WebP/AVIF + responsive srcset). The slot box keeps the
   prototype's #141414 letterbox + 8px radius so framing is identical. */

import Image from "next/image";
import type { CSSProperties } from "react";
import { SLOT_IMAGES } from "../../lib/data";

export default function SlotImage({
  slotId,
  alt,
  fit = "cover",
  sizes = "100vw",
  style,
}: {
  slotId: string;
  alt: string;
  fit?: "cover" | "contain";
  sizes?: string;
  style?: CSSProperties;
}) {
  const src = SLOT_IMAGES[slotId];
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#141414",
        borderRadius: 8,
        ...style,
      }}
    >
      {src && <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: fit }} />}
    </div>
  );
}
