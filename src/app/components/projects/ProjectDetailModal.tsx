"use client"

import React, { useCallback, useEffect, useId, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { X } from "lucide-react"
import { FaExternalLinkAlt, FaRegCalendarAlt } from "react-icons/fa"
import type { TimelineItem } from "../../data/types"
import { useModalLayer } from "../../hooks/useModalLayer"
import { useExternalLink } from "../ExternalLinkHandler"
import MediaGallery from "../MediaGallery"
import {
  badgeBaseClass,
  getLanguageTagClass,
  getTimelineLinks,
  linkButtonClass,
  linkIconMap,
  tagChipClass,
} from "../TimelineCard"

interface ProjectDetailModalProps {
  /** Project to show; `null` closes the popup. */
  project: TimelineItem | null
  onClose: () => void
}

const CLOSE_ANIMATION_MS = 250

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-2 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
    {children}
  </h3>
)

/**
 * In-page project detail popup: overview, tags, gallery, then Why and How.
 * The page underneath never changes; only the URL does (see HomeClient).
 */
const ProjectDetailModal = ({ project, onClose }: ProjectDetailModalProps) => {
  const [isClosing, setIsClosing] = useState(false)
  // The popup can be open on first load (/projects/<slug>). The server has no
  // document to portal into, so render it only after mount; rendering it
  // during hydration would not match the server HTML.
  const [isMounted, setIsMounted] = useState(false)
  const closeTimerRef = useRef<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()
  const { handleExternalClick } = useExternalLink()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  const requestClose = useCallback(() => {
    if (closeTimerRef.current !== null) return
    setIsClosing(true)
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null
      setIsClosing(false)
      onCloseRef.current()
    }, CLOSE_ANIMATION_MS)
  }, [])

  useModalLayer(Boolean(project), requestClose)

  // Move focus into the popup when it opens and back to whatever opened it
  // (usually the project card) when it closes.
  const isOpen = Boolean(project)
  useEffect(() => {
    if (!isOpen) return
    returnFocusRef.current = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus({ preventScroll: true })
    return () => {
      returnFocusRef.current?.focus({ preventScroll: true })
    }
  }, [isOpen])

  useEffect(() => () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current)
  }, [])

  if (!project || !isMounted) return null

  const title = project.name ?? "Project"
  const links = getTimelineLinks(project)
  const tags = Array.from(new Set([...(project.tags ?? []), ...(project.topics ?? [])]))
  const howSteps = project.how ?? project.highlights

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-3 sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#333333] bg-[#1a1a1a] shadow-2xl shadow-black/60 ${
          isClosing ? "animate-fade-out-down" : "animate-fade-in-up"
        }`}
      >
        {/* Header: title, dates and the main badge stay visible while scrolling */}
        <div className="flex items-start justify-between gap-4 border-b border-[#333333] p-5 sm:p-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-2xl font-bold text-white sm:text-3xl">
              {title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <span className="inline-flex items-center gap-2">
                <FaRegCalendarAlt aria-hidden="true" />
                {project.startDate} – {project.endDate}
              </span>
              {project.language && (
                <span className={`${badgeBaseClass} ${getLanguageTagClass(project.language)}`}>{project.language}</span>
              )}
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={requestClose}
            aria-label="Close project details"
            className="shrink-0 rounded-full p-1.5 text-white transition-colors hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto overscroll-contain p-5 sm:p-6">
          <p className="leading-relaxed text-gray-300">{project.summary}</p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className={tagChipClass}>
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          )}

          {project.images && project.images.length > 0 && (
            <section>
              <SectionHeading>Gallery</SectionHeading>
              <MediaGallery images={project.images} title={title} />
            </section>
          )}

          {project.why && (
            <section>
              <SectionHeading>Why</SectionHeading>
              <p className="leading-relaxed text-gray-300">{project.why}</p>
            </section>
          )}

          {howSteps.length > 0 && (
            <section>
              <SectionHeading>How</SectionHeading>
              <ul className="list-disc space-y-1.5 pl-5 text-gray-300 marker:text-red-500">
                {howSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </section>
          )}

          {links.length > 0 && (
            <section>
              <SectionHeading>Links</SectionHeading>
              <div className="flex flex-wrap gap-3">
                {links.map((link) => {
                  const LinkIcon = link.icon ? linkIconMap[link.icon] : FaExternalLinkAlt
                  return (
                    <button
                      key={link.url}
                      type="button"
                      onClick={() => handleExternalClick(link.url, true)}
                      className={linkButtonClass}
                      title={link.url}
                    >
                      {link.label}
                      <LinkIcon className="text-sm" />
                    </button>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ProjectDetailModal
