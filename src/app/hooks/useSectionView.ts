"use client"

import { useCallback, useEffect, useState } from "react"

export type ViewMode = "rail" | "grid"

/**
 * Sections with fewer items than this open as a grid; bigger ones open as a
 * horizontal rail. A visitor's explicit choice always wins over this default.
 */
export const RAIL_DEFAULT_MIN_ITEMS = 6

interface SectionViewPrefs {
  viewMode?: ViewMode
  autoScroll?: boolean
}

const readPrefs = (storageKey: string): SectionViewPrefs => {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? (JSON.parse(raw) as SectionViewPrefs) : {}
  } catch {
    return {}
  }
}

/**
 * Per-section display preferences: grid vs. rail, and whether the rail
 * auto-scrolls. Only explicit choices are persisted, so a section whose item
 * count changes (e.g. repositories once GitHub responds) still gets the right
 * default until the visitor picks one.
 */
export function useSectionView(sectionKey: string, itemCount: number) {
  const storageKey = `sectionView:${sectionKey}`
  // Keyed by storage key so switching sections (About's certifications/skills
  // tabs share one component) never shows the previous section's prefs.
  const [prefsByKey, setPrefsByKey] = useState<Record<string, SectionViewPrefs>>({})
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    setPrefsByKey((prev) => (storageKey in prev ? prev : { ...prev, [storageKey]: readPrefs(storageKey) }))
  }, [storageKey])

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setPrefersReducedMotion(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  const prefs = prefsByKey[storageKey] ?? {}

  const updatePrefs = useCallback(
    (next: SectionViewPrefs) => {
      setPrefsByKey((prev) => {
        const merged = { ...(prev[storageKey] ?? {}), ...next }
        try {
          localStorage.setItem(storageKey, JSON.stringify(merged))
        } catch {
          // Storage can be unavailable (private mode); the choice still applies this visit.
        }
        return { ...prev, [storageKey]: merged }
      })
    },
    [storageKey]
  )

  const viewMode: ViewMode = prefs.viewMode ?? (itemCount < RAIL_DEFAULT_MIN_ITEMS ? "grid" : "rail")
  const autoScroll = prefs.autoScroll ?? !prefersReducedMotion

  const setViewMode = useCallback((mode: ViewMode) => updatePrefs({ viewMode: mode }), [updatePrefs])
  const setAutoScroll = useCallback((enabled: boolean) => updatePrefs({ autoScroll: enabled }), [updatePrefs])

  return { viewMode, setViewMode, autoScroll, setAutoScroll }
}
