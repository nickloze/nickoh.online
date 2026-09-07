import { bio } from "../../lib/data";

/* Figma 414:3218 — EB Garamond 22, white, italic runs for the accents. */
export default function AboutBody() {
  return (
    <p className="font-serif text-[1.375em] leading-[1.318] text-fg [word-break:break-word]">
      {bio.map((s, i) => (
        <span key={i} className={s.italic ? "italic" : undefined}>
          {s.text}
        </span>
      ))}
    </p>
  );
}
