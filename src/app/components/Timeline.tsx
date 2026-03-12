"use client"

import React, { useState, useEffect } from "react"
import { FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaGithub } from "react-icons/fa"
import { X } from "lucide-react"
import TooltipWrapper from "./ToolTipWrapper"
import Image from "next/image"
import { createPortal } from "react-dom"
import { IconType } from "react-icons"

export type TimelineLinkIcon = "external" | "github" | "website"

interface TimelineLink {
  url: string
  label: string
  icon?: TimelineLinkIcon
}

const linkIconMap: Record<TimelineLinkIcon, IconType> = {
  external: FaExternalLinkAlt,
  github: FaGithub,
  website: FaExternalLinkAlt,
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
  images?: string[] // Multiple images with carousel support
}

interface TimelineProps {
  items: TimelineItem[]
  type?: "experience" | "education" | "project"
  compact?: boolean
  showAllContent?: boolean
  animatingItems?: Set<string>
  disappearingItems?: Set<string>
  onTagClick?: (tag: string) => void
  showLine?: boolean
}

// Image Carousel Component
const ImageCarousel: React.FC<{ images: string[]; title: string }> = ({
  images,
  title,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const hasMultipleImages = images.length > 1

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isExpanded) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isExpanded])

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <div className="relative mt-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            setIsExpanded(true)
          }
        }}
        className="relative w-full h-48 sm:h-56 md:h-64 bg-[#0a0a0a] rounded-lg overflow-hidden cursor-pointer"
        aria-label={`Expand ${title} images`}
      >
        <Image
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-contain"
        />

        {/* Carousel Controls */}
        {hasMultipleImages && (
          <>
            <button
              onClick={(event) => {
                event.stopPropagation()
                prevImage()
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation()
                nextImage()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>

            {/* Image indicator dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(event) => {
                    event.stopPropagation()
                    setCurrentIndex(i)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex
                      ? "bg-red-600 w-6"
                      : "bg-gray-400 hover:bg-gray-300"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Image counter */}
      {hasMultipleImages && (
        <p className="text-center text-gray-500 text-sm mt-2">
          Image {currentIndex + 1} of {images.length}
        </p>
      )}

      {isExpanded && isMounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-0 sm:p-4"
          onClick={() => setIsExpanded(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image preview`}
        >
          <div
            className="relative w-full h-full sm:h-auto sm:max-w-5xl sm:aspect-video bg-black sm:rounded-xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/60 hover:bg-black/80 text-white hover:text-red-500 p-2 rounded-full transition-colors"
              aria-label="Close image preview"
            >
              <X size={20} />
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

const Timeline: React.FC<TimelineProps> = ({
  items,
  type,
  compact = false,
  showAllContent = true,
  animatingItems = new Set(),
  disappearingItems = new Set(),
  onTagClick,
  showLine = true,
}) => {
  if (items.length === 0) {
    return null
  }

  const badgeBaseClass = "text-xs font-semibold px-2 py-1 rounded-none"
  const clickableBadgeClass = "cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 hover:border-red-600"

  // Compact mode for side navigation preview
  if (compact) {
    return (
      <div className="space-y-2">
        {items.map((item) => {
          const itemKey = `${item.institution || item.name}-${item.startDate}`
          return (
            <div
              key={itemKey}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0"></div>
              <span className="truncate">{item.institution || item.name}</span>
            </div>
          )
        })}
      </div>
    )
  }

  // Full timeline mode - Full width card layout
  return (
    <div
      className="w-full mx-auto"
      data-timeline-type={type ?? "mixed"}
      data-show-all-content={showAllContent ? "true" : "false"}
    >
      <div className="relative flex flex-col gap-6">
        {/* Timeline vertical line - centered */}
        {showLine && (
          <div className="absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-0.5 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        )}

        {items.map((item) => {
          const itemKey = `${item.institution || item.name}-${item.startDate}`
          const isNewItem = animatingItems.has(itemKey)
          const isDisappearing = disappearingItems.has(itemKey)

          // Combine old url format with new links array
          const allLinks: TimelineLink[] = []
          if (item.url) {
            allLinks.push({ url: item.url, label: "View Project", icon: "external" })
          }
          if (item.links) {
            allLinks.push(...item.links)
          }

          return (
            <div
              key={itemKey}
              className={`group relative bg-[#151515] hover:bg-[#252525] p-6 rounded-none border border-[#333333] hover:border-red-600/50 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-red-600/30 ${
                isNewItem ? "animate-fade-in-up border-red-600/30" : ""
              } ${isDisappearing ? "animate-fade-out-down" : ""}`}
            >
              {/* Title */}
              <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-[#dc2626] transition-colors duration-300">
                {item.institution || item.name}
              </h3>

              {/* Dates */}
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

              {/* Highlights */}
              {item.highlights && item.highlights.length > 0 && (
                <ul className="list-disc list-inside mb-4 text-gray-300 space-y-1">
                  {item.highlights.map((hl, i) => (
                    <li key={i}>{hl}</li>
                  ))}
                </ul>
              )}

              {/* Summary/Description */}
              <p className="text-gray-300 mb-4">{item.summary}</p>

              {/* Topics/Tags */}
              {(() => {
                const displayTags = Array.from(
                  new Set([...(item.topics ?? []), ...(item.tags ?? [])])
                )
                if (displayTags.length === 0) return null
                const tagClassName = onTagClick
                  ? "bg-[#3a3a3a] text-gray-300 text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all duration-200 border border-transparent hover:bg-[#444444] hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 hover:border-red-600 hover:text-[#dc2626] cursor-pointer active:scale-95"
                  : "bg-[#333333] text-gray-300 text-xs px-2 py-1 rounded-full"

                return (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {displayTags.map((tag) => (
                      <span
                        key={tag}
                        onClick={onTagClick ? () => onTagClick(tag) : undefined}
                        className={tagClassName}
                      >
                        {tag.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )
              })()}

              {/* Links */}
              {allLinks.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {allLinks.map((link, i) => {
                    const LinkIcon = link.icon ? linkIconMap[link.icon] : FaExternalLinkAlt
                    return (
                      <TooltipWrapper key={i} label={link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-4 py-2 rounded-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                        >
                          {link.label}
                          <LinkIcon className="text-sm" />
                        </a>
                      </TooltipWrapper>
                    )
                  })}
                </div>
              )}

              {/* Images with Carousel */}
              {item.images && item.images.length > 0 && (
                <ImageCarousel
                  images={item.images}
                  title={item.institution || item.name || "Timeline Item"}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Timeline

const getLocationTagClass = (location: string) => {
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

const getLanguageTagClass = (language: string) => {
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
