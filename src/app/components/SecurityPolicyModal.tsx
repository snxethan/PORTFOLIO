"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { FaShieldAlt, FaUserShield, FaLink } from "react-icons/fa"

interface SecurityPolicyModalProps {
  onClose: () => void
}

export default function SecurityPolicyModal({ onClose }: SecurityPolicyModalProps) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.classList.add('overflow-hidden')
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      onClose()
    }, 300) // match animation duration
  }

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div 
        className={`bg-[#222222] rounded-xl border border-[#333333] shadow-lg p-8 relative max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
          isAnimatingOut ? "animate-fade-out-down" : "animate-fade-in-up"
        }`}
        style={{ 
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden' as const,
          WebkitOverflowScrolling: 'touch' as const
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl transition-colors"
          aria-label="Close"
        >
          &times;
        </button>


        <h1 className="text-3xl font-bold text-white mb-8 relative text-center">
          Site Notes
          <span className="absolute bottom-[-8px] left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-500"></span>
        </h1>

        <div className="space-y-6">
          <section className="bg-[#1e1e1e] p-6 rounded-xl border border-[#333333]">
            <div className="flex items-center gap-3 mb-3">
              <FaShieldAlt className="text-red-500 text-xl" />
              <h2 className="text-xl font-semibold text-white">Privacy & Security</h2>
            </div>
            <p className="text-gray-300">
              This site does not collect personal data and only serves content over HTTPS.
            </p>
          </section>

          <section className="bg-[#1e1e1e] p-6 rounded-xl border border-[#333333]">
            <div className="flex items-center gap-3 mb-3">
              <FaUserShield className="text-red-500 text-xl" />
              <h2 className="text-xl font-semibold text-white">Data Handling</h2>
            </div>
            <p className="text-gray-300">
              No tracking cookies are used. Any optional analytics are anonymized.
            </p>
          </section>

          <section className="bg-[#1e1e1e] p-6 rounded-xl border border-[#333333]">
            <div className="flex items-center gap-3 mb-3">
              <FaLink className="text-red-500 text-xl" />
              <h2 className="text-xl font-semibold text-white">External Links</h2>
            </div>
            <p className="text-gray-300">
              External links open in new tabs so you can easily return here.
            </p>
          </section>
        </div>
      </div>
    </div>
  )

  // Only render if mounted (client-side) to avoid hydration issues
  if (!mounted) return null

  // Use portal to render the modal at the document root level
  return createPortal(modalContent, document.body)
}