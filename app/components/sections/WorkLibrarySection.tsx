import Link from "next/link";
import type { WorkProject } from "../../lib/sections";
import { IconLibrary } from "../ui/icons";
import TagPill from "../ui/TagPill";
import SectionShell from "./SectionShell";

/**
 * Sections 3 & 4 — a Work Library project card. The whole card links into the
 * project's detail page; reused per project via props. Mobile stacks the card
 * in a single column; desktop (md+, Figma 240:1514) sets a "Work Library"
 * label beside it in a centered row.
 */
export default function WorkLibrarySection({ project }: { project: WorkProject }) {
  return (
    <SectionShell>
      <div className="w-full md:flex md:items-center md:gap-[60px]">
        <div className="hidden shrink-0 items-center gap-1 md:flex">
          <IconLibrary className="h-8 w-8 text-muted" />
          <span className="fs-primary whitespace-nowrap text-muted">Work Library</span>
        </div>
        <Link
          href={`/work/${project.slug}`}
          aria-label={`Open the ${project.name} project`}
          className="-m-2 flex max-w-[273px] flex-col gap-7 rounded-2xl p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 md:max-w-[688px]"
        >
          <div className="flex flex-col gap-7">
            <div className="flex flex-col">
              <h2 className="fs-primary text-ink">{project.name}</h2>
              <p className="fs-primary text-muted">{project.subtitle}</p>
            </div>
            <p className="fs-primary text-ink">{project.description}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <TagPill key={tag} size="sm">
                {tag}
              </TagPill>
            ))}
          </div>
        </Link>
      </div>
    </SectionShell>
  );
}
