"use client"

import React, { useEffect, useState } from "react"
import { FaDownload, FaCog, FaChevronDown, FaChevronUp, FaSearch, FaTimes, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa"
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
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>("Computer Science")
  const [showAllTags, setShowAllTags] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [clickedTab, setClickedTab] = useState<string | null>(null)
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
    localStorage.setItem("globalFilter", value)
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
  
  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded)
    if (isSearchExpanded) {
      // Clear search when collapsing
      setSearch("")
    }
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

  return (
    <>
      {/* Header section - wrapped in styled container */}
      <div className="bg-[#222222] rounded-xl border border-[#333333] p-6 mb-6 animate-fadeInScale">
        {/* Header content */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Experience & Education Timeline
          </h2>
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-white">Ethan Townsend</h3>
            <p className="text-lg text-gray-400">Full Stack Software Developer</p>
            <p className="text-sm text-gray-500">Salt Lake City, UT</p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <a href="mailto:snxethan@gmail.com" className="text-gray-400 hover:text-red-500 transition-colors duration-200" aria-label="Email">
                <FaEnvelope className="text-xl" />
              </a>
              <a href="https://github.com/snxethan" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors duration-200" aria-label="GitHub">
                <FaGithub className="text-xl" />
              </a>
              <a href="https://linkedin.com/in/snxethan" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors duration-200" aria-label="LinkedIn">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>
          
          <div className="flex justify-center">
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
      
        {/* Navigation subsection */}
        <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-4">
          {/* Main tab row */}
          <div className="container mx-auto">
            <div className="relative z-50 flex flex-col sm:flex-row items-center justify-center gap-3 overflow-visible">
              {/* Tab buttons - centered */}
              <div className="flex gap-2 justify-center flex-wrap">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    disabled={activeSubsection === tab.id}
                    className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                      clickedTab === tab.id ? "animate-elastic-in" : ""
                    } ${
                      activeSubsection === tab.id
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-500/10 cursor-default"
                        : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-red-400 cursor-pointer"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search toggle button - responsive positioning */}
              <button
                onClick={toggleSearch}
                className={`sm:absolute sm:right-0 h-[42px] px-3 rounded-lg border transition-all duration-200 hover:scale-105 ${
                  isSearchExpanded
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-[#2a2a2a] text-gray-300 border-[#333333] hover:border-red-600/50 hover:bg-[#333333]"
                }`}
                title={isSearchExpanded ? "Close search" : "Open search"}
              >
                {isSearchExpanded ? <FaTimes className="w-5 h-5" /> : <FaSearch className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Expandable search section */}
          <div
            className={`overflow-visible transition-all duration-300 ease-in-out ${
              isSearchExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="container mx-auto pt-4 border-t border-[#333333] mt-4">
          {/* Search bar with filter */}
          <div className="flex gap-3 mb-4 overflow-visible relative">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by institution, title, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white placeholder-gray-400 px-4 py-3 pr-12 rounded-lg border border-[#444444] focus:border-red-600 focus:outline-none transition-all"
              />
              {/* Filter gear icon inside search bar */}
              {filterOptions.length > 0 && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className={`p-2 rounded-lg transition-all ${
                      isFilterActive ? "text-red-500" : "text-gray-400 hover:text-gray-300"
                    }`}
                    title="Filter options"
                  >
                    <FaCog className="w-5 h-5" />
                  </button>
                  
                  {/* Filter dropdown menu */}
                  {showFilterMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowFilterMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 bg-[#2a2a2a] border border-[#444444] rounded-lg shadow-xl py-2 min-w-[200px] z-[9999]">
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
            <div className={`space-y-2 transition-all duration-300 ease-in-out overflow-hidden ${
              showAllTags ? "max-h-[500px] opacity-100" : "max-h-24 opacity-100"
            }`}>
              <div className="flex flex-wrap gap-2 transition-all duration-300">
                {/* Clear button */}
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    !selectedTag
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30"
                      : "bg-[#333333] text-gray-300 hover:bg-[#444444]"
                  }`}
                >
                  ×
                </button>
                
                {(showAllTags ? sortedTags : sortedTags.slice(0, 8)).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag === "" ? null : tag)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      selectedTag === tag
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30"
                        : "bg-[#333333] text-gray-300 hover:bg-[#444444]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              
              {/* Show more/less button */}
              {sortedTags.length > 8 && (
                <button
                  onClick={handleShowAllTagsToggle}
                  className="text-red-500 hover:text-red-400 text-sm font-medium flex items-center gap-1"
                >
                  {showAllTags ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
        </div>
      </div>
      
      {/* Content section - outside header wrapper */}
      <div className="text-white py-20">
        <div className="container mx-auto px-4">
          <div className={`transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100 animate-fade-in-up'}`}>
            {activeSubsection === "experience" && renderTimeline("experience")}
            {activeSubsection === "education" && renderTimeline("education")}
          </div>
        </div>
      </div>

      <PDFModalViewer pdfUrl={selectedPDF} onClose={() => setSelectedPDF(null)} />
    </>
  )
}

export default Resume