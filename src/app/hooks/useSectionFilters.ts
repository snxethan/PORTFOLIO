"use client"

import { useCallback, useState } from "react"
import { useTimedState } from "./useTimedState"
import { normalizeStoredTags, type TagMatchMode } from "../utils/tagFilter"

interface SectionFilterDefaults {
  sort: string
  tags: string[]
}

/**
 * Search, sort and tag-filter state for one section, kept for 10 minutes in
 * timed storage under `<storagePrefix>Search`, `<storagePrefix>SortBy`, etc.
 * Also owns the open/closed state of the bar's two menus.
 */
export function useSectionFilters(storagePrefix: string, defaults: SectionFilterDefaults) {
  const [search, setSearch] = useTimedState(`${storagePrefix}Search`, "")
  const [sortBy, setSortBy] = useTimedState(`${storagePrefix}SortBy`, defaults.sort)
  const [selectedTags, setSelectedTags] = useTimedState(
    `${storagePrefix}SelectedTags`,
    defaults.tags,
    (stored) => normalizeStoredTags(stored, defaults.tags)
  )
  const [tagMatchMode, setTagMatchMode] = useTimedState<TagMatchMode>(`${storagePrefix}TagMatch`, "any")
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showTagsMenu, setShowTagsMenu] = useState(false)

  const reset = useCallback(() => {
    setSearch("")
    setSortBy(defaults.sort)
    setSelectedTags(defaults.tags)
    setTagMatchMode("any")
    setShowFilterMenu(false)
    setShowTagsMenu(false)
  }, [defaults.sort, defaults.tags, setSearch, setSelectedTags, setSortBy, setTagMatchMode])

  /** A tag clicked on a card: filter by just that tag and show the tag panel. */
  const focusTag = useCallback((tag: string) => {
    setSelectedTags([tag])
    setShowTagsMenu(true)
  }, [setSelectedTags])

  return {
    focusTag,
    search,
    setSearch,
    sortBy,
    setSortBy,
    selectedTags,
    setSelectedTags,
    tagMatchMode,
    setTagMatchMode,
    showFilterMenu,
    setShowFilterMenu,
    showTagsMenu,
    setShowTagsMenu,
    reset,
  }
}
