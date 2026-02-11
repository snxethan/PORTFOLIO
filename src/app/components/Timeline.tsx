"use client"

import React, { useState } from "react"
import { FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa"

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
  links?: Array<{ url: string; label: string }> // Multiple links
  images?: string[] // Multiple images with carousel support
}

interface TimelineProps {
  items: TimelineItem[]
  type?: "experience" | "education" | "project"
  compact?: boolean
  showAllContent?: boolean
  animatingItems?: Set<string>
  disappearingItems?: Set<string>
}

// Image Carousel Component
const ImageCarousel: React.FC<{ images: string[]; title: string }> = ({
  images,
  title,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <div className="relative mt-4">
      <div className="relative w-full aspect-video bg-[#0a0a0a] rounded-lg overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />

        {/* Carousel Controls */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextImage}
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
                  onClick={() => setCurrentIndex(i)}
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
    </div>
  )
}

const Timeline: React.FC<TimelineProps> = ({
  items,
  type: _type,
  compact = false,
  showAllContent: _showAllContent = true,
  animatingItems = new Set(),
  disappearingItems = new Set(),
}) => {
  if (items.length === 0) {
    return null
  }

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
    <div className="w-full mx-auto px-4">
      <div className="flex flex-col gap-6">
        {items.map((item) => {
          const itemKey = `${item.institution || item.name}-${item.startDate}`
          const isNewItem = animatingItems.has(itemKey)
          const isDisappearing = disappearingItems.has(itemKey)

          // Combine old url format with new links array
          const allLinks: Array<{ url: string; label: string }> = []
          if (item.url) {
            allLinks.push({ url: item.url, label: "View Project" })
          }
          if (item.links) {
            allLinks.push(...item.links)
          }

          return (
            <div
              key={itemKey}
              className={`bg-[#1e1e1e] p-6 rounded-xl border border-[#333333] hover:border-red-600/50 transition-all duration-300 ease-out hover:scale-[1.01] ${
                isNewItem ? "animate-fade-in-up border-red-600/30" : ""
              } ${isDisappearing ? "animate-fade-out-down" : ""}`}
            >
              {/* Title */}
              <h3 className="text-2xl font-semibold text-white mb-2">
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
                    <span className="italic">{item.location}</span>
                  </>
                )}
                {item.language && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="bg-[#333333] text-gray-300 px-2 py-1 rounded text-sm">
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
              {item.topics && item.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.topics.map((topic) => (
                    <span
                      key={topic}
                      className="bg-[#333333] text-gray-300 text-xs px-2 py-1 rounded-full"
                    >
                      {topic.toUpperCase()}
                    </span>
                  ))}
                </div>
              )}

              {/* Links */}
              {allLinks.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {allLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      {link.label}
                      <FaExternalLinkAlt className="text-sm" />
                    </a>
                  ))}
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
