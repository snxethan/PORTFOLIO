"use client"

import React, { useEffect, useState } from "react"
import { FaDownload, FaToggleOn, FaToggleOff, FaCog, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { useSearchParams, useRouter } from "next/navigation"
import TooltipWrapper from "../ToolTipWrapper"
import PDFModalViewer from "../PDFModalViewer"
import { timelineData } from "../../data/timelineData"
import Timeline from "../Timeline"
import StaticTabNav from "../StaticTabNav"

const Resume = () => {
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null)
  const [showAllContent, setShowAllContent] = useState(true)
  const [isToggleAnimating, setIsToggleAnimating] = useState(false)
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set())
  const [disappearingItems, setDisappearingItems] = useState<Set<string>>(new Set())
  const [activeSubsection, setActiveSubsection] = useState("experience")
  const [isAnimating, setIsAnimating] = useState(false)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [isFocused, setIsFocused] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showAllTags, setShowAllTags] = useState(false)
  const [isExtending, setIsExtending] = useState(false)
  const [isHiding, setIsHiding] = useState(false)
  const resumePDF = "/resume/EthanTownsend_Resume_v2.1.pdf"
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Load toggle preference from cookie
    const savedPreference = document.cookie
      .split('; ')
      .find(row => row.startsWith('resumeShowAllContent='))
      ?.split('=')[1]
    
    if (savedPreference) {
      setShowAllContent(savedPreference === 'true')
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPDF(null)
        setShowFilterMenu(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    
    // Load active tab from localStorage first
    const savedTab = localStorage.getItem("resumeActiveTab")
    if (savedTab && (savedTab === "experience" || savedTab === "education")) {
      setActiveSubsection(savedTab)
    }
    
    // Handle URL parameters for tab (overrides localStorage)
    const pageParam = searchParams.get("page")
    const parts = pageParam?.split("/")
    const tabParam = parts?.[1]
    if (tabParam && (tabParam === "experience" || tabParam === "education")) {
      setActiveSubsection(tabParam)
    }
    
    // Load filter from localStorage
    const savedFilter = localStorage.getItem("globalFilter")
    if (savedFilter) {
      setSortBy(savedFilter)
    }
    
    return () => document.removeEventListener("keydown", handleEscape)
  }, [searchParams])

  const handleToggleChange = (newValue: boolean) => {
    setIsToggleAnimating(true)
    
    // If switching to show less content (All -> CS), mark items for disappearing animation
    if (!newValue && showAllContent) {
      const itemsToHide = sortedTimeline
        .filter(item => !item.isCSRelated)
        .map(item => `${item.institution}-${item.startDate}`)
      setDisappearingItems(new Set(itemsToHide))
      
      // Wait for disappearing animation to complete before hiding items
      setTimeout(() => {
        setShowAllContent(newValue)
        setDisappearingItems(new Set())
      }, 300) // Match animation duration
      
    } else {
      // If switching to show more content, mark new items for animation
      if (newValue && !showAllContent) {
        const newItems = sortedTimeline
          .filter(item => !item.isCSRelated)
          .map(item => `${item.institution}-${item.startDate}`)
        setAnimatingItems(new Set(newItems))
        
        // Clear animation markers after animation completes
        setTimeout(() => setAnimatingItems(new Set()), 500)
      }
      
      setShowAllContent(newValue)
    }
    
    // Save preference to cookie (expires in 1 year)
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    document.cookie = `resumeShowAllContent=${newValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
    
    // Reset animation state after animation completes
    setTimeout(() => setIsToggleAnimating(false), 300)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    localStorage.setItem("globalFilter", value)
    setShowFilterMenu(false)
    if (value === "cs-only") {
      handleToggleChange(false)
    } else if (value === "" && !showAllContent) {
      handleToggleChange(true)
    }
  }
  
  const handleTabChange = (tabId: string) => {
    setIsAnimating(true)
    
    // Save to localStorage
    localStorage.setItem("resumeActiveTab", tabId)
    
    // Update URL with new format
    router.push(`?page=resume/${tabId}`, { scroll: false })
    
    setTimeout(() => {
      setActiveSubsection(tabId)
      setIsAnimating(false)
    }, 150)
  }
  
  const handleShowAllTagsToggle = () => {
    if (showAllTags) {
      setIsHiding(true)
      setTimeout(() => {
        setShowAllTags(false)
        setIsHiding(false)
      }, 200)
    } else {
      setShowAllTags(true)
      setIsExtending(true)
      setTimeout(() => {
        setIsExtending(false)
      }, 300)
    }
  }

  const sortedTimeline = [...timelineData].sort((a, b) =>
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )
  
  // Extract tags from timeline items
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>()
    timelineData
      .filter(item => item.type === activeSubsection)
      .forEach(item => {
        item.tags?.forEach(tag => tagSet.add(tag))
      })
    const tags = Array.from(tagSet).sort()
    return ["ALL", ...tags]
  }, [activeSubsection])
  
  const TAG_LIMIT = 8
  
  const sortedTags = React.useMemo(() => {
    if (!allTags.length) return []
    const [first, ...rest] = allTags
    const sortedRest = rest.slice().sort((a, b) => a.localeCompare(b))
    return first === "ALL" ? [first, ...sortedRest] : allTags.slice().sort((a, b) => a.localeCompare(b))
  }, [allTags])

  const renderTimeline = (type: "experience" | "education") => {
    const filteredItems = sortedTimeline.filter((item) => {
      if (item.type !== type) return false
      
      // CS filter - use sortBy instead of showAllContent
      const matchesCSFilter = sortBy !== "cs-only" || item.isCSRelated
      
      // Search filter
      const matchesSearch = !search || 
        item.institution?.toLowerCase().includes(search.toLowerCase()) ||
        item.location?.toLowerCase().includes(search.toLowerCase()) ||
        item.summary?.toLowerCase().includes(search.toLowerCase()) ||
        item.highlights?.some(h => h.toLowerCase().includes(search.toLowerCase()))
      
      // Tag filter
      const matchesTag = !selectedTag || selectedTag === "ALL" || item.tags?.includes(selectedTag)
      
      return matchesCSFilter && matchesSearch && matchesTag
    })

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
        type={type}
        showAllContent={sortBy !== "cs-only"}
        animatingItems={animatingItems}
        disappearingItems={disappearingItems}
      />
    )
  }

  const tabs = [
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
  ]

  const filterOptions = [
    { value: "newest", label: "Newest" },
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "name-desc", label: "Name (Z–A)" },
    { value: "oldest", label: "Oldest" },
    { value: "cs-only", label: "Computer Science Only" },
  ]

  const filteredCount = activeSubsection === "experience" 
    ? sortedTimeline.filter(i => i.type === "experience" && (sortBy !== "cs-only" || i.isCSRelated) && (!search || 
        i.institution?.toLowerCase().includes(search.toLowerCase()) ||
        i.location?.toLowerCase().includes(search.toLowerCase()) ||
        i.summary?.toLowerCase().includes(search.toLowerCase()) ||
        i.highlights?.some(h => h.toLowerCase().includes(search.toLowerCase()))) && (!selectedTag || selectedTag === "ALL" || i.tags?.includes(selectedTag))).length
    : sortedTimeline.filter(i => i.type === "education" && (sortBy !== "cs-only" || i.isCSRelated) && (!search || 
        i.institution?.toLowerCase().includes(search.toLowerCase()) ||
        i.location?.toLowerCase().includes(search.toLowerCase()) ||
        i.summary?.toLowerCase().includes(search.toLowerCase()) ||
        i.highlights?.some(h => h.toLowerCase().includes(search.toLowerCase()))) && (!selectedTag || selectedTag === "ALL" || i.tags?.includes(selectedTag))).length

  const resultsCount = activeSubsection === "experience"
    ? `Showing ${filteredCount} Experience${filteredCount !== 1 ? 's' : ''}`
    : `Showing ${filteredCount} Education Item${filteredCount !== 1 ? 's' : ''}`

  return (
    <div>
      <StaticTabNav
        headerContent={
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-2">Ethan Townsend</h2>
            <p className="text-xl text-gray-400 mb-1">Software Engineer</p>
            <p className="text-sm text-gray-500 mb-1">Salt Lake City, UT</p>
            <p className="text-sm text-red-500 mb-4">snxethan@gmail.com</p>
            
            <div className="flex justify-center mb-4">
              <TooltipWrapper label="View Resume" url={resumePDF}>
                <button
                  onClick={() => setSelectedPDF(resumePDF)}
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
                >
                  <FaDownload /> View Resume
                </button>
              </TooltipWrapper>
            </div>
          </div>
        }
        tabs={tabs}
        activeTab={activeSubsection}
        onTabChange={handleTabChange}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by institution, title, or keyword..."
        tags={sortedTags}
        selectedTag={selectedTag}
        onTagClick={(tag) => setSelectedTag(tag === "" ? null : tag)}
        showAllTags={showAllTags}
        onToggleTags={handleShowAllTagsToggle}
        filterOptions={filterOptions}
        currentFilter={sortBy}
        onFilterChange={handleSortChange}
        resultsCount={resultsCount}
      />
      
      <div className="bg-[#121212] text-white py-20">
        <div className="container mx-auto px-4">
          <div className={`transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100 animate-fade-in-up'}`}>
            {activeSubsection === "experience" && renderTimeline("experience")}
            {activeSubsection === "education" && renderTimeline("education")}
          </div>
        </div>
      </div>

      <PDFModalViewer pdfUrl={selectedPDF} onClose={() => setSelectedPDF(null)} />
    </div>
  )
}

export default Resume