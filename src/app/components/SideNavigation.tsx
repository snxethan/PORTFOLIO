"use client"

import { useState, useEffect } from "react"
import { FaThumbtack } from "react-icons/fa"

interface NavSection {
  id: string
  label: string
}

interface SideNavigationProps {
  sections: NavSection[]
  activeSection?: string
}

const SideNavigation: React.FC<SideNavigationProps> = ({ sections, activeSection }) => {
  const [isPinned, setIsPinned] = useState(true)
  const [currentSection, setCurrentSection] = useState<string | undefined>(activeSection)

  useEffect(() => {
    // Load pin preference from localStorage
    const savedPinState = localStorage.getItem("sideNavPinned")
    if (savedPinState !== null) {
      setIsPinned(savedPinState === "true")
    }
  }, [])

  useEffect(() => {
    setCurrentSection(activeSection)
  }, [activeSection])

  const handlePinToggle = () => {
    const newPinState = !isPinned
    setIsPinned(newPinState)
    localStorage.setItem("sideNavPinned", String(newPinState))
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const yOffset = -100 // Offset for fixed headers
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
      setCurrentSection(sectionId)
    }
  }

  if (!isPinned) {
    return null
  }

  if (sections.length === 0) {
    return null
  }

  return (
    <div className="fixed right-8 top-32 hidden xl:block z-10">
      <div className="bg-[#1e1e1e] border border-[#333333] rounded-lg p-4 min-w-[200px] shadow-lg">
        {/* Header with pin toggle */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#333333]">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
            Sections
          </h3>
          <button
            onClick={handlePinToggle}
            className={`text-lg transition-colors duration-300 ${
              isPinned ? "text-red-500 hover:text-red-400" : "text-gray-500 hover:text-gray-400"
            }`}
            aria-label={isPinned ? "Unpin navigation" : "Pin navigation"}
            title={isPinned ? "Unpin navigation" : "Pin navigation"}
          >
            <FaThumbtack className={`transition-transform duration-300 ${isPinned ? "" : "rotate-45"}`} />
          </button>
        </div>

        {/* Navigation links */}
        <nav>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                    currentSection === section.id
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white font-medium"
                      : "text-gray-300 hover:bg-[#252525] hover:text-white"
                  }`}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default SideNavigation
