import type { Block, Media } from "../../lib/projects";
import LoopVideo from "../media/LoopVideo";

/* The gallery — Figma "Frame 97" / "Frame 77" / "Frame 93".

   @desktop  blocks 72 apart. A media block is the video (8px radius) with,
             24 below, an optional 34px title (Refine) and a 16px caption
             trimmed to cap height. Petch adds its row of three phones on the
             page (272 × 561.5, 42 apart, centred), a second 34px paragraph
             with 120 either side, and a pair of half-width videos 24 apart.
   @mobile   blocks 40 apart; the pair stacks; the phones become a row you
             swipe through, bleeding to the screen edges
   @mobile (tablet) — the @desktop layout; the phone row scales to fit

   Each media element is a play group (useVideoPlayback). The pair and the
   phones share a group name, so they play together while side by side. */

const WIDE = "(min-width: 64rem) 995px, (min-width: 48rem) calc(100vw - 80px), calc(100vw - 31px)";
const HALF = "(min-width: 64rem) 486px, (min-width: 48rem) calc(50vw - 52px), calc(100vw - 31px)";
const PHONE = "(min-width: 64rem) 272px, (min-width: 48rem) 28vw, 62vw";

function Frame({ media, sizes, group }: { media: Media; sizes: string; group?: string }) {
  return (
    <figure
      data-play-group={group ?? ""}
      aria-label={media.alt}
      className="relative w-full overflow-hidden rounded-[var(--radius-card-mobile)] bg-white/[0.03] tablet:rounded-card"
      style={{ aspectRatio: `${media.w} / ${media.h}` }}
    >
      <LoopVideo media={media} sizes={sizes} />
    </figure>
  );
}

function MediaBlock({ block }: { block: Extract<Block, { type: "media" }> }) {
  return (
    <div className="flex flex-col">
      <Frame media={block.media} sizes={WIDE} />
      {block.title ? (
        <h3 className="mt-[16px] text-[20px] leading-[normal] font-medium tracking-[-0.02em] tablet:mt-[24px] tablet:text-[34px]">
          {block.title}
        </h3>
      ) : null}
      {block.caption ? (
        <p className="text-trim mt-[14px] text-[14px] leading-[normal] tracking-[-0.02em] tablet:mt-[24px] tablet:text-[16px]">
          {block.caption}
        </p>
      ) : null}
    </div>
  );
}

function Phones({ items }: { items: Media[] }) {
  return (
    /* @mobile — the row scrolls sideways and bleeds past the 36 / 35 margins */
    <div
      data-hscroll
      className="scrollbar-hidden -mx-[var(--spacing-mobile-left)] flex snap-x snap-mandatory gap-[16px] overflow-x-auto overscroll-x-contain px-[var(--spacing-mobile-left)] tablet:mx-auto tablet:w-full tablet:max-w-[900px] tablet:snap-none tablet:justify-center tablet:gap-[4.674%] tablet:overflow-visible tablet:px-0"
    >
      {items.map((media, i) => (
        <figure
          key={i}
          data-play-group="phones"
          aria-label={media.alt}
          className="relative w-[62%] shrink-0 snap-center tablet:w-auto tablet:flex-1 tablet:shrink"
          style={{ aspectRatio: `${media.w} / ${media.h}` }}
        >
          <LoopVideo media={media} sizes={PHONE} />
        </figure>
      ))}
    </div>
  );
}

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <section className="flex flex-col gap-[40px] tablet:gap-[72px]" aria-label="Gallery">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "media":
            return <MediaBlock key={i} block={block} />;
          case "phones":
            return <Phones key={i} items={block.items} />;
          case "statement":
            return (
              <p
                key={i}
                className="my-[16px] text-[22px] leading-[normal] font-medium tracking-[-0.02em] tablet:my-[48px] tablet:text-[34px]"
              >
                {block.text}
              </p>
            );
          case "pair":
            return (
              <div key={i} className="flex flex-col gap-[16px] tablet:flex-row tablet:gap-[24px]">
                {block.items.map((media, j) => (
                  <Frame key={j} media={media} sizes={HALF} group="pair" />
                ))}
              </div>
            );
        }
      })}
    </section>
  );
}
