"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import ContactFormModal from "./ContactFormModal"
import { FaShieldAlt, FaUserShield, FaLink, FaCookie } from "react-icons/fa"

interface SecurityPolicyModalProps {
  onClose: () => void
}

export default function SecurityPolicyModal({ onClose }: SecurityPolicyModalProps) {
  const [showContact, setShowContact] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      onClose()
    }, 300) // match animation duration
  }
  
  if (!mounted) return null

const modalContent = (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div 
        className={`bg-[#222222] rounded-xl border border-[#333333] shadow-lg relative max-w-4xl w-full max-h-[90vh] flex flex-col ${
          isAnimatingOut ? "animate-fade-out-down" : "animate-fade-in-up"
        }`}
        style={{ 
          contain: 'layout style paint'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 pb-4 flex-shrink-0">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl transition-colors z-10"
          aria-label="Close"
        >
          &times;
        </button>


        <h1 className="text-3xl font-bold text-white mb-8 relative text-center">
          Security Policy
          <span className="absolute bottom-[-8px] left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-500"></span>
        </h1>
        </div>

        <div className="px-8 pb-8 overflow-y-auto flex-1" style={{ 
          overscrollBehavior: 'contain'
        }}>
        <div className="space-y-8">
          <section className="bg-[#1e1e1e] p-6 rounded-xl border border-[#333333] transition-colors duration-200 hover:border-red-600/50">
            <div className="flex items-center gap-3 mb-4">
              <FaShieldAlt className="text-red-500 text-xl" />
              <h2 className="text-xl font-semibold text-white">
                Reporting Security Issues
              </h2>
            </div>
            <div className="text-gray-300">
              <p className="mb-4">
                If you discover a security vulnerability or have concerns about the website&apos;s security,
                please get in touch immediately. All reports will be investigated promptly.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowContact(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg gap-2 transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                >
                  Contact Me
                </button>
              </div>
            </div>
          </section>

          <section className="bg-[#1e1e1e] p-6 rounded-xl border border-[#333333] transition-colors duration-200 hover:border-red-600/50">
            <div className="flex items-center gap-3 mb-4">
              <FaUserShield className="text-red-500 text-xl" />
              <h2 className="text-xl font-semibold text-white">
                Data Protection
              </h2>
            </div>
            <div className="text-gray-300 space-y-2">
              <p>
                This website prioritizes your privacy and data protection:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>No personal information is collected or stored</li>
                <li>Analytics are anonymized for performance monitoring only</li>
                <li>No tracking cookies are used without explicit consent</li>
                <li>Data is transmitted securely using HTTPS</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#1e1e1e] p-6 rounded-xl border border-[#333333] transition-colors duration-200 hover:border-red-600/50">
            <div className="flex items-center gap-3 mb-4">
              <FaLink className="text-red-500 text-xl" />
              <h2 className="text-xl font-semibold text-white">
                External Links
              </h2>
            </div>
            <div className="text-gray-300 space-y-2">
              <p>
                This website includes links to external websites and resources:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All external links are clearly marked</li>
                <li>Users are notified before leaving the site</li>
                <li>Third-party content is reviewed for safety</li>
                <li>I am not responsible for external website content</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#1e1e1e] p-6 rounded-xl border border-[#333333] transition-colors duration-200 hover:border-red-600/50">
            <div className="flex items-center gap-3 mb-4">
              <FaCookie className="text-red-500 text-xl" />
              <h2 className="text-xl font-semibold text-white">
                Cookie Policy
              </h2>
            </div>
            <div className="text-gray-300 space-y-2">
              <p>
                This website uses cookies responsibly:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Essential cookies for basic functionality only</li>
                <li>No tracking or analytics cookies without consent</li>
                <li>Session cookies are removed when you close your browser</li>
                <li>You can disable cookies in your browser settings</li>
              </ul>
            </div>
          </section>
        </div>
        </div>
      </div>
      {showContact && <ContactFormModal onClose={() => setShowContact(false)} />}
    </div>
  )

  return createPortal(modalContent, document.body)
}