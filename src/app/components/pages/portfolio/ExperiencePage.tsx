"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { timelineData } from "../../../data/timelineData"
import Timeline from "../../Timeline"
import SearchFilterBar from "../../SearchFilterBar"

const ExperiencePage = () => {
  const [showAllContent, setShowAllContent] = useState(true)
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set())
  const [disappearingItems, setDisappearingItems] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('experienceSearch') || ""
    }
    return ""
  })
  const [sortBy, setSortBy] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('experienceSortBy') || "newest"
    }
    return "newest"
  })
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showTagsMenu, setShowTagsMenu] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('experienceSelectedTag')
      return saved !== null ? saved : "Computer Science"
    }
    return "Computer Science"
  })
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('experienceSearch', search)
    }
  }, [search])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('experienceSortBy', sortBy)
    }
  }, [sortBy])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedTag !== null) {
        localStorage.setItem('experienceSelectedTag', selectedTag)
      } else {
        localStorage.removeItem('experienceSelectedTag')
      }
    }
  }, [selectedTag])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    const savedPreference = document.cookie
      .split('; ')
      .find(row => row.startsWith('experienceShowAllContent='))
      ?.split('=')[1]
    
    if (savedPreference) {
      setShowAllContent(savedPreference === 'true')
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowFilterMenu(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    
    const savedFilter = localStorage.getItem('experience-filter')
    if (savedFilter) {
      setSortBy(savedFilter)
    }
    
    return () => {
      clearTimeout(timer)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [searchParams])

  const handleSortChange = (value: string) => {
    setSortBy(value)
    localStorage.setItem('experience-filter', value)
    setShowFilterMenu(false)
    if (value === "cs-only") {
      handleToggleChange(false)
    }
  }

  const handleToggleChange = (newValue: boolean) => {
    const sortedTimeline = [...timelineData].sort((a, b) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })

    if (!newValue && showAllContent) {
      const itemsToHide = sortedTimeline
        .filter(item => !item.isCSRelated)
        .map(item => `${item.institution}-${item.startDate}`)
      setDisappearingItems(new Set(itemsToHide))
      
      setTimeout(() => {
        setShowAllContent(newValue)
        setDisappearingItems(new Set())
      }, 300)
      
    } else {
      if (newValue && !showAllContent) {
        const newItems = sortedTimeline
          .filter(item => !item.isCSRelated)
          .map(item => `${item.institution}-${item.startDate}`)
        setAnimatingItems(new Set(newItems))
        
        setTimeout(() => setAnimatingItems(new Set()), 500)
      }
      
      setShowAllContent(newValue)
    }
    
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    document.cookie = `experienceShowAllContent=${newValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
  }

  const sortedTimeline = [...timelineData].sort((a, b) => {
    if (sortBy === "cs-only") {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    }
    if (sortBy === "name-asc") {
      return (a.institution || "").localeCompare(b.institution || "")
    }
    if (sortBy === "name-desc") {
      return (b.institution || "").localeCompare(a.institution || "")
    }
    if (sortBy === "oldest") {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    }
    if (sortBy === "newest") {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    }
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })
  
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>()
    timelineData
      .filter(item => item.type === "experience")
      .forEach(item => {
        item.tags?.forEach(tag => tagSet.add(tag))
      })
    return Array.from(tagSet).sort()
  }, [])
  
  const sortedTags = React.useMemo(() => {
    if (!allTags.length) return []
    return allTags.slice().sort((a, b) => a.localeCompare(b))
  }, [allTags])

  const renderTimeline = () => {
    const filteredItems = sortedTimeline.filter((item) => {
      if (item.type !== "experience") return false
      
      const matchesCSFilter = sortBy !== "cs-only" || item.isCSRelated
      
      const matchesSearch = !search || 
        item.institution?.toLowerCase().includes(search.toLowerCase()) ||
        item.location?.toLowerCase().includes(search.toLowerCase()) ||
        item.summary?.toLowerCase().includes(search.toLowerCase()) ||
        item.highlights?.some(h => h.toLowerCase().includes(search.toLowerCase()))
      
      const matchesTag = !selectedTag || item.tags?.includes(selectedTag)
      
      return matchesCSFilter && matchesSearch && matchesTag
    })

    if (filteredItems.length === 0) {
      return (
        <div className="text-center text-gray-400 py-8">
          <p>No items match your current filters.</p>
        </div>
      )
    }

    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#1e1e1e] border border-[#333333] p-6 rounded-xl animate-pulse"
            >
              <div className="h-6 bg-[#333333] rounded w-3/4 mb-4" />
              <div className="h-4 bg-[#333333] rounded w-1/2 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-[#333333] rounded w-full" />
                <div className="h-3 bg-[#333333] rounded w-5/6" />
                <div className="h-3 bg-[#333333] rounded w-4/6" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <Timeline
        items={filteredItems}
        type="experience"
        showAllContent={sortBy !== "cs-only"}
        animatingItems={animatingItems}
        disappearingItems={disappearingItems}
      />
    )
  }

  const filterOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "name-desc", label: "Name (Z–A)" },
  ]

  const filteredCount = sortedTimeline.filter(i => i.type === "experience" && (sortBy !== "cs-only" || i.isCSRelated) && (!search || 
      i.institution?.toLowerCase().includes(search.toLowerCase()) ||
      i.location?.toLowerCase().includes(search.toLowerCase()) ||
      i.summary?.toLowerCase().includes(search.toLowerCase()) ||
      i.highlights?.some(h => h.toLowerCase().includes(search.toLowerCase()))) && (!selectedTag || i.tags?.includes(selectedTag))).length

  const resultsCount = `Showing ${filteredCount} Experience${filteredCount !== 1 ? 's' : ''}`

  return (
    <>
      <div className="bg-[#222222] rounded-xl border border-[#333333] p-6 mb-6 animate-fadeInScale">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent transition-transform duration-200 ease-out hover:scale-110">
            Professional Experience Timeline
          </h2>
          <p className="text-center text-gray-300 mb-4 max-w-3xl mx-auto">
            My journey and contributions in software development
          </p>
          <p className="text-center text-gray-400 max-w-3xl mx-auto">
            Full-stack development roles with focus on backend architecture and cloud platforms.
          </p>
        </div>
      
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl py-4 px-4">
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
            />

            {resultsCount && (
              <div className="text-sm text-gray-400 mb-3">{resultsCount}</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-white">
        <div className="transition-opacity duration-150 opacity-100 animate-fade-in-up">
          {renderTimeline()}
        </div>
      </div>
    </>
  )
}

export default ExperiencePage
