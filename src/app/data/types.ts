/**
 * Shared shapes for timeline-style content (projects, experience, education).
 *
 * These live in the data layer rather than in a component file so server code
 * (e.g. the slug allowlist in `[...slug]/page.tsx`) can import them without
 * pulling in a client component module.
 */

export type TimelineLinkIcon = "external" | "github" | "website"

export interface TimelineLink {
  url: string
  label: string
  icon?: TimelineLinkIcon
}

export interface TimelineItem {
  type?: "experience" | "education" | "project"
  institution?: string
  name?: string // For projects
  location?: string
  startDate: string
  endDate: string | "Present"
  highlights: string[]
  summary: string
  isCSRelated?: boolean
  language?: string // For projects
  topics?: string[] // For projects
  url?: string // For projects (deprecated - use links array)
  tags?: string[] // Tags for filtering
  links?: TimelineLink[] // Multiple links
  images?: string[] // Gallery images, shown in the project detail popup
  /** Card thumbnail for projects. Falls back to the first gallery image. */
  thumbnail?: string
  /** Project detail popup: the problem or motivation behind the project. */
  why?: string
  /** Project detail popup: how it was built. Falls back to `highlights`. */
  how?: string[]
  /** Career entries: slugs of projects built in this role or program. */
  relatedProjects?: string[]
  /** Career entries: shown when the "Computer Science" focus applies. */
  csRelated?: boolean
}
