"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FaUser, FaCertificate, FaTools, FaProjectDiagram, FaGithub, FaBriefcase, FaGraduationCap } from "react-icons/fa"

interface SectionRailItem {
  id: "about" | "projects" | "career"
  label: string
}

interface ContextMenuItem {
  label: string
  tab: string | null
  icon: React.ReactNode
}

interface SectionScrollRailProps {
  items: SectionRailItem[]
  activeSection: SectionRailItem["id"]
  visible: boolean
  positions: Record<SectionRailItem["id"], number>
  onSelect: (section: SectionRailItem["id"]) => void
  onTabChange: (page: string, tab: string | null) => void
  enableHoverPopups?: boolean
  enabled?: boolean
}

const subItems: Record<SectionRailItem["id"], ContextMenuItem[]> = {
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

const CONTEXT_MENU_ANIMATION_MS = 300

const SectionScrollRail = ({
  items,
  activeSection,
  visible,
  positions,
  onSelect,
  onTabChange,
  enableHoverPopups = true,
  enabled = true,
}: SectionScrollRailProps) => {
  const [contextMenu, setContextMenu] = useState<{ page: SectionRailItem["id"]; isClosing: boolean } | null>(null)
  const [popupPosition, setPopupPosition] = useState<{ left: number; top: number } | null>(null)
  const [isRailHovered, setIsRailHovered] = useState(false)
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const hoverOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hoverCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (hoverOpenTimerRef.current) {
      clearTimeout(hoverOpenTimerRef.current)
      hoverOpenTimerRef.current = null
    }
    if (hoverCloseTimerRef.current) {
      clearTimeout(hoverCloseTimerRef.current)
      hoverCloseTimerRef.current = null
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const openContextMenu = useCallback((page: SectionRailItem["id"]) => {
    if (!enableHoverPopups) return
    if (hoverCloseTimerRef.current) {
      clearTimeout(hoverCloseTimerRef.current)
      hoverCloseTimerRef.current = null
    }
    setPopupPosition(null)
    setContextMenu({ page, isClosing: false })
  }, [enableHoverPopups])

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => {
      if (!prev) return prev
      return { ...prev, isClosing: true }
    })
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setContextMenu(null)
      setPopupPosition(null)
      closeTimerRef.current = null
    }, CONTEXT_MENU_ANIMATION_MS)
  }, [])

  const scheduleOpen = useCallback((page: SectionRailItem["id"]) => {
    if (!enableHoverPopups) return
    if (hoverOpenTimerRef.current) clearTimeout(hoverOpenTimerRef.current)
    const delay = contextMenu ? 0 : 180
    hoverOpenTimerRef.current = setTimeout(() => openContextMenu(page), delay)
  }, [contextMenu, enableHoverPopups, openContextMenu])

  const scheduleClose = useCallback(() => {
    if (hoverOpenTimerRef.current) {
      clearTimeout(hoverOpenTimerRef.current)
      hoverOpenTimerRef.current = null
    }
    hoverCloseTimerRef.current = setTimeout(() => closeContextMenu(), 180)
  }, [closeContextMenu])

  const isRailVisible = enabled && (visible || isRailHovered || !!contextMenu)

  useEffect(() => {
    if (!enabled || !isRailVisible || !enableHoverPopups) {
      setContextMenu(null)
      clearTimers()
    }
  }, [clearTimers, enableHoverPopups, enabled, isRailVisible])

  useEffect(() => {
    if (!contextMenu) return
    const onOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        closeContextMenu()
      }
    }
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeContextMenu()
    }

    document.addEventListener("mousedown", onOutside)
    document.addEventListener("keydown", onEscape)
    return () => {
      document.removeEventListener("mousedown", onOutside)
      document.removeEventListener("keydown", onEscape)
    }
  }, [closeContextMenu, contextMenu])

  useEffect(() => {
    if (!contextMenu || !contextMenuRef.current) return

    const anchor = document.getElementById(`section-rail-btn-${contextMenu.page}`)
    const popup = contextMenuRef.current
    if (!anchor || !popup) return

    const anchorRect = anchor.getBoundingClientRect()
    const popupRect = popup.getBoundingClientRect()
    const viewportPadding = 8
    const spacing = 6

    let left = anchorRect.left - popupRect.width - spacing
    let top = anchorRect.top + anchorRect.height / 2 - popupRect.height / 2

    if (left < viewportPadding) left = viewportPadding
    if (top < viewportPadding) top = viewportPadding
    if (top + popupRect.height > window.innerHeight - viewportPadding) {
      top = window.innerHeight - popupRect.height - viewportPadding
    }

    setPopupPosition({ left, top })
  }, [contextMenu])

  useEffect(() => () => clearTimers(), [clearTimers])

  const sectionLabel = contextMenu
    ? contextMenu.page.charAt(0).toUpperCase() + contextMenu.page.slice(1)
    : ""

  return (
    <div
      className={`fixed right-4 z-40 hidden md:block top-[calc(var(--navbar-height,6rem)+1rem)] bottom-8 transition-all duration-300 ${
        isRailVisible
          ? "opacity-100 translate-x-0"
          : enabled
            ? "opacity-0 translate-x-2"
            : "opacity-0 translate-x-2 pointer-events-none"
      }`}
      aria-hidden={!isRailVisible}
      onMouseEnter={() => {
        if (enabled) setIsRailHovered(true)
      }}
      onMouseLeave={() => setIsRailHovered(false)}
    >
      <div className="absolute inset-y-0 -right-1 w-10" aria-hidden="true" />
      <div className="relative h-full w-16">
      {items.map((item) => {
        const isActive = activeSection === item.id
        const normalizedPosition = Math.max(0.03, Math.min(0.97, positions[item.id] ?? 0.5))

        return (
          <button
            key={item.id}
            id={`section-rail-btn-${item.id}`}
            type="button"
            onClick={() => onSelect(item.id)}
            onMouseEnter={() => scheduleOpen(item.id)}
            onMouseLeave={scheduleClose}
            aria-label={`Scroll to ${item.label}`}
            title={item.label}
            className="group absolute right-0 flex -translate-y-1/2 items-center"
            style={{ top: `${normalizedPosition * 100}%` }}
          >
            <span
              className={`h-4 w-4 rounded-lg border transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-red-600 to-red-500 border-transparent shadow-lg shadow-red-600/40"
                  : "bg-[#2a2a2a] border-transparent hover:bg-[#333333] hover:border-red-600 hover:shadow-lg hover:shadow-red-600/30"
              }`}
            />
          </button>
        )
      })}
      </div>

      {contextMenu && (
        <div
          ref={contextMenuRef}
          onMouseEnter={() => {
            if (hoverCloseTimerRef.current) {
              clearTimeout(hoverCloseTimerRef.current)
              hoverCloseTimerRef.current = null
            }
          }}
          onMouseLeave={scheduleClose}
          className={`fixed z-[9999] min-w-[140px] max-w-[220px] rounded-lg border border-[#333333] bg-[#1e1e1e] py-1.5 shadow-2xl shadow-black/40 ${
            contextMenu.isClosing ? "animate-fade-out-down" : "animate-fade-in-up"
          }`}
          style={{
            ...(popupPosition
              ? { left: popupPosition.left, top: popupPosition.top }
              : { visibility: "hidden", left: 0, top: 0 }),
          }}
        >
          <div className="mb-1 border-b border-[#333333] px-2.5 pb-1 pt-0.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              {sectionLabel}
            </span>
          </div>
          {subItems[contextMenu.page].map((subItem) => (
            <button
              key={`${contextMenu.page}-${subItem.tab ?? "top"}`}
              type="button"
              onClick={() => {
                onTabChange(contextMenu.page, subItem.tab)
                closeContextMenu()
              }}
              className="group flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs text-gray-300 transition-all duration-150 hover:bg-[#2a2a2a] hover:text-[#dc2626] hover:shadow-[inset_0_0_8px_rgba(220,38,38,0.15)]"
            >
              <span className="text-sm text-gray-500 transition-colors duration-150 group-hover:text-[#dc2626]">{subItem.icon}</span>
              <span>{subItem.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SectionScrollRail





