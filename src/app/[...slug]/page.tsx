import Page from "../page"
import { notFound } from "next/navigation"
import { findProjectBySlug } from "../data/projectsTimelineData"
import { findCareerBySlug } from "../data/timelineData"

type SlugPageProps = {
  params: Promise<{
    slug?: string[]
  }>
}

const ALLOWED_PATHS: Record<string, Set<string | undefined>> = {
  about: new Set([undefined, "certifications", "skills"]),
  projects: new Set([undefined, "projects", "repos"]),
  career: new Set([undefined, "experience", "education"]),
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug = [] } = await params

  const [section, subsection, ...rest] = slug.map((segment) => segment.toLowerCase())

  if (!section || rest.length > 0) {
    notFound()
  }

  const allowedSubsections = ALLOWED_PATHS[section]
  // /projects/<slug> and /career/<slug> open that entry's detail popup on the home page.
  const isDetail =
    (section === "projects" && findProjectBySlug(subsection) !== null) ||
    (section === "career" && findCareerBySlug(subsection) !== null)
  if (!allowedSubsections || (!allowedSubsections.has(subsection) && !isDetail)) {
    notFound()
  }

  return <Page />
}

