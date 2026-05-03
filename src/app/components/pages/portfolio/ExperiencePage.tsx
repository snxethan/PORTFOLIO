"use client"

import React, { useEffect, useRef, useState } from "react"
import { FaBriefcase, FaGraduationCap } from "react-icons/fa"
import { timelineData } from "@/app/data/timelineData"
import Timeline from "../../Timeline"
import SearchFilterBar from "../../SearchFilterBar"
import { getTimedItem, setTimedItem, removeTimedItem } from "@/app/utils/timedStorage"
import { scrollElementIntoViewWithNavbarOffset } from "@/app/utils/scrollWithNavbarOffset"
import PageTabs from "../../PageTabs"
import ResponsiveCardSkeletonGrid from "../../ResponsiveCardSkeletonGrid"

const filterOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
]

interface ExperiencePageProps {
  onTabChange: (page: string, tab: string | null) => void
  activeTab: string | null
  onContentReady?: () => void
}

const ExperiencePage = ({ onTabChange, activeTab, onContentReady }: ExperiencePageProps) => {
  const tabs = [
    { id: "experience", label: "Experience", tabValue: "experience", icon: <FaBriefcase /> },
    { id: "education", label: "Education", tabValue: "education", icon: <FaGraduationCap /> },
  ]
  const activeId = activeTab ?? "experience"
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set())
  const [disappearingItems, setDisappearingItems] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState(() =>
    typeof window !== 'undefined' ? (getTimedItem<string>('experienceSearch') ?? "") : ""
  )
  const [sortBy, setSortBy] = useState(() =>
    typeof window !== 'undefined' ? (getTimedItem<string>('experienceSortBy') ?? "newest") : "newest"
  )
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showTagsMenu, setShowTagsMenu] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = getTimedItem<string>('experienceSelectedTag')
      return saved !== null ? saved : "Computer Science"
    }
    return "Computer Science"
  })
  const [loading, setLoading] = useState(true)
  const onContentReadyRef = useRef(onContentReady)

  useEffect(() => {
    onContentReadyRef.current = onContentReady
  }, [onContentReady])

  useEffect(() => {
    if (typeof window !== 'undefined') setTimedItem('experienceSearch', search)
  }, [search])

  useEffect(() => {
    if (typeof window !== 'undefined') setTimedItem('experienceSortBy', sortBy)
  }, [sortBy])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedTag !== null) {
        setTimedItem('experienceSelectedTag', selectedTag)
      } else {
        removeTimedItem('experienceSelectedTag')
      }
    }
  }, [selectedTag])

  useEffect(() => {
    const rafId = requestAnimationFrame(() => setLoading(false))
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowFilterMenu(false)
    }
    document.addEventListener("keydown", handleEscape)
    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener("keydown", handleEscape)
    }
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
    const target = document.getElementById("experience-cards")
    scrollElementIntoViewWithNavbarOffset(target)
  }, [])

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setShowFilterMenu(false)
  }

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
    setShowTagsMenu(true)
    setTimeout(() => {
      scrollToCards()
    }, 50)
  }

  const handleToggleChange = (newValue: boolean) => {
    const sortedTimeline = [...timelineData].sort((a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )

    if (!newValue) {
      const itemsToHide = sortedTimeline
        .filter(item => !item.csRelated)
        .map(item => `${item.institution}-${item.startDate}`)
      setDisappearingItems(new Set(itemsToHide))
      setTimeout(() => {
        setDisappearingItems(new Set())
      }, 300)
    } else {
      const newItems = sortedTimeline
        .filter(item => !item.csRelated)
        .map(item => `${item.institution}-${item.startDate}`)
      setAnimatingItems(new Set(newItems))
      setTimeout(() => setAnimatingItems(new Set()), 500)
    }
  }

  // Expose toggle for potential future use — currently unused but wired to Timeline
  void handleToggleChange

  const sortedTimeline = [...timelineData].sort((a, b) => {
    if (sortBy === "name-asc") return (a.institution || "").localeCompare(b.institution || "")
    if (sortBy === "name-desc") return (b.institution || "").localeCompare(a.institution || "")
    if (sortBy === "oldest") return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })

  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>()
    timelineData
      .filter(item => item.type === "experience")
      .forEach(item => {
        item.tags?.forEach(tag => tagSet.add(tag))
        if (item.location) tagSet.add(item.location)
      })
    return Array.from(tagSet).sort()
  }, [])

  const sortedTags = React.useMemo(() =>
    allTags.slice().sort((a, b) => a.localeCompare(b)),
  [allTags])

  const getFilteredItems = React.useCallback(() => {
    return sortedTimeline.filter((item) => {
      if (item.type !== "experience") return false
      const matchesSearch = !search ||
        item.institution?.toLowerCase().includes(search.toLowerCase()) ||
        item.location?.toLowerCase().includes(search.toLowerCase()) ||
        item.summary?.toLowerCase().includes(search.toLowerCase()) ||
        item.highlights?.some(h => h.toLowerCase().includes(search.toLowerCase()))
      const matchesTag = !selectedTag ||
        item.tags?.includes(selectedTag) ||
        item.location?.toLowerCase() === selectedTag.toLowerCase()
      return matchesSearch && matchesTag
    })
  }, [sortedTimeline, search, selectedTag])

  const renderTimeline = () => {
    const filteredItems = getFilteredItems()

    if (filteredItems.length === 0) {
      return (
        <div className="text-center text-gray-400 py-8">
          <p>No items match your current filters.</p>
        </div>
      )
    }

    return (
      <Timeline
        items={filteredItems}
        type="experience"
        showAllContent={true}
        animatingItems={animatingItems}
        disappearingItems={disappearingItems}
        onTagClick={handleTagClick}
        layout="horizontal"
        showLine={false}
      />
    )
  }

  const filteredItems = getFilteredItems()
  const resultsCount = `Showing ${filteredItems.length} Experience${filteredItems.length !== 1 ? 's' : ''}`

  return (
    <>
      <div id="experience-page-header" className="bg-[#222222] rounded-xl border border-[#333333] shadow-lg shadow-black/20 p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Career
          </h2>
          <p className="mx-auto mb-4 max-w-2xl text-center text-sm text-gray-400">
            Professional roles, impact, and hands-on experience.
          </p>
          <div className="flex justify-center mb-4">
            <PageTabs
              tabs={tabs}
              activeId={activeId}
              onChange={(tab) => onTabChange("career", tab)}
            />
          </div>

          <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-4 shadow-lg shadow-black/20">
            <div className="container mx-auto">
              <SearchFilterBar
                search={search}
                setSearch={setSearch}
                placeholder="Search by institution, title, keyword, or tags..."
                tags={sortedTags}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
                sortOptions={filterOptions}
                selectedSort={sortBy}
                setSelectedSort={handleSortChange}
                showTagsMenu={showTagsMenu}
                setShowTagsMenu={setShowTagsMenu}
                showFilterMenu={showFilterMenu}
                setShowFilterMenu={setShowFilterMenu}
                defaultSort="newest"
                onFilterInteraction={scrollToCards}
              />
              <div className="text-sm text-gray-400 mt-2">{resultsCount}</div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="experience-cards"
        className="text-white"
        style={{ scrollMarginTop: "calc(var(--navbar-height, 6rem) + 1rem)" }}
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
          <div key={`experience-loaded-${activeId}`} className="animate-skeleton-pop">
            {renderTimeline()}
          </div>
        )}
      </div>
    </>
  )
}

export default ExperiencePage
