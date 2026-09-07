import { availability } from "../../lib/data";

/* Figma 457:2613 — a soft green dot and "Available for Work" at 22px, with
   "for" in EB Garamond italic. @desktop only; the mobile frame has no such
   row. */
export default function Availability() {
  return (
    <p className="flex items-center gap-2 text-[22px] leading-[29px] text-fg">
      <span
        aria-hidden="true"
        className="size-4 shrink-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, var(--color-available) 0%, rgba(106, 255, 0, 0) 100%)",
        }}
      />
      <span>
        {availability.map((s, i) => (
          <span key={i} className={s.italic ? "font-serif italic" : "font-sans"}>
            {s.text}
          </span>
        ))}
      </span>
    </p>
  );
}
