import { FaExternalLinkAlt, FaGithub } from "react-icons/fa"
import { IconType } from "react-icons"
import type { TimelineItem, TimelineLink, TimelineLinkIcon } from "../../data/types"

/** Shared look-and-feel helpers for project and career cards/popups. */

export const linkIconMap: Record<TimelineLinkIcon, IconType> = {
  external: FaExternalLinkAlt,
  github: FaGithub,
  website: FaExternalLinkAlt,
}

/** Combines the deprecated single `url` with the `links` array. */
export const getTimelineLinks = (item: TimelineItem): TimelineLink[] => [
  ...(item.url ? [{ url: item.url, label: "View Project", icon: "external" as const }] : []),
  ...(item.links ?? []),
]

export const getItemTitle = (item: TimelineItem) => item.name ?? item.institution ?? "Untitled"

export const getItemTags = (item: TimelineItem) =>
  Array.from(new Set([...(item.tags ?? []), ...(item.topics ?? [])]))

export const getItemThumbnail = (item: TimelineItem) => item.thumbnail ?? item.images?.[0]

export const badgeBaseClass = "text-xs font-semibold px-2 py-1 rounded-none"

// Tag chips keep a small hover "pop"; it only grows, so the chip never moves
// out from under the pointer and clicks always land.
export const tagChipClass =
  "relative inline-flex max-w-full shrink-0 items-center overflow-hidden box-border bg-[#3a3a3a] text-gray-300 text-xs px-3 py-1 rounded-full whitespace-nowrap border border-transparent"
export const clickableTagChipClass = `${tagChipClass} cursor-pointer transition-[scale,transform,color,background-color,border-color] duration-200 hover:scale-105 hover:bg-[#444444] hover:border-red-600 hover:text-[#dc2626] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600`

export const linkButtonClass =
  "inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"

export const getLocationTagClass = (location: string) => {
  const normalized = location.toLowerCase()
  if (normalized.includes("remote")) {
    return "bg-blue-600 text-white border border-blue-500"
  }
  if (normalized.includes("hybrid")) {
    return "bg-purple-600 text-white border border-purple-500"
  }
  if (normalized.includes("research") || normalized.includes("dev")) {
    return "bg-orange-500 text-white border border-orange-500"
  }
  return "bg-green-600 text-white border border-green-500"
}

export const getLanguageTagClass = (language: string) => {
  const normalized = language.toLowerCase()
  if (normalized.includes("research") || normalized.includes("dev")) {
    return "bg-orange-500 text-white border border-orange-500"
  }
  switch (normalized) {
    case "typescript":
      return "bg-blue-600 text-white border border-blue-500"
    case "javascript":
      return "bg-yellow-500 text-white border border-yellow-500"
    case "python":
      return "bg-emerald-600 text-white border border-emerald-500"
    case "java":
      return "bg-orange-500 text-white border border-orange-500"
    case "c#":
      return "bg-purple-600 text-white border border-purple-500"
    case "c++":
      return "bg-sky-600 text-white border border-sky-500"
    case "go":
      return "bg-cyan-500 text-white border border-cyan-500"
    case "rust":
      return "bg-amber-600 text-white border border-amber-500"
    default:
      return "bg-[#333333] text-white"
  }
}

/** Language badge for projects, location badge for career entries. */
export const getItemBadge = (item: TimelineItem) => {
  if (item.language) return { label: item.language, className: getLanguageTagClass(item.language) }
  if (item.location) return { label: item.location, className: getLocationTagClass(item.location) }
  return null
}
