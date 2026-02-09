"use client"

import { useEffect, useState } from "react"
import { FaDownload, FaToggleOn, FaToggleOff } from "react-icons/fa"
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
  const resumePDF = "/resume/EthanTownsend_Resume_v2.1.pdf"

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
      if (e.key === "Escape") setSelectedPDF(null)
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

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
    if (value === "cs-only") {
      handleToggleChange(false)
    } else if (value === "" && !showAllContent) {
      handleToggleChange(true)
    }
  }

  const sortedTimeline = [...timelineData].sort((a, b) =>
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )

  const renderTimeline = (type: "experience" | "education") => {
    const filteredItems = sortedTimeline.filter((item) => {
      if (item.type !== type) return false
      return showAllContent || item.isCSRelated
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

  const handleTabChange = (tabId: string) => {
    setIsAnimating(true)
    setTimeout(() => {
      setActiveSubsection(tabId)
      setIsAnimating(false)
    }, 150)
  }

  const tabs = [
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
  ]

  // Filter timeline items based on search
  const filterTimelineBySearch = (items: typeof timelineData) => {
    if (!search) return items
    return items.filter((item) => {
      const nameMatch = item.institution?.toLowerCase().includes(search.toLowerCase())
      const locationMatch = item.location?.toLowerCase().includes(search.toLowerCase())
      const highlightMatch = item.highlights?.some((h) => h.toLowerCase().includes(search.toLowerCase()))
      const summaryMatch = item.summary?.toLowerCase().includes(search.toLowerCase())
      return nameMatch || locationMatch || highlightMatch || summaryMatch
    })
  }

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

          {/* Search bar and dropdown filter under tabs */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
            <input
              type="text"
              placeholder={isFocused ? "(Institution, title, or keyword)" : "Search..."}
              className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-white transition-transform duration-200 ease-out hover:scale-[1.02]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <select
              className="w-full md:w-auto px-4 py-2 bg-[#1e1e1e] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-white appearance-none transition-transform duration-200 ease-out hover:scale-[1.02]"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="" disabled hidden>Filter...</option>
              <option value="">Default</option>
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
              <option value="oldest">Oldest</option>
              <option value="newest">Newest</option>
              <option value="cs-only">Computer Science Only</option>
            </select>
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