"use client"
import React, { useEffect } from "react"

interface PDFModalViewerProps {
  pdfUrl: string | null
  onClose: () => void
}

const PDFModalViewer: React.FC<PDFModalViewerProps> = ({ pdfUrl, onClose }) => {
  useEffect(() => {
    if (pdfUrl) document.body.classList.add("overflow-hidden")
    return () => document.body.classList.remove("overflow-hidden")
  }, [pdfUrl])

  if (!pdfUrl) return null

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center p-4">
      <div className="relative bg-[#1a1a1a] border border-[#333] rounded-xl w-full max-w-4xl h-[80vh] shadow-xl overflow-hidden">
        <button
          onClick={onClose}
          aria-label="Close Preview"
          className="absolute top-3 right-1 text-white text-3xl hover:text-red-500 transition"
        >
          &times;
        </button>
        <embed
          src={pdfUrl}
          type="application/pdf"
          className="w-full h-full rounded-b-xl"
        />
      </div>
    </div>
  )
}

export default PDFModalViewer
