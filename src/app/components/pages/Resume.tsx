"use client"

import React, { useEffect, useState } from "react"
import { FaDownload, FaSort, FaChevronDown, FaChevronUp, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa"
import { IoMdClose } from "react-icons/io"
import { useSearchParams, useRouter } from "next/navigation"
import TooltipWrapper from "../ToolTipWrapper"
import PDFModalViewer from "../PDFModalViewer"
import { timelineData } from "../../data/timelineData"
import Timeline from "../Timeline"

const Resume = () => {
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null)
  const [showAllContent, setShowAllContent] = useState(true)
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set())
  const [disappearingItems, setDisappearingItems] = useState<Set<string>>(new Set())
  const [activeSubsection, setActiveSubsection] = useState("experience")
  const [isAnimating, setIsAnimating] = useState(false)
  const [search, setSearch] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('resumeSearch') || ""
    }
    return ""
  })
  const [sortBy, setSortBy] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('resumeSortBy') || "newest"
    }
    return "newest"
  })
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resumeSelectedTag')
      return saved !== null ? saved : "Computer Science"
    }
    return "Computer Science"
  })
  const [showAllTags, setShowAllTags] = useState(false)
  const [clickedTab, setClickedTab] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const resumePDF = "/resume/EthanTownsend_Resume_v2.1.pdf"
  const searchParams = useSearchParams()
  const router = useRouter()

  // Persist filter and sort state for Resume page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('resumeSearch', search)
    }
  }, [search])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('resumeSortBy', sortBy)
    }
  }, [sortBy])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedTag !== null) {
        localStorage.setItem('resumeSelectedTag', selectedTag)
      } else {
        localStorage.removeItem('resumeSelectedTag')
      }
    }
  }, [selectedTag])

  // Simulate loading for initial render
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

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
    
    // Load filter from localStorage (per-tab persistence)
    const savedFilter = localStorage.getItem(`${activeSubsection}-filter`)
    if (savedFilter) {
      setSortBy(savedFilter)
    }
    
    return () => document.removeEventListener("keydown", handleEscape)
  }, [searchParams])

  const handleToggleChange = (newValue: boolean) => {
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
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    localStorage.setItem(`${activeSubsection}-filter`, value)
    setShowFilterMenu(false)
    if (value === "cs-only") {
      handleToggleChange(false)
    }
  }
  
  const handleTabChange = (tabId: string) => {
    setClickedTab(tabId)
    setTimeout(() => setClickedTab(null), 300)
    setIsAnimating(true)
    
    // Save to localStorage
    localStorage.setItem("resumeActiveTab", tabId)
    
    // Scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: "smooth" })
    
    // Update URL with new format
    router.push(`?page=resume/${tabId}`, { scroll: false })
    
    setTimeout(() => {
      setActiveSubsection(tabId)
      setIsAnimating(false)
    }, 150)
  }
  
  const handleShowAllTagsToggle = () => {
    setShowAllTags(!showAllTags)
  }

  const sortedTimeline = [...timelineData].sort((a, b) => {
    if (sortBy === "cs-only") {
      // CS items sorted by date (newest first)
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
  
  // Extract tags from timeline items
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>()
    timelineData
      .filter(item => item.type === activeSubsection)
      .forEach(item => {
        item.tags?.forEach(tag => tagSet.add(tag))
      })
    const tags = Array.from(tagSet).sort()
    return tags
  }, [activeSubsection])
  
  const sortedTags = React.useMemo(() => {
    if (!allTags.length) return []
    return allTags.slice().sort((a, b) => a.localeCompare(b))
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
    { value: "oldest", label: "Oldest" },
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "name-desc", label: "Name (Z–A)" },
  ]

  const filteredCount = activeSubsection === "experience" 
    ? sortedTimeline.filter(i => i.type === "experience" && (sortBy !== "cs-only" || i.isCSRelated) && (!search || 
        i.institution?.toLowerCase().includes(search.toLowerCase()) ||
        i.location?.toLowerCase().includes(search.toLowerCase()) ||
        i.summary?.toLowerCase().includes(search.toLowerCase()) ||
        i.highlights?.some(h => h.toLowerCase().includes(search.toLowerCase()))) && (!selectedTag || i.tags?.includes(selectedTag))).length
    : sortedTimeline.filter(i => i.type === "education" && (sortBy !== "cs-only" || i.isCSRelated) && (!search || 
        i.institution?.toLowerCase().includes(search.toLowerCase()) ||
        i.location?.toLowerCase().includes(search.toLowerCase()) ||
        i.summary?.toLowerCase().includes(search.toLowerCase()) ||
        i.highlights?.some(h => h.toLowerCase().includes(search.toLowerCase()))) && (!selectedTag || i.tags?.includes(selectedTag))).length

  const resultsCount = activeSubsection === "experience"
    ? `Showing ${filteredCount} Experience${filteredCount !== 1 ? 's' : ''}`
    : `Showing ${filteredCount} Education Item${filteredCount !== 1 ? 's' : ''}`

  const isFilterActive = sortBy && sortBy !== "newest"

  // Tab-specific descriptions
  const getPageDescription = () => {
    switch (activeSubsection) {
      case "experience":
        return {
          title: "Professional Experience Timeline",
          subtitle: "My journey and contributions in software development",
          description: "Full-stack development roles with focus on backend architecture and cloud platforms."
        }
      case "education":
        return {
          title: "Educational Background",
          subtitle: "Academic achievements and continuous learning",
          description: "Computer science education with hands-on project experience and leadership development."
        }
      default:
        return {
          title: "Professional Experience Timeline",
          subtitle: "My journey and contributions in software development",
          description: "Full-stack development roles with focus on backend architecture and cloud platforms."
        }
    }
  }

  const pageDescription = getPageDescription()

  return (
    <>
      {/* Header section - wrapped in styled container */}
      <div className="bg-[#222222] rounded-xl border border-[#333333] p-6 mb-6 animate-fadeInScale">
        {/* Header content */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent transition-transform duration-200 ease-out hover:scale-110">
            {pageDescription.title}
          </h2>
          <p className="text-center text-gray-300 mb-4 max-w-3xl mx-auto">
            {pageDescription.subtitle}
          </p>
          <p className="text-center text-gray-400 max-w-3xl mx-auto">
            {pageDescription.description}
          </p>
        </div>
      
        {/* Navigation subsection */}
        <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-4">
          {/* Main tab row */}
          <div className="container mx-auto">
            {/* Search bar with filter */}
            <div className="flex gap-3 mb-4 overflow-visible relative">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by institution, title, keyword, or tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#2a2a2a] text-white placeholder-gray-400 px-4 py-3 pr-12 rounded-lg border border-[#444444] focus:border-red-600 focus:outline-none transition-all hover:border-red-600/70 hover:shadow-lg hover:shadow-red-600/20 hover:scale-[1.01]"
                />
                {/* Filter gear icon inside search bar */}
                {filterOptions.length > 0 && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <button
                      onClick={() => setShowFilterMenu(!showFilterMenu)}
                      className={`p-2 rounded-lg transition-all duration-200 hover:border-red-600/70 hover:shadow-lg hover:shadow-red-600/30 hover:scale-105 border border-transparent ${
                        isFilterActive ? "text-red-500" : "text-gray-400 hover:text-gray-300"
                      }`}
                      title="Filter options"
                    >
                      <FaSort className="w-5 h-5" />
                    </button>
                    
                    {/* Filter dropdown menu */}
                    {showFilterMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowFilterMenu(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 bg-[#2a2a2a] border border-[#444444] rounded-lg shadow-xl py-2 min-w-[200px] z-[200] animate-[popIn_0.2s_ease-out]">
                          {filterOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleSortChange(option.value)}
                              className={`w-full text-left px-4 py-2 transition-colors ${
                                sortBy === option.value
                                  ? "text-red-500 bg-[#333333]"
                                  : "text-gray-300 hover:bg-[#333333] hover:text-white"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Results count */}
            {resultsCount && (
              <div className="text-sm text-gray-400 mb-3">{resultsCount}</div>
            )}

            {/* Tags section */}
            {sortedTags.length > 0 && (
              <div className={`transition-all duration-300 ease-in-out overflow-hidden pb-2 ${
                showAllTags ? "max-h-[500px] opacity-100" : "max-h-40 opacity-100"
              }`}>
                <div className="flex flex-wrap gap-2 transition-all duration-300 overflow-visible py-2">
                  {/* Clear button - icon only */}
                  <button
                    onClick={() => {
                      setSelectedTag(null)
                      setSearch("")
                    }}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                    title="Clear filters"
                  >
                    <IoMdClose className="w-5 h-5" />
                  </button>
                  
                  {(showAllTags ? sortedTags : sortedTags.slice(0, 8)).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag === "" ? null : tag)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 border ${
                        selectedTag === tag
                          ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30 border-transparent"
                          : "bg-[#4a4a4a] text-gray-300 hover:bg-[#555555] hover:text-[#dc2626] hover:border-red-600 border-transparent"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                
                {/* Show more/less button */}
                {sortedTags.length > 8 && (
                  <div className="pt-1">
                    <button
                      onClick={handleShowAllTagsToggle}
                      className="text-red-500 hover:text-red-400 text-sm font-medium flex items-center gap-1 py-2 px-1 min-h-[44px]"
                    >
                      {showAllTags ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                      <span>{showAllTags ? "Show less" : "Show more"}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Content section - outside header wrapper */}
      <div className="text-white">
        <div className={`transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100 animate-fade-in-up'}`}>
          {activeSubsection === "experience" && renderTimeline("experience")}
          {activeSubsection === "education" && renderTimeline("education")}
        </div>
      </div>

      <PDFModalViewer pdfUrl={selectedPDF} onClose={() => setSelectedPDF(null)} />
    </>
  )
}

export default Resume