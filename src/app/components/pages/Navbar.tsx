"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { FaThumbtack, FaUser, FaBriefcase, FaFolderOpen, FaProjectDiagram, FaGithub, FaCertificate, FaTools, FaGraduationCap } from "react-icons/fa"

interface NavbarProps {
  onTabChange: (page: string, tab: string | null) => void
  activePage: string | null
  activeTab: string | null
  onPinChange?: (isPinned: boolean) => void
  enableHoverPopups?: boolean
}

interface ContextMenuItem {
  label: string
  tab: string | null
  icon: React.ReactNode
}

const Navbar = ({ onTabChange, activePage, activeTab, onPinChange, enableHoverPopups = true }: NavbarProps) => {
  const CONTEXT_MENU_ANIMATION_MS = 300

  // Only show loading state if page data hasn't been initialized (undefined), not if it's explicitly null (homepage)
  const isLoading = activePage === undefined || activeTab === undefined

  // Keep first SSR + client render deterministic; hydrate persisted preference after mount.
  const [isNavPinned, setIsNavPinned] = useState(true)
  const [hasHydratedPin, setHasHydratedPin] = useState(false)

  const [isPinAnimating, setIsPinAnimating] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const navContentRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (typeof window === "undefined") return

    const saved = localStorage.getItem("navbarPinned")
    if (saved !== null) {
      setIsNavPinned(saved === "true")
    }
    setHasHydratedPin(true)
  }, [])

  // Persist pin state only after hydration so we don't overwrite saved value on first mount.
  useEffect(() => {
    if (!hasHydratedPin || typeof window === "undefined") return
    localStorage.setItem("navbarPinned", isNavPinned.toString())
  }, [hasHydratedPin, isNavPinned])

  useEffect(() => {
    onPinChange?.(isNavPinned)
  }, [isNavPinned, onPinChange])


  // Main tabs for the top-level sections
  const mainTabs = [
    { id: "about", label: "About", icon: <FaUser /> },
    { id: "projects", label: "Projects", icon: <FaFolderOpen /> },
    { id: "career", label: "Career", icon: <FaBriefcase /> },
  ]

  const subItems: Record<string, ContextMenuItem[]> = {
    about: [
      { label: "About", tab: null, icon: <FaUser /> },
      { label: "Certifications", tab: "certifications", icon: <FaCertificate /> },
      { label: "Skills", tab: "skills", icon: <FaTools /> },
    ],
    projects: [
      { label: "Projects", tab: "projects", icon: <FaProjectDiagram /> },
      { label: "Repositories", tab: "repos", icon: <FaGithub /> },
    ],
    career: [
      { label: "Experience", tab: "experience", icon: <FaBriefcase /> },
      { label: "Education", tab: "education", icon: <FaGraduationCap /> },
    ],
  }

  const [contextMenu, setContextMenu] = useState<{ page: string; isClosing: boolean } | null>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressFiredRef = useRef(false)
  const hoverOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hoverCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const swapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Track what's currently rendered so we can decide swap vs. fresh open without reading state
  const activePageRef = useRef<string | null>(null)
  const isClosingRef = useRef(false)

  const clearAllTimers = useCallback(() => {
    if (hoverOpenTimerRef.current) { clearTimeout(hoverOpenTimerRef.current); hoverOpenTimerRef.current = null }
    if (hoverCloseTimerRef.current) { clearTimeout(hoverCloseTimerRef.current); hoverCloseTimerRef.current = null }
    if (swapTimerRef.current) { clearTimeout(swapTimerRef.current); swapTimerRef.current = null }
  }, [])

  // Open or swap to a page immediately (no delay — callers handle delays)
  const openContextMenu = useCallback((page: string) => {
    if (hoverCloseTimerRef.current) { clearTimeout(hoverCloseTimerRef.current); hoverCloseTimerRef.current = null }

    const currentPage = activePageRef.current
    const currentlyClosing = isClosingRef.current

    if (!currentPage) {
      // Nothing open — open fresh
      activePageRef.current = page
      isClosingRef.current = false
      setContextMenu({ page, isClosing: false })
      return
    }

    if (currentPage === page && !currentlyClosing) {
      // Already showing this page — nothing to do
      return
    }

    if (currentlyClosing) {
      // Mid-close animation — cancel it and open the new page immediately
      if (swapTimerRef.current) { clearTimeout(swapTimerRef.current); swapTimerRef.current = null }
      activePageRef.current = page
      isClosingRef.current = false
      setContextMenu({ page, isClosing: false })
      return
    }

    // Open on a different page — fade out current, then open new
    isClosingRef.current = true
    setContextMenu({ page: currentPage, isClosing: true })

    swapTimerRef.current = setTimeout(() => {
      swapTimerRef.current = null
      activePageRef.current = page
      isClosingRef.current = false
      setContextMenu({ page, isClosing: false })
    }, CONTEXT_MENU_ANIMATION_MS)
  }, [CONTEXT_MENU_ANIMATION_MS])

  const closeContextMenu = useCallback(() => {
    if (swapTimerRef.current) { clearTimeout(swapTimerRef.current); swapTimerRef.current = null }
    if (!activePageRef.current || isClosingRef.current) return

    const page = activePageRef.current
    isClosingRef.current = true
    setContextMenu({ page, isClosing: true })

    swapTimerRef.current = setTimeout(() => {
      swapTimerRef.current = null
      activePageRef.current = null
      isClosingRef.current = false
      setContextMenu(null)
    }, CONTEXT_MENU_ANIMATION_MS)
  }, [CONTEXT_MENU_ANIMATION_MS])

  const scheduleOpen = useCallback((page: string) => {
    if (hoverCloseTimerRef.current) { clearTimeout(hoverCloseTimerRef.current); hoverCloseTimerRef.current = null }
    if (hoverOpenTimerRef.current) { clearTimeout(hoverOpenTimerRef.current); hoverOpenTimerRef.current = null }
    // No delay when already open — swap immediately
    const delay = activePageRef.current !== null ? 0 : 180
    hoverOpenTimerRef.current = setTimeout(() => openContextMenu(page), delay)
  }, [openContextMenu])

  const scheduleClose = useCallback(() => {
    if (hoverOpenTimerRef.current) { clearTimeout(hoverOpenTimerRef.current); hoverOpenTimerRef.current = null }
    hoverCloseTimerRef.current = setTimeout(() => closeContextMenu(), 220)
  }, [closeContextMenu])

  // Close menu when clicking outside
  useEffect(() => {
    if (!contextMenu) return
    const handleOutsideClick = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        closeContextMenu()
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeContextMenu()
    }
    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [contextMenu, closeContextMenu])

  useEffect(() => {
    return () => clearAllTimers()
  }, [clearAllTimers])

  useEffect(() => {
    if (!enableHoverPopups) {
      closeContextMenu()
    }
  }, [closeContextMenu, enableHoverPopups])

  const handleClick = (page: string) => {
    onTabChange(page, null)
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
    <>
    <nav
      ref={navRef}
      className={`isolate w-full bg-[#222222] py-4 px-4 md:px-6 lg:px-7 ${
        isNavPinned
          ? 'fixed z-50 ring-1 ring-[#2a2a2a] shadow-lg shadow-black/20 border-b border-[#333333] md:border-0'
          : 'relative z-20 rounded-xl border border-[#333333] shadow-lg shadow-black/20'
      } top-0 left-0 transition-all duration-300 ease-in-out ${isPinAnimating ? "animate-pin-bounce" : ""}`}
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
              className="flex gap-3 transition-all duration-500 ease-in-out w-full lg:w-auto flex-wrap justify-center lg:justify-end"
            >
              {isLoading ? (
                <div className="flex space-x-4 animate-pulse justify-center w-full">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-24 h-9 bg-[#333333] rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="relative isolate bg-[#1e1e1e] border border-[#333333] rounded-xl py-3 px-4 flex items-center gap-2 flex-wrap justify-center lg:justify-end w-full lg:w-auto">
                  {mainTabs.map((tab) => {
                    const isActive = activePage === tab.id

                    return (
                      <button
                        key={tab.id}
                        id={`nav-btn-${tab.id}`}
                        onClick={() => handleClick(tab.id)}
                        onMouseEnter={() => {
                          if (enableHoverPopups) scheduleOpen(tab.id)
                        }}
                        onMouseLeave={scheduleClose}
                        onContextMenu={(e) => {
                          e.preventDefault()
                          openContextMenu(tab.id)
                        }}
                        onTouchStart={() => {
                          longPressFiredRef.current = false
                          longPressTimerRef.current = setTimeout(() => {
                            longPressFiredRef.current = true
                            openContextMenu(tab.id)
                          }, 500)
                        }}
                        onTouchEnd={() => {
                          if (longPressTimerRef.current) {
                            clearTimeout(longPressTimerRef.current)
                            longPressTimerRef.current = null
                          }
                        }}
                        onTouchMove={() => {
                          if (longPressTimerRef.current) {
                            clearTimeout(longPressTimerRef.current)
                            longPressTimerRef.current = null
                          }
                        }}
                        className={`relative z-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 hover:z-10 focus:z-10 focus-visible:z-10 border focus:outline-none focus-visible:outline-none ${
                          isActive
                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-lg shadow-red-600/40 cursor-pointer border-transparent"
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

    {/* Context menu */}
    {contextMenu && (
      <ContextMenuPopup
        contextMenuRef={contextMenuRef}
        page={contextMenu.page}
        anchorId={`nav-btn-${contextMenu.page}`}
        subItems={subItems}
        onTabChange={onTabChange}
        closeContextMenu={closeContextMenu}
        isClosing={contextMenu.isClosing}
        onMouseEnter={() => {
          if (hoverCloseTimerRef.current) {
            clearTimeout(hoverCloseTimerRef.current)
            hoverCloseTimerRef.current = null
          }
        }}
        onMouseLeave={scheduleClose}
      />
    )}
    </>
  )
}

interface ContextMenuPopupProps {
  contextMenuRef: React.RefObject<HTMLDivElement | null>
  page: string
  anchorId: string
  subItems: Record<string, ContextMenuItem[]>
  onTabChange: (page: string, tab: string | null) => void
  closeContextMenu: () => void
  isClosing: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

function ContextMenuPopup({ contextMenuRef, page, anchorId, subItems, onTabChange, closeContextMenu, isClosing, onMouseEnter, onMouseLeave }: ContextMenuPopupProps) {
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)

  useEffect(() => {
    const anchor = document.getElementById(anchorId)
    const el = contextMenuRef.current
    if (!anchor || !el) return

    const anchorRect = anchor.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const vw = window.innerWidth

    let left = anchorRect.left + anchorRect.width / 2 - elRect.width / 2
    const top = anchorRect.bottom + 8

    if (left + elRect.width > vw - 8) left = vw - elRect.width - 8
    if (left < 8) left = 8

    setPos({ left, top })
  }, [anchorId, contextMenuRef])

  const sectionLabel = page.charAt(0).toUpperCase() + page.slice(1)

  return (
    <div
      ref={contextMenuRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`fixed z-[9999] min-w-[140px] max-w-[220px] rounded-lg border border-[#333333] bg-[#1e1e1e] py-1.5 shadow-2xl shadow-black/40 ${
        isClosing ? "animate-fade-out-down" : "animate-fade-in-up"
      }`}
      style={pos ? { left: pos.left, top: pos.top } : { visibility: "hidden", left: 0, top: 0 }}
    >
      <div className="mb-1 border-b border-[#333333] px-2.5 pb-1 pt-0.5">
        <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          {sectionLabel}
        </span>
      </div>
      {subItems[page]?.map((item) => (
        <button
          key={item.tab ?? "__top"}
          onClick={() => {
            onTabChange(page, item.tab)
            closeContextMenu()
          }}
          className="group flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs text-gray-300 transition-all duration-150 hover:bg-[#2a2a2a] hover:text-[#dc2626] hover:shadow-[inset_0_0_8px_rgba(220,38,38,0.15)]"
        >
          <span className="text-sm text-gray-500 transition-colors duration-150 group-hover:text-[#dc2626]">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}

export default Navbar
