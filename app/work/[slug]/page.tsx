import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PetchCaseStudy from "../../components/PetchCaseStudy";
import ProjectDetail from "../../components/ProjectDetail";
import { WORK_PROJECTS, getProject } from "../../lib/sections";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return WORK_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return {
    title: project ? `${project.name} — Nicholas Koh` : "Nicholas Koh",
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  // Petch has a full four-screen case study; other projects fall back to the
  // generic detail layout until their frames land.
  if (project.slug === "petch") return <PetchCaseStudy />;
  return <ProjectDetail project={project} />;
}
