import type { Ref } from "react";
import type { Project } from "../../lib/projects";

/* The block under the cover — Figma "Frame 71" (672:3019 and siblings).

   @desktop  title Inter Medium 36 · 64 · PROJECT / YEAR (Inter 16 at 70%) over
             the values (Inter 20), 4 apart · 30 · a 0.5px white rule · 30 ·
             the subtitle (Inter 20) bottom-aligned with the pills (#252525,
             Inter 16, 6 × 16 padding, 8 apart)
   @mobile   the same stack on a smaller scale; the pills drop under the
             subtitle
   @mobile (tablet) — the @desktop sizes

   The title is the page's <h1> and takes focus when a project opens. */
export default function ProjectHeader({
  project,
  titleRef,
}: {
  project: Project;
  titleRef?: Ref<HTMLHeadingElement>;
}) {
  const { page } = project;
  return (
    <header className="flex flex-col gap-[32px] tablet:gap-[64px]">
      <h1
        ref={titleRef}
        tabIndex={-1}
        className="font-sans text-[24px] leading-[normal] font-medium tracking-[-0.02em] outline-none tablet:text-[36px]"
      >
        {page.title}
      </h1>

      <div className="flex flex-col gap-[16px] tablet:gap-[30px]">
        <div className="flex flex-col gap-[4px] leading-[normal] tracking-[-0.02em] whitespace-nowrap">
          <div className="flex items-center justify-between text-[12px] text-meta tablet:text-[16px]">
            <span>PROJECT</span>
            <span>YEAR</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[15px] tablet:text-[20px]">
            <span className="truncate">{page.meta.project}</span>
            <span>{page.meta.year}</span>
          </div>
        </div>

        <hr className="h-[0.5px] border-0 bg-fg" />

        <div className="flex flex-col items-start gap-[12px] tablet:flex-row tablet:items-end tablet:justify-between tablet:gap-4">
          <p className="text-[15px] leading-[normal] tracking-[-0.02em] tablet:text-[20px]">{page.subtitle}</p>
          <ul className="flex flex-wrap gap-[8px]" aria-label="Tags">
            {page.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-pill px-[12px] py-[5px] text-[13px] leading-[normal] tracking-[-0.02em] whitespace-nowrap tablet:px-[16px] tablet:py-[6px] tablet:text-[16px]"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
