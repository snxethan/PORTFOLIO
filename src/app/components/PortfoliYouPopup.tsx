"use client"

import { useEffect } from "react"
import { FaPalette, FaTimes, FaExternalLinkAlt, FaGithub, FaRocket } from "react-icons/fa"

interface PortfoliYouPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function PortfoliYouPopup({ isOpen, onClose }: PortfoliYouPopupProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#222222] border border-[#333333] rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-elastic-light">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333333]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-red-600 to-red-500 rounded-lg">
              <FaPalette className="text-white text-lg" />
            </div>
            <h2 className="text-2xl font-bold text-white">Portfoli-You</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#333333] transition-colors duration-200"
            aria-label="Close popup"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tagline */}
          <div className="text-center">
            <p className="text-gray-300 text-lg italic mb-2">
              A portfolio for you, by you
            </p>
            <div className="w-20 h-[2px] mx-auto bg-gradient-to-r from-red-600 to-red-500 rounded-full" />
          </div>

          {/* Description */}
          <div className="text-gray-400 text-sm leading-relaxed">
            <p className="mb-4">
              Portfoli-You is a revolutionary portfolio creation platform designed to help professionals 
              showcase their unique talents and achievements through stunning, personalized portfolios.
            </p>
            <p>
              Build beautiful, responsive portfolios that truly represent your professional journey 
              and stand out in today&apos;s competitive landscape.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg">Key Features:</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                Drag-and-drop portfolio builder
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                Professional templates & themes
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                Mobile-responsive designs
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                Custom domain support
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                Analytics & performance tracking
              </li>
            </ul>
          </div>

          {/* Status */}
          <div className="bg-[#2a1f1f] border border-red-600/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaRocket className="text-red-500" />
              <span className="text-red-400 font-semibold">Coming Soon</span>
            </div>
            <p className="text-gray-400 text-sm">
              Portfoli-You is currently in development. Stay tuned for the official launch!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href="/portfoli-you"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95"
            >
              <FaExternalLinkAlt />
              Learn More
            </a>
            
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://github.com/snxethan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#333333] hover:bg-[#404040] text-gray-200 hover:text-white rounded-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95 text-sm"
              >
                <FaGithub />
                GitHub
              </a>
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#333333] hover:bg-[#404040] text-gray-200 hover:text-white rounded-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}