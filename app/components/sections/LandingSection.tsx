import { LANDING } from "../../lib/sections";
import SectionShell from "./SectionShell";

/** Section 1 — the landing intro: welcome heading and bio paragraph. */
export default function LandingSection() {
  return (
    <SectionShell>
      <div className="flex max-w-[270px] flex-col gap-5 md:max-w-[975px] xl:gap-5">
        <h1 className="fs-primary text-balance text-ink">{LANDING.heading}</h1>
        <p className="fs-primary text-muted">
          <span className="text-ink-soft">{LANDING.introLead}</span>
          {LANDING.introRest}
        </p>
      </div>
    </SectionShell>
  );
}
