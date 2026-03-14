import Page from "../page"
import { notFound } from "next/navigation"

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
  if (!allowedSubsections || !allowedSubsections.has(subsection)) {
    notFound()
  }

  return <Page />
}

