"use client"

import React from "react"

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
  url?: string // For projects
  tags?: string[] // Tags for filtering
}

interface TimelineProps {
  items: TimelineItem[]
  type?: "experience" | "education" | "project"
  compact?: boolean
  showAllContent?: boolean
  animatingItems?: Set<string>
  disappearingItems?: Set<string>
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

  // Full timeline mode
  return (
    <div className="relative w-full max-w-4xl mx-auto px-4">
      <div className="absolute left-1/2 -ml-[2px] w-[2px] bg-gray-700 h-full hidden md:block"></div>

      <div className="flex flex-col gap-12">
        {items.map((item) => {
          const itemKey = `${item.institution || item.name}-${item.startDate}`
          const isNewItem = animatingItems.has(itemKey)
          const isDisappearing = disappearingItems.has(itemKey)

          return (
            <div
              key={itemKey}
              className={`flex flex-col md:flex-row md:items-center relative ${
                isNewItem ? "animate-fade-in-up" : ""
              } ${isDisappearing ? "animate-fade-out-down" : ""}`}
            >
              <div className="md:w-1/2 text-center md:text-center md:pr-8">
                <h3 className="text-xl font-semibold text-white">
                  {item.institution || item.name}
                </h3>
                <p className="text-gray-400">
                  {item.startDate} to {item.endDate}
                </p>
                {item.location && (
                  <p className="text-gray-500 text-sm italic">{item.location}</p>
                )}
                {item.language && (
                  <p className="text-gray-500 text-sm">
                    <span className="bg-[#333333] text-gray-300 px-2 py-1 rounded">
                      {item.language}
                    </span>
                  </p>
                )}
                <ul className="list-disc list-inside mt-2 text-sm text-gray-300 text-left md:text-center mx-auto md:mx-auto max-w-xs">
                  {item.highlights.map((hl, i) => (
                    <li key={i}>{hl}</li>
                  ))}
                </ul>
              </div>
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
                <div
                  className={`absolute -left-[25px] w-4 h-4 rounded-full bg-red-600 ${
                    isNewItem ? "animate-pulse" : ""
                  } ${isDisappearing ? "animate-fade-out-down" : ""}`}
                ></div>
              </div>
              <div className="md:w-1/2 md:pl-4 mt-4 md:mt-0">
                <div
                  className={`bg-[#1e1e1e] p-5 rounded-lg border border-[#333333] hover:border-red-600/50 transition-all duration-300 ease-out hover:scale-[1.03] active:scale-95 ${
                    isNewItem ? "border-red-600/30" : ""
                  } ${isDisappearing ? "animate-fade-out-down" : ""}`}
                >
                  <p>{item.summary}</p>
                  {item.topics && item.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
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
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Timeline
