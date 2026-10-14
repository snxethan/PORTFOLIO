"use client"

import React, { useCallback, useEffect, useId, useRef, useState } from "react"
import ReactDOM from "react-dom"
import Image from "next/image"
import { X } from "lucide-react"
import { FaChevronRight, FaExternalLinkAlt, FaProjectDiagram, FaRegCalendarAlt } from "react-icons/fa"
import type { TimelineItem } from "../../data/types"
import { useModalLayer } from "../../hooks/useModalLayer"
import { useExternalLink } from "../ExternalLinkHandler"
import MediaGallery from "../MediaGallery"
import {
  badgeBaseClass,
  getItemBadge,
  getItemTags,
  getItemThumbnail,
  getItemTitle,
  getTimelineLinks,
  linkButtonClass,
  linkIconMap,
  tagChipClass,
} from "./detailUi"

export type DetailKind = "project" | "career"

interface RelatedProject {
  slug: string
  item: TimelineItem
}

interface DetailModalProps {
  /** Entry to show; `null` closes the popup. */
  item: TimelineItem | null
  kind: DetailKind
  onClose: () => void
  /** Career popups: projects built in this role. */
  relatedProjects?: RelatedProject[]
  /** Called (after the popup has closed) when a related project is chosen. */
  onSelectRelatedProject?: (slug: string) => void
}

const CLOSE_ANIMATION_MS = 250

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-2 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
    {children}
  </h3>
)

/**
 * In-page detail popup for a project (overview, tags, gallery, Why, How) or a
 * career entry (overview, tags, highlights, related projects). The page
 * underneath never changes; only the URL does (see HomeClient).
 */
const DetailModal = ({ item, kind, onClose, relatedProjects = [], onSelectRelatedProject }: DetailModalProps) => {
  const [isClosing, setIsClosing] = useState(false)
  // The popup can be open on first load (/projects/<slug>). The server has no
  // document to portal into, so render it only after mount; rendering it
  // during hydration would not match the server HTML.
  const [isMounted, setIsMounted] = useState(false)
  const closeTimerRef = useRef<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  const onSelectRelatedRef = useRef(onSelectRelatedProject)
  const titleId = useId()
  const { handleExternalClick } = useExternalLink()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    onCloseRef.current = onClose
    onSelectRelatedRef.current = onSelectRelatedProject
  }, [onClose, onSelectRelatedProject])

  /** Plays the close animation, then closes; `afterClose` runs once closed. */
  const requestClose = useCallback((afterClose?: () => void) => {
    if (closeTimerRef.current !== null) return
    setIsClosing(true)
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null
      setIsClosing(false)
      onCloseRef.current()
      afterClose?.()
    }, CLOSE_ANIMATION_MS)
  }, [])

  const closeFromEscape = useCallback(() => requestClose(), [requestClose])
  useModalLayer(Boolean(item), closeFromEscape)

  // Move focus into the popup when it opens and back to whatever opened it
  // (usually the card) when it closes.
  const isOpen = Boolean(item)
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

  if (!item || !isMounted) return null

  const title = getItemTitle(item)
  const badge = getItemBadge(item)
  const links = getTimelineLinks(item)
  const tags = getItemTags(item)
  const isProject = kind === "project"
  const howSteps = item.how ?? item.highlights

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-3 sm:p-6 ${
        isClosing ? "animate-backdrop-out" : "animate-backdrop-in"
      }`}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#333333] bg-[#1a1a1a] shadow-2xl shadow-black/60 ${
          isClosing ? "animate-dialog-out" : "animate-dialog-in"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#333333] p-5 sm:p-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-2xl font-bold text-white sm:text-3xl">
              {title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <span className="inline-flex items-center gap-2">
                <FaRegCalendarAlt aria-hidden="true" />
                {item.startDate} – {item.endDate}
              </span>
              {badge && <span className={`${badgeBaseClass} ${badge.className}`}>{badge.label}</span>}
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => requestClose()}
            aria-label="Close details"
            className="shrink-0 rounded-full p-1.5 text-white transition-colors hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto overscroll-contain p-5 sm:p-6">
          <p className="leading-relaxed text-gray-300">{item.summary}</p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className={tagChipClass}>
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          )}

          {item.images && item.images.length > 0 && (
            <section>
              <SectionHeading>Gallery</SectionHeading>
              <MediaGallery images={item.images} title={title} />
            </section>
          )}

          {isProject && item.why && (
            <section>
              <SectionHeading>Why</SectionHeading>
              <p className="leading-relaxed text-gray-300">{item.why}</p>
            </section>
          )}

          {howSteps.length > 0 && (
            <section>
              <SectionHeading>{isProject ? "How" : "Highlights"}</SectionHeading>
              <ul className="list-disc space-y-1.5 pl-5 text-gray-300 marker:text-red-500">
                {howSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </section>
          )}

          {relatedProjects.length > 0 && (
            <section>
              <SectionHeading>Related projects</SectionHeading>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedProjects.map(({ slug, item: project }) => {
                  const thumbnail = getItemThumbnail(project)
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => requestClose(() => onSelectRelatedRef.current?.(slug))}
                      className="group flex items-center gap-3 rounded-lg border border-[#333333] bg-[#151515] p-3 text-left transition-[scale,transform,border-color,background-color] duration-200 hover:scale-[1.02] hover:border-red-600/60 hover:bg-[#1c1c1c] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                    >
                      <span className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#0a0a0a]">
                        {thumbnail ? (
                          <Image src={thumbnail} alt="" fill sizes="64px" className="object-cover" />
                        ) : (
                          <FaProjectDiagram className="h-5 w-5 text-red-600/50" aria-hidden="true" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-white group-hover:text-[#dc2626]">
                          {getItemTitle(project)}
                        </span>
                        <span className="block text-xs text-gray-400">
                          {project.startDate} – {project.endDate}
                        </span>
                      </span>
                      <FaChevronRight className="h-3 w-3 shrink-0 text-red-500" aria-hidden="true" />
                    </button>
                  )
                })}
              </div>
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

export default DetailModal
