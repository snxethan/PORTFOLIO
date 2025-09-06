"use client"

import React, { useEffect, useState, useCallback } from "react"
import { X, Loader2 } from "lucide-react"
import { FaExternalLinkAlt } from "react-icons/fa";
import ReactDOM from "react-dom"

interface PDFModalViewerProps {
  pdfUrl: string | null
  onClose: () => void
}

const isPdfSupported = (): boolean => {
  const ua = navigator.userAgent.toLowerCase()
  
  // Check for very old browsers or specific problematic cases
  const isOldIOS = /iphone.*os [5-9]_|ipad.*os [5-9]_/.test(ua) // iOS 9 and below
  const isOldAndroid = /android [2-4]\./.test(ua) // Android 4 and below
  
  // Most modern browsers support PDF viewing, so we'll be less restrictive
  // Only block very old versions or known problematic cases
  return !(isOldIOS || isOldAndroid)
}

const PDFModalViewer: React.FC<PDFModalViewerProps> = ({ pdfUrl, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [isUnsupported, setIsUnsupported] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const initiateClose = useCallback(() => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setIsAnimatingOut(false)
      setIsVisible(false)
      onClose()
    }, 300)
  }, [onClose])

  useEffect(() => {
    if (pdfUrl) {
      setIsVisible(true)
      setIsUnsupported(!isPdfSupported())

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
    }
  }, [pdfUrl, initiateClose])

  if (!pdfUrl || !isVisible) return null

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-16"
      onClick={(e) => {
        if (e.target === e.currentTarget) initiateClose()
      }}
    >
      <div
        className={`relative bg-[#1a1a1a] border border-[#333] rounded-xl w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] shadow-xl overflow-hidden flex flex-col ${
          isAnimatingOut ? "animate-elastic-out" : "animate-elastic-in"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[#333] bg-[#1a1a1a]">
          <button
            onClick={() => window.open(pdfUrl || "", "_blank")}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 transition-all text-sm sm:text-base"
            aria-label="Download or open in new tab"
          >
            <FaExternalLinkAlt size={14} />
            <span className="hidden sm:inline">Open in new tab</span>
            <span className="sm:hidden">Open</span>
          </button>
          <button
            onClick={initiateClose}
            aria-label="Close Preview"
            className="text-white hover:text-red-500 transition p-1 rounded-full"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* PDF View / Fallback */}
        <div className="flex-1 overflow-auto relative bg-[#1a1a1a]">
          {isUnsupported ? (
            <div className="flex flex-col items-center justify-center h-full text-white text-sm p-6 text-center space-y-4">
              <p>PDF preview may not display optimally on this device.</p>
              <p className="text-gray-400">For the best experience, please open the PDF in a new tab.</p>
              <button
                onClick={() => window.open(pdfUrl || "", "_blank")}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
              >
                <FaExternalLinkAlt size={16} />
                Open PDF in New Tab
              </button>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
              <iframe
                src={pdfUrl}
                className="w-full min-h-[400px] sm:min-h-[600px] h-[calc(100vh-120px)] sm:h-[calc(100vh-150px)] max-h-[75vh] border-none"
                onLoad={() => setIsLoading(false)}
                loading="lazy"
              />
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default PDFModalViewer
