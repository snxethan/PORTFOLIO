"use client"

import React from "react"
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa"
import { IconType } from "react-icons"
import TooltipWrapper from "./ToolTipWrapper"
import { useExternalLink } from "./ExternalLinkHandler"
import MediaGallery from "./MediaGallery"
import type { TimelineItem, TimelineLink, TimelineLinkIcon } from "../data/types"

export type { TimelineItem, TimelineLink, TimelineLinkIcon }

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

export const badgeBaseClass = "text-xs font-semibold px-2 py-1 rounded-none"
export const clickableBadgeClass =
  "cursor-pointer transition-shadow duration-200 hover:shadow-lg hover:shadow-red-600/30 hover:ring-1 hover:ring-red-600"

export const tagChipClass =
  "inline-flex max-w-full shrink-0 items-center overflow-hidden box-border bg-[#3a3a3a] text-gray-300 text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors duration-200 border border-transparent"
export const clickableTagChipClass = `${tagChipClass} cursor-pointer hover:bg-[#444444] hover:border-red-600 hover:text-[#dc2626]`

export const linkButtonClass =
  "inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"

interface TimelineCardProps {
  item: TimelineItem
  onTagClick?: (tag: string) => void
}

/**
 * Full card for an experience or education entry. Fills its slot in a
 * CardCollection (`h-full`), so every card in a section matches the tallest.
 */
const TimelineCard = ({ item, onTagClick }: TimelineCardProps) => {
  const { handleExternalClick } = useExternalLink()
  const title = item.institution || item.name || "Timeline Item"
  const links = getTimelineLinks(item)
  const displayTags = Array.from(new Set([...(item.topics ?? []), ...(item.tags ?? [])]))

  return (
    <article className="group flex h-full flex-col overflow-hidden bg-[#151515] hover:bg-[#1c1c1c] p-6 rounded-none border border-[#333333] hover:border-red-600/50 transition-colors duration-300 hover:shadow-lg hover:shadow-red-600/20">
      <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-[#dc2626] transition-colors duration-300">
        {title}
      </h3>

      <div className="flex flex-wrap items-center gap-3 mb-4 text-gray-400">
        <span>
          {item.startDate} to {item.endDate}
        </span>
        {item.location && (
          <>
            <span className="text-gray-600">•</span>
            <span
              onClick={onTagClick ? () => onTagClick(item.location ?? "") : undefined}
              className={`${badgeBaseClass} ${getLocationTagClass(item.location)} ${onTagClick ? clickableBadgeClass : ""}`}
            >
              {item.location}
            </span>
          </>
        )}
        {item.language && (
          <>
            <span className="text-gray-600">•</span>
            <span
              onClick={onTagClick ? () => onTagClick(item.language ?? "") : undefined}
              className={`${badgeBaseClass} ${getLanguageTagClass(item.language)} ${onTagClick ? clickableBadgeClass : ""}`}
            >
              {item.language}
            </span>
          </>
        )}
      </div>

      {item.highlights.length > 0 && (
        <ul className="list-disc list-inside mb-4 text-gray-400 space-y-1">
          {item.highlights.map((highlight, i) => (
            <li key={i}>{highlight}</li>
          ))}
        </ul>
      )}

      <p className="text-gray-300 mb-4">{item.summary}</p>

      {item.images && item.images.length > 0 && (
        <div className="mb-4">
          <MediaGallery images={item.images} title={title} />
        </div>
      )}

      {displayTags.length > 0 && (
        <div className="mb-4 flex w-full min-w-0 max-w-full flex-wrap gap-1.5">
          {displayTags.map((tag) =>
            onTagClick ? (
              <button type="button" key={tag} onClick={() => onTagClick(tag)} className={clickableTagChipClass}>
                {tag.toUpperCase()}
              </button>
            ) : (
              <span key={tag} className={tagChipClass}>
                {tag.toUpperCase()}
              </span>
            )
          )}
        </div>
      )}

      {links.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-3">
          {links.map((link) => {
            const LinkIcon = link.icon ? linkIconMap[link.icon] : FaExternalLinkAlt
            return (
              <TooltipWrapper key={link.url} label={link.url}>
                <button type="button" onClick={() => handleExternalClick(link.url, true)} className={linkButtonClass}>
                  {link.label}
                  <LinkIcon className="text-sm" />
                </button>
              </TooltipWrapper>
            )
          })}
        </div>
      )}
    </article>
  )
}

export default TimelineCard

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
