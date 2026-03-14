"use client"

import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  ReactNode,
} from "react"
import ReactDOM from "react-dom"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { isPdfPreviewSupported } from "../utils/pdfSupport"

interface PdfThumbnailTooltipProps {
  label: string
  children: ReactNode
  url?: string
  imageUrl?: string
  fullWidth?: boolean
}

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg"]
const TOOLTIP_ANIMATION_MS = 300

const TooltipWrapper = ({ label, children, url, imageUrl, fullWidth = false }: PdfThumbnailTooltipProps) => {
  const [visible, setVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [thumbnailLoading, setThumbnailLoading] = useState(false)
  const [thumbnailError, setThumbnailError] = useState(false)
  const [isLargeViewport, setIsLargeViewport] = useState(false)
  const [popupPosition, setPopupPosition] = useState<{ left: number; top: number } | null>(null)

  const triggerRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isHovering = useRef(false)

  const isPdf = useMemo(() => url?.toLowerCase().endsWith(".pdf") ?? false, [url])
  const isImage = useMemo(
    () => !!imageUrl || IMAGE_EXTENSIONS.some(ext => url?.toLowerCase().endsWith(ext)),
    [url, imageUrl]
  )
  // Prefer explicit imageUrl, fall back to url if it's an image extension
  const resolvedImageUrl = imageUrl ?? (isImage && !isPdf ? url : undefined)

  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(min-width: 1024px)")
    const updateViewportState = () => setIsLargeViewport(mediaQuery.matches)

    updateViewportState()

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateViewportState)
      return () => mediaQuery.removeEventListener("change", updateViewportState)
    }

    mediaQuery.addListener(updateViewportState)
    return () => mediaQuery.removeListener(updateViewportState)
  }, [])

  const canPreviewPdf = useMemo(
    () => (isPdf ? isPdfPreviewSupported() && isLargeViewport : false),
    [isPdf, isLargeViewport]
  )

  // Image previews work everywhere (no browser restriction), but still skip on mobile
  const canPreviewImage = useMemo(
    () => isImage && !isPdf && isLargeViewport && !!resolvedImageUrl,
    [isImage, isPdf, isLargeViewport, resolvedImageUrl]
  )

  const shouldShowStandardTooltip = !isPdf && !isImage

  const updatePopupPosition = useCallback(() => {
    if (!triggerRef.current || !popupRef.current || typeof window === "undefined") return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const popupRect = popupRef.current.getBoundingClientRect()
    const spacing = 8
    const viewportPadding = 8

    let left = triggerRect.left + triggerRect.width / 2 - popupRect.width / 2
    let top = triggerRect.top - popupRect.height - spacing

    if (left + popupRect.width > window.innerWidth - viewportPadding) {
      left = window.innerWidth - popupRect.width - viewportPadding
    }

    if (left < viewportPadding) {
      left = viewportPadding
    }

    if (top < viewportPadding) {
      top = Math.min(
        triggerRect.bottom + spacing,
        window.innerHeight - popupRect.height - viewportPadding
      )
    }

    if (top < viewportPadding) {
      top = viewportPadding
    }

    setPopupPosition({ left, top })
  }, [])

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    isHovering.current = true
    clearCloseTimer()
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if (visible) {
      setIsClosing(false)
      return
    }

    timeoutRef.current = setTimeout(() => {
      if (!isHovering.current) return

      setVisible(true)
      setIsClosing(false)

      if (canPreviewPdf || canPreviewImage) {
        setThumbnailLoading(true)
        setThumbnailError(false)
      }
    }, 500)
  }, [canPreviewPdf, canPreviewImage, clearCloseTimer, visible])

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if ((canPreviewPdf || canPreviewImage) && visible) {
      setIsClosing(true)
      setThumbnailLoading(false)
      closeTimerRef.current = setTimeout(() => {
        setVisible(false)
        setIsClosing(false)
        setPopupPosition(null)
      }, TOOLTIP_ANIMATION_MS)
      return
    }

    setVisible(false)
    setIsClosing(false)
    setThumbnailLoading(false)
    setPopupPosition(null)
  }, [canPreviewPdf, canPreviewImage, visible])

  useEffect(() => {
    if (!(canPreviewPdf || canPreviewImage) || !visible) return

    updatePopupPosition()

    const handleViewportChange = () => updatePopupPosition()

    window.addEventListener("resize", handleViewportChange)
    window.addEventListener("scroll", handleViewportChange, true)

    return () => {
      window.removeEventListener("resize", handleViewportChange)
      window.removeEventListener("scroll", handleViewportChange, true)
    }
  }, [canPreviewPdf, canPreviewImage, visible, updatePopupPosition])

  useEffect(() => {
    if (!canPreviewPdf && !canPreviewImage && (isPdf || isImage)) {
      clearCloseTimer()
      setVisible(false)
      setIsClosing(false)
      setPopupPosition(null)
      setThumbnailLoading(false)
    }
  }, [canPreviewPdf, canPreviewImage, isPdf, isImage, clearCloseTimer])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  const handleThumbnailLoad = useCallback(() => {
    setThumbnailLoading(false)
    updatePopupPosition()
  }, [updatePopupPosition])

  const handleThumbnailError = useCallback(() => {
    setThumbnailLoading(false)
    setThumbnailError(true)
    updatePopupPosition()
  }, [updatePopupPosition])

  const pdfTooltip =
    canPreviewPdf && visible && typeof document !== "undefined"
      ? ReactDOM.createPortal(
          <div
            ref={popupRef}
            role="tooltip"
            aria-label={label}
            className={`fixed z-[9999] w-[260px] max-w-[90vw] overflow-hidden rounded-xl border border-[#333333] bg-[#1e1e1e] shadow-2xl shadow-black/50 ${
              isClosing ? "animate-fade-out-down" : "animate-fade-in-up"
            }`}
            style={
              popupPosition
                ? { left: popupPosition.left, top: popupPosition.top }
                : { visibility: "hidden", left: 0, top: 0 }
            }
          >
            <div className="border-b border-[#333333] px-3 pb-1.5 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                {label}
              </span>
            </div>
            <div className="p-3 pt-2">
              <div className="relative h-[260px] w-full overflow-hidden rounded-lg border border-[#333333] bg-[#111111]">
                {thumbnailLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#111111]">
                    <Loader2 className="h-6 w-6 animate-spin text-white/70" />
                  </div>
                )}
                {thumbnailError ? (
                  <div className="absolute inset-0 flex items-center justify-center px-3 text-center text-xs text-white/70">
                    Unable to generate preview
                  </div>
                ) : (
                  <embed
                    src={url}
                    type="application/pdf"
                    className="h-full w-full min-h-[260px]"
                    onLoad={handleThumbnailLoad}
                    onError={handleThumbnailError}
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <div className="flex items-center justify-between text-xs text-white">
                    <span className="truncate max-w-[160px]">PDF Document</span>
                    <span className="text-white/70">Preview</span>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null

  const imageTooltip =
    canPreviewImage && visible && typeof document !== "undefined"
      ? ReactDOM.createPortal(
          <div
            ref={popupRef}
            role="tooltip"
            aria-label={label}
            className={`fixed z-[9999] w-[280px] max-w-[90vw] overflow-hidden rounded-xl border border-[#333333] bg-[#1e1e1e] shadow-2xl shadow-black/50 ${
              isClosing ? "animate-fade-out-down" : "animate-fade-in-up"
            }`}
            style={
              popupPosition
                ? { left: popupPosition.left, top: popupPosition.top }
                : { visibility: "hidden", left: 0, top: 0 }
            }
          >
            <div className="border-b border-[#333333] px-3 pb-1.5 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                {label}
              </span>
            </div>
            <div className="p-3 pt-2">
              <div className="relative w-full overflow-hidden rounded-lg border border-[#333333] bg-[#111111]" style={{ minHeight: 160 }}>
                {thumbnailLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#111111]">
                    <Loader2 className="h-6 w-6 animate-spin text-white/70" />
                  </div>
                )}
                {thumbnailError ? (
                  <div className="flex items-center justify-center px-3 py-8 text-center text-xs text-white/70">
                    Unable to load image
                  </div>
                ) : (
                  <Image
                    src={resolvedImageUrl!}
                    alt={label}
                    width={254}
                    height={180}
                    className="w-full h-auto object-contain"
                    onLoad={handleThumbnailLoad}
                    onError={handleThumbnailError}
                    unoptimized={resolvedImageUrl?.startsWith("http")}
                  />
                )}
              </div>
            </div>
          </div>,
          document.body
        )
      : null

  return (
    <div
      ref={triggerRef}
      className={`relative group ${fullWidth ? "w-full" : "inline-block"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {pdfTooltip}
      {imageTooltip}
      {visible && shouldShowStandardTooltip ? (
        <div
          role="tooltip"
          aria-label={label}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-red-600 text-white rounded-md shadow-md z-50 whitespace-nowrap transition-all duration-200 ease-out opacity-100 scale-100 animate-elastic-in"
        >
          {label}
        </div>
      ) : null}
    </div>
  )
}

export default TooltipWrapper
