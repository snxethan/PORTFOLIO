"use client"

import { useState, useEffect } from "react"
import ContactFormModal from "./ContactFormModal"
import { FaShieldAlt, FaUserShield, FaLink, FaCookie } from "react-icons/fa"

interface SecurityPolicyModalProps {
  onClose: () => void
}

export default function SecurityPolicyModal({ onClose }: SecurityPolicyModalProps) {
  const [showContact, setShowContact] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
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

return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div 
        className={`bg-[#222222] rounded-xl border border-[#333333] shadow-lg p-8 relative max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
          isAnimatingOut ? "animate-elastic-out" : "animate-elastic-in"
        }`}
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
          Security Policy
          <span className="absolute bottom-[-8px] left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-500"></span>
        </h1>

        <div className="space-y-8">
          <section className="bg-[#1e1e1e] p-6 rounded-xl border border-[#333333] hover:border-red-600/50 transition-transform duration-300 ease-out hover:scale-[1.03]">
            <div className="flex items-center gap-3 mb-4">
              <FaShieldAlt className="text-red-500 text-xl" />
              <h2 className="text-xl font-semibold text-white">
                Reporting Security Issues
              </h2>
            </div>
            <div className="text-gray-300">
              <p className="mb-4">
                If you discover a security vulnerability or have concerns about the website's security,
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

          <section className="bg-[#1e1e1e] p-6 rounded-xl border border-[#333333] hover:border-red-600/50 transition-transform duration-300 ease-out hover:scale-[1.03]">
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

          <section className="bg-[#1e1e1e] p-6 rounded-xl border border-[#333333] hover:border-red-600/50 transition-transform duration-300 ease-out hover:scale-[1.03]">
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

          <section className="bg-[#1e1e1e] p-6 rounded-xl border border-[#333333] hover:border-red-600/50 transition-transform duration-300 ease-out hover:scale-[1.03]">
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
      {showContact && <ContactFormModal onClose={() => setShowContact(false)} />}
    </div>
  )
}