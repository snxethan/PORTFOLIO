"use client"

import React from "react"
import Image from "next/image"
import { FaChevronRight, FaRegCalendarAlt } from "react-icons/fa"
import type { TimelineItem } from "../../data/types"
import {
  badgeBaseClass,
  clickableTagChipClass,
  getItemBadge,
  getItemTags,
  getItemThumbnail,
  getItemTitle,
} from "./detailUi"

const MAX_CARD_TAGS = 6

interface DetailCardProps {
  item: TimelineItem
  /** DOM id, so other parts of the page can scroll to this card. */
  id?: string
  onOpen: () => void
  onTagClick?: (tag: string) => void
  /** Briefly outlines the card (e.g. after jumping here from a related link). */
  highlighted?: boolean
}

/**
 * Preview card for a project or career entry: optional image, title, dates,
 * a short summary and tags. The whole card opens the detail popup; the tags
 * stay separately clickable filters.
 *
 * A card full of tag buttons cannot itself be a <button> (buttons can't
 * nest), so the title holds the real button and its ::after stretches over
 * the card. Tags sit above that overlay with `relative z-10`.
 */
const DetailCard = ({ item, id, onOpen, onTagClick, highlighted = false }: DetailCardProps) => {
  const thumbnail = getItemThumbnail(item)
  const title = getItemTitle(item)
  const badge = getItemBadge(item)
  const tags = getItemTags(item)
  const visibleTags = tags.slice(0, MAX_CARD_TAGS)
  const hiddenTagCount = tags.length - visibleTags.length

  return (
    <article
      id={id}
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-none border bg-[#151515] text-left transition-[scale,transform,background-color,border-color,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.02] hover:bg-[#1c1c1c] hover:shadow-lg hover:shadow-red-600/25 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-red-600 ${
        highlighted ? "border-red-500 animate-card-highlight" : "border-[#333333] hover:border-red-600/50"
      }`}
    >
      {thumbnail && (
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden border-b border-[#333333] bg-[#0a0a0a]">
          <Image src={thumbnail} alt="" fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-[#dc2626]">
          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            className="text-left after:absolute after:inset-0 after:content-[''] focus:outline-none"
          >
            {title}
          </button>
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-400">
          <span className="inline-flex items-center gap-2">
            <FaRegCalendarAlt aria-hidden="true" className="shrink-0" />
            {item.startDate} – {item.endDate}
          </span>
          {badge && <span className={`${badgeBaseClass} ${badge.className}`}>{badge.label}</span>}
        </div>
        <p className="mt-3 line-clamp-3 text-sm text-gray-300">{item.summary}</p>

        {visibleTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visibleTags.map((tag) =>
              onTagClick ? (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagClick(tag)}
                  className={`${clickableTagChipClass} z-10`}
                >
                  {tag.toUpperCase()}
                </button>
              ) : (
                <span key={tag} className="inline-flex items-center rounded-full bg-[#3a3a3a] px-3 py-1 text-xs text-gray-300">
                  {tag.toUpperCase()}
                </span>
              )
            )}
            {hiddenTagCount > 0 && (
              <span className="inline-flex items-center px-1 text-xs text-gray-500">+{hiddenTagCount} more</span>
            )}
          </div>
        )}

        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-red-500 transition-colors group-hover:text-red-400">
          View details
          <FaChevronRight aria-hidden="true" className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  )
}

export default DetailCard
