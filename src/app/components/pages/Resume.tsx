"use client"

import React, { useEffect, useState } from "react"
import { FaDownload, FaToggleOn, FaToggleOff, FaCog, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { useSearchParams, useRouter } from "next/navigation"
import TooltipWrapper from "../ToolTipWrapper"
import PDFModalViewer from "../PDFModalViewer"
import { timelineData } from "../../data/timelineData"
import Timeline from "../Timeline"
import SubsectionTabs from "../SubsectionTabs"

const Resume = () => {
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null)
  const [showAllContent, setShowAllContent] = useState(false)
  const [isToggleAnimating, setIsToggleAnimating] = useState(false)
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set())
  const [disappearingItems, setDisappearingItems] = useState<Set<string>>(new Set())
  const [activeSubsection, setActiveSubsection] = useState("experience")
  const [isAnimating, setIsAnimating] = useState(false)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("")
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
    
    // Handle URL parameters for tab
    const tabParam = searchParams.get("tab")
    if (tabParam && (tabParam === "experience" || tabParam === "education")) {
      setActiveSubsection(tabParam)
    }
    
    // Load filter from localStorage
    const savedFilter = localStorage.getItem("globalFilter")
    if (savedFilter && savedFilter !== "cs-only") {
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
    
    // Update URL with tab parameter
    const currentParams = new URLSearchParams(window.location.search)
    currentParams.set("page", "resume")
    currentParams.set("tab", tabId)
    router.push(`?${currentParams.toString()}`, { scroll: false })
    
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
      
      // CS filter
      const matchesCSFilter = showAllContent || item.isCSRelated
      
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
    
    // Also include items that are disappearing for animation
    const itemsToRender = showAllContent ? 
      filteredItems : 
      sortedTimeline.filter(item => {
        if (item.type !== type) return false
        const itemKey = `${item.institution}-${item.startDate}`
        return item.isCSRelated || disappearingItems.has(itemKey)
      })

    if (itemsToRender.length === 0) {
      return (
        <div className="text-center text-gray-400 py-8">
          <p>No {showAllContent ? '' : 'CS-related '}items to display.</p>
          {!showAllContent && (
            <p className="text-sm mt-2">Toggle &quot;Show All Content&quot; to see additional items.</p>
          )}
        </div>
      )
    }

    return (
      <Timeline
        items={itemsToRender}
        type={type}
        showAllContent={showAllContent}
        animatingItems={animatingItems}
        disappearingItems={disappearingItems}
      />
    )
  }

  const tabs = [
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
  ]

  return (
    <div>
      <div className="bg-[#121212] text-white py-20">
        <div className="container mx-auto px-4">
          <header className="text-center mb-8">
            <h1 className="text-4xl mb-2">Ethan Townsend</h1>
            <p className="text-gray-300">Software Engineer</p>
            <p className="text-gray-400">Salt Lake City, UT</p>
            <p className="text-gray-400">snxethan@gmail.com</p>
            
            {/* Download Resume button under title */}
            <div className="mt-6 flex justify-center">
              <TooltipWrapper label="View Resume" url={resumePDF}>
                <button
                  onClick={() => setSelectedPDF(resumePDF)}
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
                >
                  <FaDownload /> View Resume
                </button>
              </TooltipWrapper>
            </div>
          </header>

          {/* Tabs */}
          <SubsectionTabs 
            tabs={tabs}
            activeTab={activeSubsection}
            onTabChange={handleTabChange}
          />

          {/* Search bar with gear icon filter */}
          <div className="mb-6 max-w-4xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder={isFocused ? "(Institution, title, or keyword)" : "Search..."}
                className="w-full px-4 py-2 pr-12 bg-[#1e1e1e] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-white transition-transform duration-200 ease-out hover:scale-[1.02]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200 ${
                  sortBy && sortBy !== "" ? "text-red-500" : "text-gray-400"
                } hover:text-red-400 hover:bg-[#2a2a2a]`}
                title="Filter options"
              >
                <FaCog className="w-5 h-5" />
                {sortBy && sortBy !== "" && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {/* Filter dropdown menu */}
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1e1e1e] border border-[#333333] rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleSortChange("")}
                      className={`w-full text-left px-4 py-2 hover:bg-[#2a2a2a] transition-colors ${
                        sortBy === "" ? "text-red-500 bg-[#2a2a2a]" : "text-gray-300"
                      }`}
                    >
                      Default
                    </button>
                    <button
                      onClick={() => handleSortChange("name-asc")}
                      className={`w-full text-left px-4 py-2 hover:bg-[#2a2a2a] transition-colors ${
                        sortBy === "name-asc" ? "text-red-500 bg-[#2a2a2a]" : "text-gray-300"
                      }`}
                    >
                      Name (A–Z)
                    </button>
                    <button
                      onClick={() => handleSortChange("name-desc")}
                      className={`w-full text-left px-4 py-2 hover:bg-[#2a2a2a] transition-colors ${
                        sortBy === "name-desc" ? "text-red-500 bg-[#2a2a2a]" : "text-gray-300"
                      }`}
                    >
                      Name (Z–A)
                    </button>
                    <button
                      onClick={() => handleSortChange("oldest")}
                      className={`w-full text-left px-4 py-2 hover:bg-[#2a2a2a] transition-colors ${
                        sortBy === "oldest" ? "text-red-500 bg-[#2a2a2a]" : "text-gray-300"
                      }`}
                    >
                      Oldest
                    </button>
                    <button
                      onClick={() => handleSortChange("newest")}
                      className={`w-full text-left px-4 py-2 hover:bg-[#2a2a2a] transition-colors ${
                        sortBy === "newest" ? "text-red-500 bg-[#2a2a2a]" : "text-gray-300"
                      }`}
                    >
                      Newest
                    </button>
                    <button
                      onClick={() => handleSortChange("cs-only")}
                      className={`w-full text-left px-4 py-2 hover:bg-[#2a2a2a] transition-colors ${
                        sortBy === "cs-only" ? "text-red-500 bg-[#2a2a2a]" : "text-gray-300"
                      }`}
                    >
                      Computer Science Only
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags display */}
          <div className="flex flex-wrap justify-center gap-3 mb-6 max-w-4xl mx-auto">
            {(showAllTags ? sortedTags : sortedTags.slice(0, TAG_LIMIT)).map((tag, index) => {
              const isSelected = selectedTag === tag || (tag === "ALL" && selectedTag === null)
              const isAdditionalTag = index >= TAG_LIMIT
              
              let animationClass = ""
              if (isAdditionalTag) {
                if (isExtending) {
                  animationClass = "animate-tag-extend"
                } else if (isHiding) {
                  animationClass = "animate-tag-hide"
                }
              }

              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === "ALL" ? null : tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform ${
                    isSelected
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-lg"
                      : "bg-[#1e1e1e] text-gray-300 border border-[#333333] hover:border-red-600/50 hover:scale-105"
                  } ${animationClass}`}
                >
                  {tag}
                </button>
              )
            })}
            {sortedTags.length > TAG_LIMIT && (
              <button
                onClick={handleShowAllTagsToggle}
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-[#1e1e1e] text-gray-300 border border-[#333333] hover:border-red-600/50 hover:scale-105 transition-all duration-300 flex items-center gap-1"
              >
                {showAllTags ? (
                  <>
                    Show Less <FaChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    +{sortedTags.length - TAG_LIMIT} More <FaChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Result count */}
          <div className="text-center mb-6 text-gray-400 text-sm">
            {activeSubsection === "experience" && `Showing ${sortedTimeline.filter(i => i.type === "experience" && (showAllContent || i.isCSRelated) && (!search || 
              i.institution?.toLowerCase().includes(search.toLowerCase()) ||
              i.location?.toLowerCase().includes(search.toLowerCase()) ||
              i.summary?.toLowerCase().includes(search.toLowerCase()) ||
              i.highlights?.some(h => h.toLowerCase().includes(search.toLowerCase()))) && (!selectedTag || selectedTag === "ALL" || i.tags?.includes(selectedTag))).length} Experience${sortedTimeline.filter(i => i.type === "experience" && (showAllContent || i.isCSRelated)).length !== 1 ? 's' : ''}`}
            {activeSubsection === "education" && `Showing ${sortedTimeline.filter(i => i.type === "education" && (showAllContent || i.isCSRelated) && (!search || 
              i.institution?.toLowerCase().includes(search.toLowerCase()) ||
              i.location?.toLowerCase().includes(search.toLowerCase()) ||
              i.summary?.toLowerCase().includes(search.toLowerCase()) ||
              i.highlights?.some(h => h.toLowerCase().includes(search.toLowerCase()))) && (!selectedTag || selectedTag === "ALL" || i.tags?.includes(selectedTag))).length} Education Item${sortedTimeline.filter(i => i.type === "education" && (showAllContent || i.isCSRelated)).length !== 1 ? 's' : ''}`}
          </div>

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