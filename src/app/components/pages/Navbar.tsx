"use client"

import { useState, useEffect, useRef } from "react"
import { FaThumbtack, FaUser, FaBriefcase, FaFolderOpen } from "react-icons/fa"

interface NavbarProps {
  onTabChange: (page: string, tab: string | null) => void
  activePage: string | null
  activeTab: string | null
  onPinChange?: (isPinned: boolean) => void
  onLayoutChange?: (isExpanded: boolean) => void
}

const Navbar = ({ onTabChange, activePage, activeTab, onPinChange, onLayoutChange }: NavbarProps) => {
  // Only show loading state if page data hasn't been initialized (undefined), not if it's explicitly null (homepage)
  const isLoading = activePage === undefined || activeTab === undefined

  // Always start pinned when the user accesses the site
  const [isNavPinned, setIsNavPinned] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('navbarPinned')
      if (saved !== null) {
        return saved === 'true'
      }
    }
    return true
  })

  const [isHorizontalScroll] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('navbarLayout')
      if (saved !== null) {
        return saved === 'horizontal'
      }
      return false // default: wrap layout
    }
    return false
  })
  
  const [needsToggle, setNeedsToggle] = useState(false) // true if content overflows and needs scroll
  const [isPinAnimating, setIsPinAnimating] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const navContentRef = useRef<HTMLDivElement>(null)
  const isCheckingOverflow = useRef(false) // Prevent concurrent overflow checks

  useEffect(() => {
    if (!navRef.current || typeof window === "undefined") return

    const updateHeight = () => {
      if (!navRef.current) return
      const height = navRef.current.getBoundingClientRect().height
      document.documentElement.style.setProperty("--navbar-height", `${height}px`)
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(navRef.current)

    return () => observer.disconnect()
  }, [])

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
      if (isCheckingOverflow.current) return
      isCheckingOverflow.current = true
      
      if (navContentRef.current) {
        const hasOverflow = navContentRef.current.scrollWidth > navContentRef.current.clientWidth
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
  }, [isHorizontalScroll, isLoading, activePage, activeTab])

  // Main tabs for the top-level sections
  const mainTabs = [
    { id: "about", label: "About", defaultTab: null, icon: <FaUser /> },
    { id: "career", label: "Career", defaultTab: "experience", icon: <FaBriefcase /> },
    { id: "projects", label: "Projects", defaultTab: "projects", icon: <FaFolderOpen /> },
  ]

  const handleClick = (page: string, tab: string | null) => {
    const currentKey = `${activePage}/${activeTab ?? ""}`
    const newKey = `${page}/${tab ?? ""}`

    if (currentKey === newKey) return // prevent redundant clicks

    onTabChange(page, tab)
  }

  useEffect(() => {
    if (!isPinAnimating) return
    const timer = setTimeout(() => setIsPinAnimating(false), 380)
    return () => clearTimeout(timer)
  }, [isPinAnimating])

  const handlePinToggle = () => {
    setIsNavPinned((prev) => !prev)
    setIsPinAnimating(true)
  }

  return (
    <nav
      ref={navRef}
      className={`w-full bg-[#222222] py-4 px-6 md:px-8 lg:px-10 ${isNavPinned ? 'fixed ring-1 ring-[#2a2a2a] shadow-lg shadow-black/20' : 'relative'} top-0 left-0 z-50 border-b border-[#333333] md:border-0 transition-all duration-300 ease-in-out ${isPinAnimating ? "animate-pin-bounce" : ""}`}
    >
      <div className="container mx-auto">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center justify-center lg:justify-start">
            <h1 className="w-full text-2xl font-bold text-center lg:text-left bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              ethantownsend.dev
            </h1>
            <button
              onClick={handlePinToggle}
              className={`lg:hidden p-1 transition-all duration-300 hover:scale-110 ${
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

          <div className="flex items-center gap-3 lg:ml-auto lg:justify-end w-full lg:w-auto">
            <div
              ref={navContentRef}
              className={`flex gap-3 transition-all duration-500 ease-in-out w-full lg:w-auto ${
                isHorizontalScroll
                  ? `flex-row overflow-x-auto navbar-scroll ${needsToggle ? 'justify-start' : 'justify-center'}`
                  : 'flex-wrap justify-center lg:justify-end'
              }`}
              style={isHorizontalScroll ? {
                scrollbarWidth: 'thin',
                scrollbarColor: '#dc2626 transparent',
              } : {}}
            >
              {isLoading ? (
                <div className="flex space-x-4 animate-pulse justify-center w-full">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-24 h-9 bg-[#333333] rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-3 px-4 flex items-center gap-2 flex-wrap justify-center lg:justify-end w-full lg:w-auto">
                  {mainTabs.map((tab) => {
                    const isActive = activePage === tab.id

                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleClick(tab.id, tab.defaultTab)}
                        disabled={isActive}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 border focus:outline-none focus-visible:outline-none ${
                          isActive
                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-lg shadow-red-600/40 cursor-default border-transparent"
                            : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-[#dc2626] hover:border-red-600 hover:shadow-lg hover:shadow-red-600/30 cursor-pointer border-transparent"
                        }`}
                      >
                        {tab.icon && <span className="text-lg">{tab.icon}</span>}
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <button
              onClick={handlePinToggle}
              className={`hidden lg:inline-flex p-1 transition-all duration-300 hover:scale-110 ${
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
        </div>
      </div>
    </nav>
  )
}

export default Navbar
