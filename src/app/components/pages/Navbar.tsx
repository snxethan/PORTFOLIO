"use client"

import { useState, useEffect, useRef } from "react"
import { FaThumbtack, FaHome } from "react-icons/fa"
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md"
import Link from "next/link"

interface NavbarProps {
  onTabChange: (page: string, tab: string) => void
  activePage: string | null
  activeTab: string | null
  onPinChange?: (isPinned: boolean) => void
  onLayoutChange?: (isExpanded: boolean) => void
}

const Navbar = ({ onTabChange, activePage, activeTab, onPinChange, onLayoutChange }: NavbarProps) => {
  // Only show loading state if page data hasn't been initialized (undefined), not if it's explicitly null (homepage)
  const isLoading = activePage === undefined || activeTab === undefined
  const [clickedTab, setClickedTab] = useState<string | null>(null)
  
  // Load persisted states from localStorage or use defaults
  const [isNavPinned, setIsNavPinned] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('navbarPinned')
      if (saved !== null) {
        return saved === 'true'
      }
      return window.innerWidth < 1024 // default: pinned on mobile/tablet, unpinned on desktop
    }
    return true
  })
  
  const [isHorizontalScroll, setIsHorizontalScroll] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('navbarLayout')
      if (saved !== null) {
        return saved === 'horizontal'
      }
      return true // default: horizontal scroll
    }
    return true
  })
  
  const [needsToggle, setNeedsToggle] = useState(false) // true if content overflows and needs scroll
  const [isTransitioning, setIsTransitioning] = useState(false) // Prevent rapid clicks during transition
  const navContentRef = useRef<HTMLDivElement>(null)
  const isCheckingOverflow = useRef(false) // Prevent concurrent overflow checks

  // Persist pin state to localStorage and notify parent
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('navbarPinned', isNavPinned.toString())
    }
    onPinChange?.(isNavPinned)
  }, [isNavPinned, onPinChange])

  // Persist layout state to localStorage and notify parent
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('navbarLayout', isHorizontalScroll ? 'horizontal' : 'wrap')
    }
    onLayoutChange?.(!isHorizontalScroll) // true when expanded/wrap mode
  }, [isHorizontalScroll, onLayoutChange])

  // Check if the nav content overflows and needs scrolling
  useEffect(() => {
    const checkOverflow = () => {
      if (isCheckingOverflow.current || isTransitioning) return // Prevent checks during transitions
      isCheckingOverflow.current = true
      
      if (navContentRef.current) {
        const hasOverflow = navContentRef.current.scrollWidth > navContentRef.current.clientWidth
        // Show toggle if: 
        // 1. Content has overflow (needs scroll) - ANYTIME it needs to scroll, show the expand button
        // 2. In wrap mode (always show to allow going back to horizontal)
        setNeedsToggle(hasOverflow || !isHorizontalScroll)
      }
      isCheckingOverflow.current = false
    }

    // Use requestAnimationFrame to ensure DOM has rendered before checking
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(checkOverflow)
    }, 0)
    
    window.addEventListener('resize', checkOverflow)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', checkOverflow)
    }
  }, [isHorizontalScroll, isLoading, activePage, activeTab, isTransitioning])

  // Define tab groups with their respective sections
  const tabGroups = [
    {
      name: "Ethan Townsend",
      tabs: [
        { id: "certifications", label: "Certifications", page: "about" },
        { id: "skills", label: "Skills", page: "about" }
      ]
    },
    {
      name: "Ethan Townsend",
      tabs: [
        { id: "experience", label: "Experience", page: "resume" },
        { id: "education", label: "Education", page: "resume" }
      ]
    },
    {
      name: "Ethan Townsend",
      tabs: [
        { id: "projects", label: "Projects", page: "portfolio" },
        { id: "repositories", label: "Repositories", page: "portfolio" }
      ]
    }
  ]

  const handleClick = (page: string, tab: string) => {
    const currentKey = `${activePage}/${activeTab}`
    const newKey = `${page}/${tab}`
    
    if (currentKey === newKey) return // prevent redundant clicks

    setClickedTab(newKey)
    onTabChange(page, tab)

    // Remove animation class after it finishes (~300ms)
    setTimeout(() => setClickedTab(null), 300)
  }

  return (
    <nav className={`w-full bg-[#222222] py-4 ${isNavPinned ? 'fixed' : 'relative'} top-0 left-0 z-50 border-b border-[#333333] md:border-0 transition-all duration-300 ease-in-out`}>
      <div className="container mx-auto">
        {/* Title with Home icon (left), Layout toggle (right, left of pin) and Pin button (right) */}
        <div className="flex items-center justify-center mb-3 relative">
          {/* Home icon button - positioned to the left of title */}
          <Link
            href="/"
            className={`absolute left-4 p-2 rounded-lg transition-all duration-200 border ${
              activePage === null
                ? "bg-red-600 border-red-600 shadow-lg shadow-red-600/30" // Active state
                : "border-transparent hover:border-red-600/70 hover:shadow-lg hover:shadow-red-600/30 hover:scale-105 group" // Inactive state
            }`}
            aria-label="Home"
            title="Go to Home"
          >
            <FaHome className={`w-5 h-5 transition-colors ${
              activePage === null
                ? "text-white" // Active: white icon
                : "text-gray-400 group-hover:text-[#dc2626]" // Inactive: gray with red hover
            }`} />
          </Link>
          
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent transition-transform duration-200 ease-out hover:scale-110">
            My Portfolio
          </h1>
          
          {/* Layout toggle button - only visible when content overflows in horizontal mode */}
          {needsToggle && (
            <button
              onClick={() => {
                if (isTransitioning) return // Prevent rapid clicks
                setIsTransitioning(true)
                setIsHorizontalScroll(!isHorizontalScroll)
                // Reset after animation completes - increased to 500ms for stability
                setTimeout(() => setIsTransitioning(false), 500)
              }}
              className={`absolute right-16 p-1 transition-all duration-300 ${
                isTransitioning 
                  ? "opacity-50 cursor-not-allowed scale-100" 
                  : "hover:scale-110"
              } ${
                isHorizontalScroll 
                  ? "text-gray-400 hover:text-red-500" 
                  : "text-red-600"
              }`}
              aria-label={isHorizontalScroll ? "Switch to wrap layout (buttons will wrap)" : "Switch to horizontal scroll (buttons will scroll horizontally)"}
              title={isHorizontalScroll ? "Click for wrap layout" : "Click for horizontal scroll"}
              disabled={isTransitioning}
            >
              {isHorizontalScroll ? (
                <MdKeyboardArrowDown size={18} className="transition-transform duration-200" />
              ) : (
                <MdKeyboardArrowRight size={18} className="transition-transform duration-200" />
              )}
            </button>
          )}
          
          {/* Pin/Unpin toggle button - visible on all screen sizes, positioned to the right of title */}
          <button
            onClick={() => setIsNavPinned(!isNavPinned)}
            className={`absolute right-4 p-1 transition-all duration-300 hover:scale-110 ${
              isNavPinned 
                ? "text-red-600" 
                : "text-gray-400 hover:text-red-500"
            }`}
            aria-label={isNavPinned ? "Unpin navigation (navbar will not follow scroll)" : "Pin navigation (navbar will follow scroll)"}
            title={isNavPinned ? "Click to unpin" : "Click to pin"}
          >
            <FaThumbtack size={18} className={`transition-transform duration-300 ${isNavPinned ? "rotate-0" : "rotate-45"}`} />
          </button>
        </div>
        
        {/* Navigation subsections - horizontal scroll OR wrap based on toggle */}
        <div 
          ref={navContentRef}
          className={`flex gap-3 max-w-5xl mx-auto pb-2 transition-all duration-500 ease-in-out ${
            isHorizontalScroll 
              ? `flex-row overflow-x-auto navbar-scroll px-4 ${needsToggle ? 'justify-start' : 'justify-center'}` 
              : 'flex-wrap justify-center overflow-x-visible'
          }`}
          style={isHorizontalScroll ? {
            scrollbarWidth: 'thin',
            scrollbarColor: '#dc2626 transparent',
          } : {}}
        >
          {isLoading ? (
            <div className="flex space-x-4 animate-pulse justify-center">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-20 h-8 bg-[#333333] rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              {/* Subsection 1: Certifications & Skills */}
              <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-6 flex-shrink-0">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {tabGroups[0].tabs.map((tab) => {
                    const tabKey = `${tab.page}/${tab.id}`
                    const isActive = activePage === tab.page && activeTab === tab.id
                    
                    return (
                      <button
                        key={tabKey}
                        onClick={() => handleClick(tab.page, tab.id)}
                        disabled={isActive}
                        className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 border ${
                          isActive
                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-lg shadow-red-600/40 cursor-default border-transparent"
                            : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-[#dc2626] hover:border-red-600 hover:shadow-lg hover:shadow-red-600/30 cursor-pointer border-transparent"
                        }`}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Subsection 2: Experience & Education */}
              <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-6 flex-shrink-0">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {tabGroups[1].tabs.map((tab) => {
                    const tabKey = `${tab.page}/${tab.id}`
                    const isActive = activePage === tab.page && activeTab === tab.id
                    
                    return (
                      <button
                        key={tabKey}
                        onClick={() => handleClick(tab.page, tab.id)}
                        disabled={isActive}
                        className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 border ${
                          isActive
                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-lg shadow-red-600/40 cursor-default border-transparent"
                            : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-[#dc2626] hover:border-red-600 hover:shadow-lg hover:shadow-red-600/30 cursor-pointer border-transparent"
                        }`}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Subsection 3: Projects & Repositories */}
              <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-6 flex-shrink-0">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {tabGroups[2].tabs.map((tab) => {
                    const tabKey = `${tab.page}/${tab.id}`
                    const isActive = activePage === tab.page && activeTab === tab.id
                    
                    return (
                      <button
                        key={tabKey}
                        onClick={() => handleClick(tab.page, tab.id)}
                        disabled={isActive}
                        className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 border ${
                          isActive
                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-lg shadow-red-600/40 cursor-default border-transparent"
                            : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-[#dc2626] hover:border-red-600 hover:shadow-lg hover:shadow-red-600/30 cursor-pointer border-transparent"
                        }`}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
