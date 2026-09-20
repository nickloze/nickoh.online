import type { Metadata } from "next";
import { projectBySlug, projects } from "../../../lib/projects";

/* `/work/<slug>` — one project, opened over the feed by the Shell in the
   (site) layout. This page only names the route: four static pages, no others
   (an unknown slug is a 404), each with its own title and share card. */

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  const { card, page, cover } = project;
  const url = `/work/${project.slug}`;
  return {
    title: card.client,
    description: page.lede,
    alternates: { canonical: url },
    /* A child's openGraph replaces the root's whole block, so every field is
       set here — otherwise a shared project link would preview as the home
       page. */
    openGraph: {
      title: `${card.client} — ${page.title}`,
      description: page.lede,
      url,
      siteName: "nickoh.online",
      type: "article",
      images: [{ url: cover.still, width: 1990, height: 1100, alt: cover.alt }],
    },
  };
}

export default function ProjectPage() {
  return null;
}
