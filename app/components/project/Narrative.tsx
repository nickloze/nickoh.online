import { Fragment } from "react";
import type { Project } from "../../lib/projects";

/* The story — Figma "Frame 81" (720:13357 and siblings).

   @desktop  lede Inter Medium 34 · 120 · then for each row: a 0.5px rule at
             50% · 45 · the row. A row is a 122px label column (Geist Mono
             Light 18) beside the heading (Inter SemiBold 26, trimmed to cap
             height) and, 20 below, the body (Inter 20 / 1.4). Figma spaces the
             two rows' columns 48 and 39 apart, landing them 1px out of line;
             the fixed column keeps them aligned.
   @mobile   label above its text, smaller scale
   @mobile (tablet) — the @desktop layout */
export default function Narrative({ project }: { project: Project }) {
  const { page } = project;
  return (
    <section className="flex flex-col gap-[56px] tablet:gap-[120px]" aria-label="Overview">
      <p className="text-[22px] leading-[normal] font-medium tracking-[-0.02em] tablet:text-[34px]">
        {page.lede}
      </p>

      <div className="flex flex-col gap-[24px] tablet:gap-[45px]">
        {page.rows.map((row) => (
          <Fragment key={row.label}>
            <hr className="h-[0.5px] border-0 bg-fg/50" />
            <div className="flex flex-col gap-[12px] tablet:flex-row tablet:gap-0">
              <p className="font-mono text-[12px] leading-[normal] font-light tracking-[-0.02em] tablet:w-[122px] tablet:shrink-0 tablet:text-[18px]">
                {row.label}
              </p>
              <div className="flex min-w-0 flex-1 flex-col gap-[12px] tablet:gap-[20px]">
                <h2 className="text-trim text-[18px] leading-[normal] font-semibold tracking-[-0.02em] tablet:text-[26px]">
                  {row.heading}
                </h2>
                <p className="text-[16px] leading-[1.45] tracking-[-0.02em] tablet:text-[20px] tablet:leading-[1.4]">
                  {row.body}
                </p>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
