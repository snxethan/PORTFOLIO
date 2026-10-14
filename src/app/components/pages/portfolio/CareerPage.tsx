"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { FaBriefcase, FaGraduationCap } from "react-icons/fa"
import { timelineData } from "@/app/data/timelineData"
import TimelineCard from "../../TimelineCard"
import SearchFilterBar from "../../SearchFilterBar"
import SectionHeader from "../../SectionHeader"
import CardCollection from "../../CardCollection"
import { scrollElementIntoViewWithNavbarOffset } from "@/app/utils/scrollWithNavbarOffset"
import ResponsiveCardSkeletonGrid from "../../ResponsiveCardSkeletonGrid"
import { DATE_AND_NAME_SORT_OPTIONS } from "@/app/utils/sortOptions"
import { matchesSelectedTags } from "@/app/utils/tagFilter"
import { useSectionFilters } from "@/app/hooks/useSectionFilters"
import { useSectionView } from "@/app/hooks/useSectionView"

export type CareerKind = "experience" | "education"

const DEFAULT_SORT = "newest"
const DEFAULT_TAGS = ["Computer Science"]

const tabs = [
  { id: "experience", label: "Experience", tabValue: "experience", icon: <FaBriefcase /> },
  { id: "education", label: "Education", tabValue: "education", icon: <FaGraduationCap /> },
]

const COPY: Record<CareerKind, { description: string; placeholder: string; noun: [string, string] }> = {
  experience: {
    description: "Professional roles, impact, and hands-on experience.",
    placeholder: "Search by institution, title, keyword, or tags...",
    noun: ["Experience", "Experiences"],
  },
  education: {
    description: "Academic history, credentials, and learning milestones.",
    placeholder: "Search by institution, title, keyword, or tags...",
    noun: ["Education Item", "Education Items"],
  },
}

interface CareerPageProps {
  kind: CareerKind
  onTabChange: (page: string, tab: string | null) => void
  onContentReady?: () => void
}

/** The Career section; `kind` picks the Experience or Education tab. */
const CareerPage = ({ kind, onTabChange, onContentReady }: CareerPageProps) => {
  const filters = useSectionFilters(kind, { sort: DEFAULT_SORT, tags: DEFAULT_TAGS })
  const entries = useMemo(() => timelineData.filter((item) => item.type === kind), [kind])
  const { viewMode, setViewMode, autoScroll, setAutoScroll } = useSectionView(kind, entries.length)
  const [loading, setLoading] = useState(true)
  const onContentReadyRef = useRef(onContentReady)
  const cardsId = `${kind}-cards`

  useEffect(() => {
    onContentReadyRef.current = onContentReady
  }, [onContentReady])

  useEffect(() => {
    const rafId = requestAnimationFrame(() => setLoading(false))
    return () => cancelAnimationFrame(rafId)
  }, [])

  useEffect(() => {
    if (loading) return
    let rafB = 0
    const rafA = requestAnimationFrame(() => {
      rafB = requestAnimationFrame(() => {
        onContentReadyRef.current?.()
      })
    })
    return () => {
      cancelAnimationFrame(rafA)
      if (rafB) cancelAnimationFrame(rafB)
    }
  }, [loading])

  const scrollToCards = React.useCallback(() => {
    scrollElementIntoViewWithNavbarOffset(document.getElementById(cardsId))
  }, [cardsId])

  const { setSelectedTags, setShowTagsMenu } = filters
  const handleTagClick = (tag: string) => {
    setSelectedTags([tag])
    setShowTagsMenu(true)
    setTimeout(scrollToCards, 50)
  }

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    entries.forEach((item) => {
      item.tags?.forEach((tag) => tagSet.add(tag))
      if (item.location) tagSet.add(item.location)
    })
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
  }, [entries])

  const { search, sortBy, selectedTags, tagMatchMode } = filters
  const visibleEntries = useMemo(() => {
    const query = search.toLowerCase()
    const filtered = entries.filter((item) => {
      const matchesSearch = !query ||
        item.institution?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.summary?.toLowerCase().includes(query) ||
        item.highlights?.some((highlight) => highlight.toLowerCase().includes(query))
      const matchesTags = matchesSelectedTags(selectedTags, tagMatchMode, (tag) =>
        Boolean(item.tags?.includes(tag)) || item.location?.toLowerCase() === tag.toLowerCase()
      )
      return matchesSearch && matchesTags
    })

    return filtered.sort((a, b) => {
      if (sortBy === "name-asc") return (a.institution || "").localeCompare(b.institution || "")
      if (sortBy === "name-desc") return (b.institution || "").localeCompare(a.institution || "")
      if (sortBy === "oldest") return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })
  }, [entries, search, selectedTags, sortBy, tagMatchMode])

  const copy = COPY[kind]
  const noun = visibleEntries.length === 1 ? copy.noun[0] : copy.noun[1]

  return (
    <>
      <SectionHeader
        id={`${kind}-page-header`}
        title="Career"
        description={copy.description}
        tabs={tabs}
        activeTabId={kind}
        onTabChange={(tab) => onTabChange("career", tab)}
        resultsText={`Showing ${visibleEntries.length} ${noun}`}
      >
        <SearchFilterBar
          search={filters.search}
          setSearch={filters.setSearch}
          placeholder={copy.placeholder}
          tags={allTags}
          selectedTags={filters.selectedTags}
          setSelectedTags={filters.setSelectedTags}
          tagMatchMode={filters.tagMatchMode}
          setTagMatchMode={filters.setTagMatchMode}
          sortOptions={DATE_AND_NAME_SORT_OPTIONS}
          selectedSort={filters.sortBy}
          setSelectedSort={filters.setSortBy}
          showTagsMenu={filters.showTagsMenu}
          setShowTagsMenu={filters.setShowTagsMenu}
          showFilterMenu={filters.showFilterMenu}
          setShowFilterMenu={filters.setShowFilterMenu}
          defaultSort={DEFAULT_SORT}
          onFilterInteraction={scrollToCards}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          autoScroll={autoScroll}
          onAutoScrollChange={setAutoScroll}
        />
      </SectionHeader>

      <div
        id={cardsId}
        className="text-white"
        style={{ scrollMarginTop: "calc(var(--navbar-height, 0px) + 1rem)" }}
      >
        {loading ? (
          <ResponsiveCardSkeletonGrid
            className="pb-14"
            renderCard={(i) => (
              <div key={i} className="bg-[#151515] border border-[#333333] p-6 rounded-none animate-pulse min-h-[14rem]">
                <div className="h-6 bg-[#333333] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[#333333] rounded w-1/2 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-[#333333] rounded w-full" />
                  <div className="h-3 bg-[#333333] rounded w-5/6" />
                  <div className="h-3 bg-[#333333] rounded w-4/6" />
                </div>
              </div>
            )}
          />
        ) : (
          <div key={`${kind}-loaded`} className="animate-skeleton-pop">
            <CardCollection
              items={visibleEntries}
              getKey={(item) => `${item.institution}-${item.startDate}`}
              viewMode={viewMode}
              autoScroll={autoScroll}
              size="wide"
              label={kind === "experience" ? "Experience" : "Education"}
              renderCard={(item) => <TimelineCard item={item} onTagClick={handleTagClick} />}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default CareerPage
