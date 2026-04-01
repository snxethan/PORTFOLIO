"use client"

import React, { useState, useRef, useCallback } from "react"
import { FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaGithub } from "react-icons/fa"
import TooltipWrapper from "./ToolTipWrapper"
import { useExternalLink } from "./ExternalLinkHandler"
import Image from "next/image"
import PDFModalViewer from "./PDFModalViewer"
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
  layout?: "vertical" | "horizontal"
}

// Image Carousel Component
const ImageCarousel: React.FC<{ images: string[]; title: string }> = ({
  images,
  title,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <div className="relative mt-4">
      <TooltipWrapper
        label={`${title} — Image ${currentIndex + 1}${images.length > 1 ? ` of ${images.length}` : ""}`}
        imageUrl={images[currentIndex]}
        fullWidth
      >
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
              className="group absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Previous image"
            >
              <FaChevronLeft className="text-white transition-colors duration-200 group-hover:text-red-500" />
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation()
                nextImage()
              }}
              className="group absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Next image"
            >
              <FaChevronRight className="text-white transition-colors duration-200 group-hover:text-red-500" />
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
      </TooltipWrapper>

      {/* Image counter */}
      {hasMultipleImages && (
        <p className="text-center text-gray-500 text-sm mt-2">
          Image {currentIndex + 1} of {images.length}
        </p>
      )}

      <PDFModalViewer
        imageUrl={isExpanded ? images[currentIndex] : null}
        imageAlt={`${title} - Image ${currentIndex + 1}`}
        onClose={() => setIsExpanded(false)}
      />
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
  layout = "vertical",
}) => {
  const isHorizontal = layout === "horizontal"
  const horizontalScrollRef = useRef<HTMLDivElement>(null)
  const { handleExternalClick } = useExternalLink()

  const handleCardClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isHorizontal || !horizontalScrollRef.current) return

    const target = event.target as HTMLElement | null
    if (target?.closest("a, button, input, select, textarea, [role='button'], [data-skip-card-scroll='true']")) {
      return
    }

    const card = event.currentTarget
    const container = horizontalScrollRef.current
    const cardRect = card.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const isClippedLeft = cardRect.left < containerRect.left + 8
    const isClippedRight = cardRect.right > containerRect.right - 8

    if (isClippedLeft || isClippedRight) {
      card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }, [isHorizontal])

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
      ref={isHorizontal ? horizontalScrollRef : undefined}
      className={isHorizontal
        ? "w-full max-w-full overflow-x-auto overflow-y-visible overscroll-x-contain py-4 snap-x snap-mandatory"
        : "w-full mx-auto"
      }
      data-timeline-type={type ?? "mixed"}
      data-show-all-content={showAllContent ? "true" : "false"}
    >
      <div className={isHorizontal ? "relative flex w-full min-w-full flex-nowrap items-stretch gap-6 px-3 pr-12 py-4" : "relative flex flex-col gap-6"}>
        {/* Timeline vertical line - centered */}
        {showLine && !isHorizontal && (
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

          const win2kFont: React.CSSProperties = {
            fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
            fontSize: "11px",
          }

          return (
            <div
              key={itemKey}
              onClick={handleCardClick}
              className={`group relative z-0 hover:z-10 flex h-full min-h-[420px] self-stretch flex-col transition-all duration-150 ${
                isHorizontal ? "shrink-0 w-full snap-center" : "w-full"
              } ${isNewItem ? "animate-fade-in-up" : ""} ${isDisappearing ? "animate-fade-out-down" : ""}`}
              style={{
                background: "#d4d0c8",
                borderTop: "1px solid #ffffff",
                borderLeft: "1px solid #ffffff",
                borderRight: "1px solid #404040",
                borderBottom: "1px solid #404040",
                padding: "0",
                ...win2kFont,
              }}
            >
              {/* Win2K title bar */}
              <div className="win-titlebar" style={{ fontSize: "11px" }}>
                <span className="truncate">{item.institution || item.name}</span>
              </div>

              <div style={{ padding: "8px" }} className="flex flex-col flex-1">
                {/* Title */}
                <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#000080", marginBottom: "4px" }}>
                  {item.institution || item.name}
                </h3>

                {/* Dates */}
                <div className="flex flex-wrap items-center gap-2 mb-3" style={{ fontSize: "10px", color: "#444444" }}>
                  <span>{item.startDate} to {item.endDate}</span>
                  {item.location && (
                    <>
                      <span style={{ color: "#808080" }}>•</span>
                      <span
                        onClick={onTagClick ? () => onTagClick(item.location ?? "") : undefined}
                        data-skip-card-scroll="true"
                        style={{
                          padding: "1px 5px",
                          background: "#000080",
                          color: "#ffffff",
                          fontSize: "9px",
                          cursor: onTagClick ? "pointer" : "default",
                        }}
                      >
                        {item.location}
                      </span>
                    </>
                  )}
                  {item.language && (
                    <>
                      <span style={{ color: "#808080" }}>•</span>
                      <span
                        onClick={onTagClick ? () => onTagClick(item.language ?? "") : undefined}
                        data-skip-card-scroll="true"
                        style={{
                          padding: "1px 5px",
                          background: "#808000",
                          color: "#ffffff",
                          fontSize: "9px",
                          cursor: onTagClick ? "pointer" : "default",
                        }}
                      >
                        {item.language}
                      </span>
                    </>
                  )}
                </div>

                {/* Highlights */}
                {item.highlights && item.highlights.length > 0 && (
                  <ul className="list-disc list-inside mb-3" style={{ fontSize: "11px", color: "#000000" }}>
                    {item.highlights.map((hl, i) => (
                      <li key={i} style={{ marginBottom: "2px" }}>{hl}</li>
                    ))}
                  </ul>
                )}

                {/* Summary/Description */}
                <p className="mb-3" style={{ fontSize: "11px", color: "#222222" }}>{item.summary}</p>

                {/* Images with Carousel */}
                {item.images && item.images.length > 0 && (
                  <ImageCarousel
                    images={item.images}
                    title={item.institution || item.name || "Timeline Item"}
                  />
                )}

                {/* Topics/Tags */}
                {(() => {
                  const displayTags = Array.from(
                    new Set([...(item.topics ?? []), ...(item.tags ?? [])])
                  )
                  if (displayTags.length === 0) return null

                  return (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {displayTags.map((tag) => (
                        <span
                          key={tag}
                          onClick={onTagClick ? () => onTagClick(tag) : undefined}
                          data-skip-card-scroll="true"
                          style={{
                            padding: "1px 5px",
                            fontSize: "9px",
                            background: "#c0bdb4",
                            color: "#000000",
                            borderTop: "1px solid #808080",
                            borderLeft: "1px solid #808080",
                            borderRight: "1px solid #ffffff",
                            borderBottom: "1px solid #ffffff",
                            cursor: onTagClick ? "pointer" : "default",
                          }}
                        >
                          {tag.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  )
                })()}

                {/* Links */}
                {allLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    {allLinks.map((link, i) => {
                      const LinkIcon = link.icon ? linkIconMap[link.icon] : FaExternalLinkAlt
                      const isProjectLink = (item.type ?? type) === "project"
                      return (
                        <TooltipWrapper key={i} label={link.url}>
                          {isProjectLink ? (
                            <button
                              type="button"
                              onClick={() => handleExternalClick(link.url, true)}
                              className="win-btn inline-flex items-center gap-1"
                              style={{ fontSize: "10px", padding: "2px 8px" }}
                            >
                              <LinkIcon style={{ fontSize: "10px" }} />
                              {link.label}
                            </button>
                          ) : (
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="win-btn inline-flex items-center gap-1"
                              style={{ fontSize: "10px", padding: "2px 8px", textDecoration: "none", color: "#000000" }}
                            >
                              <LinkIcon style={{ fontSize: "10px" }} />
                              {link.label}
                            </a>
                          )}
                        </TooltipWrapper>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {isHorizontal && <div aria-hidden className="shrink-0 w-8" />}
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
