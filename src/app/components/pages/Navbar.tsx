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
      className={`w-full ${isNavPinned ? 'fixed' : 'relative'} top-0 left-0 z-50 ${isPinAnimating ? "animate-pin-bounce" : ""}`}
      style={{
        background: "linear-gradient(to bottom, #d4d0c8, #c0bdb4)",
        borderBottom: "2px solid #808080",
        borderTop: "2px solid #ffffff",
        boxShadow: "0 2px 0 #404040",
        fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
      }}
    >
      {/* Win2K title bar strip */}
      <div className="win-titlebar px-4 py-1">
        <span style={{ fontSize: "11px", fontWeight: "bold", letterSpacing: "0.02em" }}>
          🖥️ ethantownsend.dev — Portfolio Navigator
        </span>
        <div className="ml-auto flex gap-1">
          <button
            onClick={handlePinToggle}
            style={{
              background: "#d4d0c8",
              borderTop: "1px solid #fff",
              borderLeft: "1px solid #fff",
              borderRight: "1px solid #404040",
              borderBottom: "1px solid #404040",
              width: "16px",
              height: "14px",
              fontSize: "9px",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#000",
            }}
            aria-label={isNavPinned ? "Unpin navigation" : "Pin navigation"}
            title={isNavPinned ? "Click to unpin" : "Click to pin"}
          >
            <FaThumbtack size={8} style={{ transform: isNavPinned ? "rotate(0deg)" : "rotate(45deg)" }} />
          </button>
        </div>
      </div>

      {/* Nav buttons area */}
      <div className="container mx-auto px-4 py-1">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <span style={{ fontSize: "13px", fontWeight: "bold", color: "#000080" }}>
              Navigation:
            </span>
          </div>

          <div className="flex items-center gap-2 lg:ml-2 w-full lg:w-auto">
            <div
              ref={navContentRef}
              className="flex gap-2 w-full lg:w-auto flex-wrap justify-center lg:justify-start"
            >
              {isLoading ? (
                <div className="flex space-x-2 justify-center w-full">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="win-btn animate-pulse" style={{ width: "80px", height: "22px" }} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-1 flex-wrap justify-center lg:justify-start w-full lg:w-auto">
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
                        className={`inline-flex items-center gap-1.5 focus:outline-none focus-visible:outline-2 focus-visible:outline-[#000080] ${isActive ? "win-btn-active" : ""}`}
                        style={{
                          background: isActive ? "#c0bdb4" : "#d4d0c8",
                          borderTopColor: isActive ? "#404040" : "#ffffff",
                          borderLeftColor: isActive ? "#404040" : "#ffffff",
                          borderRightColor: isActive ? "#ffffff" : "#404040",
                          borderBottomColor: isActive ? "#ffffff" : "#404040",
                          borderStyle: "solid",
                          borderWidth: "1px",
                          padding: "3px 10px",
                          fontSize: "11px",
                          fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
                          fontWeight: isActive ? "bold" : "normal",
                          color: "#000000",
                          cursor: "pointer",
                          minWidth: "70px",
                        }}
                      >
                        {tab.icon && <span style={{ fontSize: "12px" }}>{tab.icon}</span>}
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
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
      className={`fixed z-[9999] min-w-[140px] max-w-[200px] ${
        isClosing ? "animate-fade-out-down" : "animate-fade-in-up"
      }`}
      style={{
        ...(pos ? { left: pos.left, top: pos.top } : { visibility: "hidden", left: 0, top: 0 }),
        background: "#d4d0c8",
        borderTop: "1px solid #ffffff",
        borderLeft: "1px solid #ffffff",
        borderRight: "1px solid #404040",
        borderBottom: "1px solid #404040",
        boxShadow: "2px 2px 4px rgba(0,0,0,0.5)",
        padding: "2px",
        fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
      }}
    >
      {/* Win2K menu title bar */}
      <div className="win-titlebar mb-0.5" style={{ fontSize: "11px", padding: "2px 6px" }}>
        <span>{sectionLabel}</span>
      </div>
      {subItems[page]?.map((item) => (
        <button
          key={item.tab ?? "__top"}
          onClick={() => {
            onTabChange(page, item.tab)
            closeContextMenu()
          }}
          className="flex w-full items-center gap-2 text-left"
          style={{
            padding: "3px 8px",
            fontSize: "11px",
            color: "#000000",
            background: "transparent",
            border: "none",
            cursor: "default",
            fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#000080"
            ;(e.currentTarget as HTMLButtonElement).style.color = "#ffffff"
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent"
            ;(e.currentTarget as HTMLButtonElement).style.color = "#000000"
          }}
        >
          <span style={{ fontSize: "12px", width: "14px", flexShrink: 0 }}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}

export default Navbar
