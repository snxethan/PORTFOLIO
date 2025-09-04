"use client"

import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  ReactNode,
} from "react"
import { Loader2 } from "lucide-react"

interface PdfThumbnailTooltipProps {
  label: string
  children: ReactNode
  url?: string
  fullWidth?: boolean
}

const TooltipWrapper = ({ label, children, url, fullWidth = false }: PdfThumbnailTooltipProps) => {
  const [visible, setVisible] = useState(false)
  const [thumbnailLoading, setThumbnailLoading] = useState(false)
  const [thumbnailError, setThumbnailError] = useState(false)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isHovering = useRef(false)

  const isPdf = useMemo(() => url?.toLowerCase().endsWith(".pdf") ?? false, [url])

  const handleMouseEnter = useCallback(() => {
    isHovering.current = true
    timeoutRef.current = setTimeout(() => {
      if (isHovering.current) {
        setVisible(true)
        if (isPdf) {
          setThumbnailLoading(true)
          setThumbnailError(false)
        }
      }
    }, 500)
  }, [isPdf])

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setVisible(false)
    setThumbnailLoading(false)
  }, [])

  const handleThumbnailLoad = () => setThumbnailLoading(false)
  const handleThumbnailError = () => {
    setThumbnailLoading(false)
    setThumbnailError(true)
  }

  return (
    <div
      className={`relative group ${fullWidth ? "w-full" : "inline-block"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <>
          {isPdf ? (
            <div
              role="tooltip"
              aria-label={label}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1a1a1a] border border-[#333] rounded-md shadow-xl z-50 p-2 w-[220px] max-w-[90vw] transition-all duration-200 ease-out opacity-100 animate-fade-in-gentle"
            >
              <div className="flex flex-col items-center">
                <div className="text-xs text-white mb-1 font-medium">{label}</div>
                <div className="relative w-full h-[260px] bg-[#111] rounded overflow-hidden">
                  {thumbnailLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#111]">
                      <Loader2 className="h-6 w-6 animate-spin text-white/70" />
                    </div>
                  )}

                  {thumbnailError ? (
                    <div className="absolute inset-0 flex items-center justify-center text-white/70 text-xs p-2 text-center">
                      Unable to generate preview
                    </div>
                  ) : (
                    <embed
                      src={url}
                      type="application/pdf"
                      className="w-full h-full min-h-[260px]"
                      onLoad={handleThumbnailLoad}
                      onError={handleThumbnailError}
                    />
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <div className="flex items-center justify-between text-xs text-white">
                      <span className="truncate max-w-[140px]">PDF Document</span>
                      <span className="text-white/70">Preview</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              role="tooltip"
              aria-label={label}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-red-600 text-white rounded-md shadow-md z-50 whitespace-nowrap transition-all duration-200 ease-out opacity-100 animate-fade-in-gentle"
            >
              {label}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TooltipWrapper
