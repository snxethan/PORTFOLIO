"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"

/**
 * TypeScript interface for the external link context
 * Defines the shape of data and functions available to consuming components
 */
interface ExternalLinkContextType {
  showWarning: boolean
  targetUrl: string
  isProfessional: boolean
  handleExternalClick: (url: string, isProfessional?: boolean) => void
  closeWarning: () => void
}

/**
 * React context for managing external link warnings throughout the app
 * Provides a centralized way to handle external navigation with user consent
 */
const ExternalLinkContext = createContext<ExternalLinkContextType | undefined>(
  undefined
)

/**
 * ExternalLinkHandler component that provides security warnings for external links
 * Distinguishes between professional and social/personal platforms
 * Includes modal overlay with smooth animations and accessibility features
 * 
 * @param children - React components to wrap with external link handling
 */
export const ExternalLinkHandler = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [targetUrl, setTargetUrl] = useState("")
  const [isProfessional, setIsProfessional] = useState(false)

  /**
   * Handles external link clicks by showing appropriate warning modal
   * @param url - The external URL to navigate to
   * @param isProfessional - Whether this is a professional platform (affects warning text)
   */
  const handleExternalClick = (url: string, isProfessional: boolean = false) => {
    setTargetUrl(url)
    setIsProfessional(isProfessional)
    setIsVisible(true)
  }

  /**
   * Closes the warning modal with animation
   * Resets all state after animation completes
   */
  const closeWarning = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setIsAnimatingOut(false)
      setIsVisible(false)
      setTargetUrl("")
      setIsProfessional(false)
    }, 300) // Match CSS animation duration
  }

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }

    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [isVisible])

  return (
    <ExternalLinkContext.Provider
      value={{
        showWarning: isVisible,
        targetUrl,
        isProfessional,
        handleExternalClick,
        closeWarning,
      }}
    >
      {children}
      
      {/* External link warning modal */}
        {isVisible && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 animate-fade-in p-4"
            onClick={closeWarning}
          >
            <div
              className={`bg-[#1a1a1a] border border-[#333] rounded-xl p-6 max-w-md w-full text-center relative ${
                isAnimatingOut ? "animate-elastic-out" : "animate-elastic-in"
              }`}
              onClick={(e) => e.stopPropagation()}
            >

            {/* Close button */}
            <button
              onClick={closeWarning}
              aria-label="Close"
              className="absolute top-1 right-3 text-gray-400 hover:text-red-500 text-4xl"
            >
              &times;
            </button>

            {/* Modal header */}
            <h3 className="text-xl font-semibold text-white mb-2">
              External Link Notice
            </h3>

            {/* Conditional warning text based on platform type */}
            {isProfessional ? (
              <>
                <p className="text-gray-300 text-sm mb-4">
                  You are about to visit a <b>professional platform</b> or
                  external resource.
                </p>
                <p className="text-gray-200 text-sm mb-4">
                  The content on this platform may not reflect my personal views
                  and is owned by a third party.
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-300 text-sm mb-4">
                  You are about to visit a <b>social platform</b> or external
                  resource.
                </p>
                <p className="text-gray-200 text-sm mb-4">
                  Please note that the content on this platform does not reflect
                  my professional identity or represent me in any official
                  capacity.
                </p>
              </>
            )}

            <p className="text-gray-100 text-sm mb-4">
              Please proceed with <b>caution</b>.
            </p>

            {/* Continue button that opens external link */}
            <div className="flex justify-center gap-4">
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeWarning}
                className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg transition-all"
              >
                Continue
              </a>
            </div>
          </div>
        </div>
      )}
    </ExternalLinkContext.Provider>
  )
}

/**
 * Custom hook for accessing external link context
 * Must be used within components wrapped by ExternalLinkHandler
 * 
 * @returns ExternalLinkContextType object with state and functions
 * @throws Error if used outside of ExternalLinkHandler context
 */
export const useExternalLink = () => {
  const context = useContext(ExternalLinkContext)
  if (!context) {
    throw new Error("useExternalLink must be used within an ExternalLinkHandler")
  }
  return context
}
