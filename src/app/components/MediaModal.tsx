"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import Image from "next/image"
import { X, Loader2 } from "lucide-react"
import { FaDownload, FaExternalLinkAlt } from "react-icons/fa"
import { isPdfPreviewSupported } from "../utils/pdfSupport"
import { RESUME_DOWNLOAD_FILENAME } from "@/app/data/resume"
import { useModalLayer } from "../hooks/useModalLayer"

export type MediaKind = "pdf" | "image"

interface MediaModalProps {
  /** File to show. `null` keeps the modal closed. */
  src: string | null
  /** Detected from the URL when omitted. */
  kind?: MediaKind
  alt?: string
  onClose: () => void
}

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg"]
const CLOSE_ANIMATION_MS = 300

const getPathname = (url: string) => {
  try {
    return new URL(url, window.location.origin).pathname
  } catch {
    return url.split(/[?#]/)[0] ?? url
  }
}

export const detectMediaKind = (url: string): MediaKind => {
  if (url.startsWith("blob:")) return "pdf" // only the cached resume uses blob URLs
  const path = getPathname(url).toLowerCase()
  return IMAGE_EXTENSIONS.some((ext) => path.endsWith(ext)) ? "image" : "pdf"
}

const triggerDownload = (href: string, filename: string) => {
  const link = document.createElement("a")
  link.href = href
  link.download = filename
  link.rel = "noopener noreferrer"
  document.body.appendChild(link)
  link.click()
  link.remove()
}

const downloadMedia = (url: string, kind: MediaKind) => {
  if (url.startsWith("blob:")) {
    triggerDownload(url, RESUME_DOWNLOAD_FILENAME)
    return
  }

  const parsedUrl = new URL(url, window.location.origin)
  const filename = decodeURIComponent(parsedUrl.pathname.split("/").pop() ?? "")

  if (kind === "pdf") {
    // `/resume.pdf` is a route that only sends an attachment when asked to;
    // static files ignore the extra query and `download` handles them.
    const separator = parsedUrl.search ? "&" : "?"
    triggerDownload(`${parsedUrl.pathname}${parsedUrl.search}${separator}download=1`, filename)
    return
  }

  triggerDownload(parsedUrl.href, filename)
}

const actionButtonClass =
  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"

/**
 * One popup for every file preview, PDF or image. Both kinds get the same
 * header: Download and Open in new tab on the left, close on the right.
 */
const MediaModal: React.FC<MediaModalProps> = ({ src, kind, alt, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const lastRedirectedPdfRef = useRef<string | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  // Callers pass inline arrow functions; reading onClose through a ref keeps a
  // parent re-render from re-running the open effect (and its loading state).
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  const resolvedKind: MediaKind | null = src ? kind ?? detectMediaKind(src) : null

  const openInNewTab = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }, [])

  const initiateClose = useCallback(() => {
    if (closeTimerRef.current !== null) return
    setIsAnimatingOut(true)
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null
      setIsAnimatingOut(false)
      setIsVisible(false)
      onCloseRef.current()
    }, CLOSE_ANIMATION_MS)
  }, [])

  useEffect(() => () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current)
  }, [])

  useEffect(() => {
    if (!src) {
      lastRedirectedPdfRef.current = null
      setIsVisible(false)
      return
    }

    // Browsers that cannot render PDFs inline (most mobile ones) get the file
    // in a new tab instead of an empty frame.
    if (resolvedKind === "pdf" && !isPdfPreviewSupported()) {
      if (lastRedirectedPdfRef.current !== src) {
        lastRedirectedPdfRef.current = src
        openInNewTab(src)
      }
      onCloseRef.current()
      return
    }

    setIsVisible(true)
    setIsLoading(true)
  }, [src, resolvedKind, openInNewTab])

  useModalLayer(Boolean(src) && isVisible, initiateClose)

  if (!src || !resolvedKind || !isVisible) return null

  const label = alt || (resolvedKind === "pdf" ? "Document preview" : "Image preview")

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-3 sm:p-8 lg:p-16"
      onClick={(e) => {
        if (e.target === e.currentTarget) initiateClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`relative bg-[#1a1a1a] border border-[#333] rounded-xl w-full max-w-4xl max-h-[90vh] shadow-xl overflow-hidden flex flex-col ${
          isAnimatingOut ? "animate-fade-out-down" : "animate-fade-in-up"
        }`}
        style={{
          transform: "translateZ(0)",
          backfaceVisibility: "hidden" as const,
          WebkitOverflowScrolling: "touch" as const,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 p-3 sm:p-4 border-b border-[#333]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadMedia(src, resolvedKind)}
              className={`${actionButtonClass} bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400`}
              aria-label="Download"
            >
              <FaDownload size={14} />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              type="button"
              onClick={() => openInNewTab(src)}
              className={`${actionButtonClass} border border-[#3a3a3a] bg-[#2a2a2a] text-gray-200 hover:border-red-600 hover:text-[#dc2626]`}
              aria-label="Open in new tab"
            >
              <FaExternalLinkAlt size={14} />
              <span className="hidden sm:inline">Open in new tab</span>
            </button>
          </div>
          <button
            type="button"
            onClick={initiateClose}
            aria-label="Close preview"
            className="rounded-full p-1.5 text-white transition-colors hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-auto relative bg-[#1a1a1a]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] z-10">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
          {resolvedKind === "image" ? (
            <div className="relative w-full h-[calc(100vh-150px)] max-h-[75vh] min-h-[300px]">
              <Image
                src={src}
                alt={label}
                fill
                sizes="100vw"
                className="object-contain"
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />
            </div>
          ) : (
            <iframe
              src={src}
              title={label}
              className="w-full min-h-[600px] h-[calc(100vh-150px)] max-h-[75vh] border-none"
              onLoad={() => setIsLoading(false)}
              loading="lazy"
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MediaModal
