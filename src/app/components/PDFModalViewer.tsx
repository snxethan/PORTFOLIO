"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { X, Loader2 } from "lucide-react"
import { FaExternalLinkAlt } from "react-icons/fa";
import ReactDOM from "react-dom"
import Image from "next/image"
import { isPdfPreviewSupported } from "../utils/pdfSupport"
import { RESUME_DOWNLOAD_FILENAME } from "@/app/data/resume"

interface PDFModalViewerProps {
  pdfUrl?: string | null
  imageUrl?: string | null
  imageAlt?: string
  onClose: () => void
}

const PDFModalViewer: React.FC<PDFModalViewerProps> = ({
  pdfUrl,
  imageUrl,
  imageAlt,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const lastOpenedPdfRef = useRef<string | null>(null)

  const openInNewTab = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }, [])

  const downloadPdf = useCallback((url: string) => {
    if (url.startsWith("blob:")) {
      const link = document.createElement("a")
      link.href = url
      link.download = RESUME_DOWNLOAD_FILENAME
      link.rel = "noopener noreferrer"
      document.body.appendChild(link)
      link.click()
      link.remove()
      return
    }

    const parsedUrl = new URL(url, window.location.origin)
    const downloadUrl = `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.search ? "&" : "?"}download=1`
    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = ""
    link.rel = "noopener noreferrer"
    document.body.appendChild(link)
    link.click()
    link.remove()
  }, [])

  const initiateClose = useCallback(() => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setIsAnimatingOut(false)
      setIsVisible(false)
      onClose()
    }, 300)
  }, [onClose])

  const activeUrl = pdfUrl ?? imageUrl ?? null
  const isImagePreview = Boolean(imageUrl && !pdfUrl)

  useEffect(() => {
    if (!activeUrl) {
      lastOpenedPdfRef.current = null
      setIsVisible(false)
      return
    }

    if (pdfUrl && !isPdfPreviewSupported()) {
      if (lastOpenedPdfRef.current !== pdfUrl) {
        lastOpenedPdfRef.current = pdfUrl
        openInNewTab(pdfUrl)
      }
      onClose()
      return
    }

    setIsVisible(true)
    setIsLoading(true)

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") initiateClose()
    }

    window.addEventListener("keydown", handleEscKey)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleEscKey)
    }
  }, [activeUrl, pdfUrl, initiateClose, onClose, openInNewTab])

  if (!activeUrl || !isVisible) return null

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-16"
      onClick={(e) => {
        if (e.target === e.currentTarget) initiateClose()
      }}
    >
      <div
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
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[#333]">
          <button
            onClick={() => (pdfUrl ? downloadPdf(pdfUrl) : openInNewTab(activeUrl || ""))}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
            aria-label={pdfUrl ? "Download PDF" : "Open in new tab"}
          >
            <FaExternalLinkAlt size={16} />
            <span className="hidden sm:inline">{pdfUrl ? "Download" : "Open in new tab"}</span>
          </button>
          <button
            onClick={initiateClose}
            aria-label="Close Preview"
            className="text-white hover:text-red-500 transition p-1 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* PDF View */}
        <div className="flex-1 overflow-auto relative bg-[#1a1a1a]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] z-10">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
          {isImagePreview ? (
            <div className="relative w-full h-[calc(100vh-150px)] max-h-[75vh] min-h-[300px]">
              <Image
                src={activeUrl}
                alt={imageAlt || "Image preview"}
                fill
                sizes="100vw"
                className="object-contain"
                onLoadingComplete={() => setIsLoading(false)}
              />
            </div>
          ) : (
            <iframe
              src={activeUrl}
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

export default PDFModalViewer
