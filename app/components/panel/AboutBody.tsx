import { bio } from "../../lib/data";

/* Figma 414:3218 — EB Garamond 20px at 1512 (1.3889em of the 14.4px folder
   unit, so it scales with the folder), line-height normal: five 26px lines in
   the 146px box. White, italic runs for the accents.

   @mobile — `text-pretty`: on a phone the bio sits five rows deep in a box
   sized to the column, and text that renders a hair narrower than Figma's
   (another OS or font renderer) tips the last row into a lone "route". Pretty
   wrapping pulls a second word down instead; where nothing would be orphaned
   — the 402 frame, every width below it — the breaks are exactly Figma's. */
export default function AboutBody() {
  return (
    <p className="font-serif text-[1.3889em] leading-[1.3] text-fg text-pretty [word-break:break-word] tablet:text-wrap">
      {bio.map((s, i) => (
        <span key={i} className={s.italic ? "italic" : undefined}>
          {s.text}
        </span>
      ))}
    </p>
  );
}
