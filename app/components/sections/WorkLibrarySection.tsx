import Link from "next/link";
import type { WorkProject } from "../../lib/sections";
import TagPill from "../ui/TagPill";
import SectionShell from "./SectionShell";

/**
 * Sections 3 & 4 — a Work Library project card. The whole card is a link into
 * the project's detail page. Reused per project via props.
 */
export default function WorkLibrarySection({ project }: { project: WorkProject }) {
  return (
    <SectionShell>
      <Link
        href={`/work/${project.slug}`}
        aria-label={`Open the ${project.name} project`}
        className="-m-2 flex max-w-[273px] flex-col gap-7 rounded-2xl p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
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
    </SectionShell>
  );
}
