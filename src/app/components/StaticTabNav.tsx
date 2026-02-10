"use client"

import { useState } from "react"
import { FaSearch, FaTimes, FaCog, FaChevronDown, FaChevronUp } from "react-icons/fa"

interface Tab {
  id: string
  label: string
  description?: string
}

interface StaticTabNavProps {
  headerContent?: React.ReactNode
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  // Search props
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  // Tags props  
  tags?: string[]
  selectedTag?: string | null
  onTagClick?: (tag: string) => void
  showAllTags?: boolean
  onToggleTags?: () => void
  // Filter props
  filterOptions?: { value: string; label: string }[]
  currentFilter?: string
  onFilterChange?: (value: string) => void
  // Results count
  resultsCount?: string
}

const StaticTabNav: React.FC<StaticTabNavProps> = ({
  headerContent,
  tabs,
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  tags = [],
  selectedTag = null,
  onTagClick,
  showAllTags = false,
  onToggleTags,
  filterOptions = [],
  currentFilter = "newest",
  onFilterChange,
  resultsCount,
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [clickedTab, setClickedTab] = useState<string | null>(null)

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded)
    if (isSearchExpanded) {
      // Clear search when collapsing
      onSearchChange("")
    }
  }

  const handleTabClick = (tabId: string) => {
    setClickedTab(tabId)
    setTimeout(() => setClickedTab(null), 300)
    onTabChange(tabId)
  }

  const handleFilterChange = (value: string) => {
    if (onFilterChange) {
      onFilterChange(value)
    }
    setShowFilterMenu(false)
  }

  const isFilterActive = currentFilter && currentFilter !== "newest"

  return (
    <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl p-6 shadow-lg mb-6 overflow-visible">
      {/* Header content (if provided) */}
      {headerContent && (
        <div className="mb-6">
          {headerContent}
        </div>
      )}
      
      {/* Main tab row */}
      <div className="container mx-auto">
        <div className="relative flex items-center justify-center overflow-visible">
          {/* Tab buttons - centered */}
          <div className="flex gap-2 justify-center flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 ${
                  clickedTab === tab.id ? "animate-elastic-in" : ""
                } ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-500/10"
                    : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search toggle button - hidden on small screens */}
          <button
            onClick={toggleSearch}
            className={`hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-lg transition-all duration-200 ${
              isSearchExpanded
                ? "bg-red-600 text-white"
                : "bg-[#2a2a2a] text-gray-300 hover:text-white hover:bg-[#333333]"
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
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
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
                            onClick={() => handleFilterChange(option.value)}
                            className={`w-full text-left px-4 py-2 transition-colors ${
                              currentFilter === option.value
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
          {tags.length > 0 && onTagClick && (
            <div className={`space-y-2 transition-all duration-300 ease-in-out overflow-hidden ${
              showAllTags ? "max-h-[500px] opacity-100" : "max-h-24 opacity-100"
            }`}>
              <div className="flex flex-wrap gap-2 transition-all duration-300">
                {/* Clear button */}
                <button
                  onClick={() => onTagClick("")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    !selectedTag
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30"
                      : "bg-[#333333] text-gray-300 hover:bg-[#444444]"
                  }`}
                >
                  ×
                </button>
                
                {(showAllTags ? tags : tags.slice(0, 8)).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagClick(tag)}
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
              {tags.length > 8 && onToggleTags && (
                <button
                  onClick={onToggleTags}
                  className="text-red-500 hover:text-red-400 text-sm font-medium flex items-center gap-1"
                >
                  {showAllTags ? (
                    <>
                      <FaChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <FaChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StaticTabNav
