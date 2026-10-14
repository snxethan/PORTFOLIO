"use client"

import React from "react"
import Image from "next/image"
import { FaChevronRight, FaProjectDiagram, FaRegCalendarAlt } from "react-icons/fa"
import type { TimelineItem } from "../../data/types"

interface ProjectCardProps {
  project: TimelineItem
  onOpen: () => void
}

export const getProjectThumbnail = (project: TimelineItem) => project.thumbnail ?? project.images?.[0]

/**
 * Preview card: title, dates, a short description and an optional thumbnail.
 * Everything else lives in the detail popup it opens.
 */
const ProjectCard = ({ project, onOpen }: ProjectCardProps) => {
  const thumbnail = getProjectThumbnail(project)
  const title = project.name ?? "Untitled project"

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group flex h-full w-full flex-col overflow-hidden rounded-none border border-[#333333] bg-[#151515] text-left transition-colors duration-300 hover:border-red-600/50 hover:bg-[#1c1c1c] hover:shadow-lg hover:shadow-red-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
    >
      {/* Every card gets the same thumbnail slot, so cards in a row line up.
          Projects without an image show a branded placeholder instead. */}
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden border-b border-[#333333] bg-[#0a0a0a]">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2a1212] via-[#171717] to-[#101010]"
          >
            <FaProjectDiagram className="h-12 w-12 text-red-600/40 transition-colors duration-300 group-hover:text-red-600/60" />
            {project.language && (
              <span className="absolute bottom-2 left-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {project.language}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-[#dc2626]">
          {title}
        </h3>
        <p className="mt-1 flex items-center gap-2 text-sm text-gray-400">
          <FaRegCalendarAlt aria-hidden="true" className="shrink-0" />
          {project.startDate} – {project.endDate}
        </p>
        <p className="mt-3 line-clamp-3 text-sm text-gray-300">{project.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-red-500 transition-colors group-hover:text-red-400">
          View details
          <FaChevronRight aria-hidden="true" className="h-3 w-3" />
        </span>
      </div>
    </button>
  )
}

export default ProjectCard
