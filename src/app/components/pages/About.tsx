"use client"
import React, { useEffect, useState } from "react"
import { FaFilePdf, FaExternalLinkAlt, FaCog, FaChevronDown, FaChevronUp, FaSearch, FaTimes } from "react-icons/fa"
import { useSearchParams, useRouter } from "next/navigation"

import { useExternalLink } from "../ExternalLinkHandler"
import TooltipWrapper from "../ToolTipWrapper"
import PDFModalViewer from "../PDFModalViewer"
import { skills, certifications, Skill, Certification } from "../../data/aboutData"

const About = () => {
  const [loading, setLoading] = useState(true)
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null)
  const [activeSubsection, setActiveSubsection] = useState("certifications")
  const [isAnimating, setIsAnimating] = useState(false)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>("Computer Science")
  const [showAllTags, setShowAllTags] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [clickedTab, setClickedTab] = useState<string | null>(null)
  const { handleExternalClick } = useExternalLink()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    setLoading(false)
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPDF(null)
        setShowFilterMenu(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    
    // Load active tab from localStorage first
    const savedTab = localStorage.getItem("aboutActiveTab")
    if (savedTab && (savedTab === "certifications" || savedTab === "skills")) {
      setActiveSubsection(savedTab)
    }
    
    // Handle URL parameters for tab (takes precedence over localStorage)
    const pageParam = searchParams.get("page")
    const parts = pageParam?.split("/")
    const tabParam = parts?.[1]
    if (tabParam && (tabParam === "certifications" || tabParam === "skills")) {
      setActiveSubsection(tabParam)
    }
    
    // Load filter from localStorage
    const savedFilter = localStorage.getItem("globalFilter")
    if (savedFilter) {
      setSortBy(savedFilter)
    }
    
    return () => document.removeEventListener("keydown", handleEscape)
  }, [searchParams])

  const handleTabChange = (tabId: string) => {
    setClickedTab(tabId)
    setTimeout(() => setClickedTab(null), 300)
    setIsAnimating(true)
    
    // Save to localStorage
    localStorage.setItem("aboutActiveTab", tabId)
    
    // Scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: "smooth" })
    
    // Update URL with new format
    router.push(`?page=about/${tabId}`, { scroll: false })
    
    setTimeout(() => {
      setActiveSubsection(tabId)
      setIsAnimating(false)
    }, 150)
  }
  
  const handleFilterChange = (value: string) => {
    setSortBy(value)
    localStorage.setItem("globalFilter", value)
    setShowFilterMenu(false)
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

  const renderSkillGrid = (items: Skill[] | Certification[]) => {
    // Don't re-sort here - use the already sorted items
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => { 
        const { name, icon: Icon, highlight, url } = item
        const cert = item as Certification
        const year = cert.year 
        const Card = (
          <div
            className={`group relative flex flex-col bg-[#1e1e1e] hover:bg-[#252525] p-6 rounded-xl shadow-lg border border-[#333333] hover:border-red-600/50 transition-transform duration-200 ease-out hover:scale-105 min-h-[140px]`} 
          >
            <div className="flex items-start gap-4 mb-3">
              <div // Icon container
                className={`flex-shrink-0 p-3 rounded-lg shadow-lg ${
                  highlight ? "bg-gradient-to-br from-red-500/80 to-red-700/80" : "bg-red-600/40 group-hover:bg-red-600/50"
                }`} 
              >
                <Icon className="text-white text-2xl" /> 
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-base mb-1">{name}</h3>
                {year && (
                  <span className="text-gray-400 text-sm">{year}</span>
                )} 
              </div>
            </div>
            
            {(url?.endsWith(".pdf") || (url && !url.endsWith(".pdf"))) && (
              <div className="absolute bottom-4 right-4 text-gray-400 group-hover:text-red-400 transition-colors duration-300"> 
                {url?.endsWith(".pdf") && <FaFilePdf size={16} aria-label="View Certification" />} 
                {url && !url.endsWith(".pdf") && <FaExternalLinkAlt size={16} aria-label="Open external link" />} 
              </div>
            )}
          </div>
        )

        if (url?.endsWith(".pdf")) {
          return (
            <TooltipWrapper key={name} label="View Certification" url={url}>
              <div onClick={() => setSelectedPDF(url)} className="cursor-pointer">
                {Card}
              </div>
            </TooltipWrapper>
          )
        }

        return url ? (
          <TooltipWrapper key={name} label={url}>
            <div onClick={() => handleExternalClick(url, true)} className="cursor-pointer">
              {Card}
            </div>
          </TooltipWrapper>
        ) : (
          <div key={name} className="cursor-pointer">
            {Card}
          </div>
        )
      })}
    </div>
  )
}

  const renderSkeletonGrid = (count: number) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-[#1e1e1e] border border-[#333333] p-6 rounded-xl animate-pulse flex flex-col gap-4 min-h-[140px]">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#333333] rounded mb-1.5 sm:mb-2" /> 
          <div className="h-2.5 sm:h-3 bg-[#333333] rounded w-16 sm:w-20" />
        </div>
      ))}
    </div>
  )


  const tabs = [
    { id: "certifications", label: "Certifications" },
    { id: "skills", label: "Skills" },
  ]
  
  // Extract tags from certifications and skills
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>()
    const items = activeSubsection === "certifications" ? certifications : skills
    items.forEach(item => {
      item.tags?.forEach(tag => tagSet.add(tag))
    })
    const tags = Array.from(tagSet).sort()
    return tags
  }, [activeSubsection])
  
  const sortedTags = React.useMemo(() => {
    if (!allTags.length) return []
    return allTags.slice().sort((a, b) => a.localeCompare(b))
  }, [allTags])

  // Filter certifications based on search, sort, and tag
  const filteredCertifications = certifications.filter((cert) => {
    const matchesSearch = cert.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = sortBy !== "cs-only" || cert.tags?.includes("Computer Science")
    const matchesTag = !selectedTag || cert.tags?.includes(selectedTag)
    return matchesSearch && matchesFilter && matchesTag
  })

  // Apply sorting to certifications
  const sortedCertifications = [...filteredCertifications].sort((a, b) => {
    if (sortBy === "cs-only") return b.year - a.year  // CS items sorted newest first
    if (sortBy === "name-asc") return a.name.localeCompare(b.name)
    if (sortBy === "name-desc") return b.name.localeCompare(a.name)
    if (sortBy === "oldest") return a.year - b.year
    if (sortBy === "newest") return b.year - a.year
    // Default sort (highlight first, then alphabetical)
    if (a.highlight === b.highlight) {
      return a.name.localeCompare(b.name)
    }
    return a.highlight ? -1 : 1
  })

  // Filter skills based on search and tag
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = 
      sortBy !== "cs-only" ? true : skill.tags?.includes("Computer Science")
    const matchesHardSkills = sortBy !== "hard-skills" ? true : skill.highlight === true
    const matchesSoftSkills = sortBy !== "soft-skills" ? true : skill.highlight !== true
    const matchesTag = !selectedTag || skill.tags?.includes(selectedTag)
    return matchesSearch && matchesFilter && matchesHardSkills && matchesSoftSkills && matchesTag
  })

  // Apply sorting to skills
  const sortedSkills = [...filteredSkills].sort((a, b) => {
    if (sortBy === "cs-only") return 0  // CS only, no date sort for skills
    if (sortBy === "hard-skills") return 0  // Hard skills, no additional sort
    if (sortBy === "soft-skills") return 0  // Soft skills, no additional sort
    if (sortBy === "name-asc") return a.name.localeCompare(b.name)
    if (sortBy === "name-desc") return b.name.localeCompare(a.name)
    // Default sort (highlight first, then alphabetical)
    if (a.highlight === b.highlight) {
      return a.name.localeCompare(b.name)
    }
    return a.highlight ? -1 : 1
  })

  const filterOptions = activeSubsection === "certifications" ? [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "name-desc", label: "Name (Z–A)" },
  ] : [
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "name-desc", label: "Name (Z–A)" },
    { value: "hard-skills", label: "Hard Skills" },
    { value: "soft-skills", label: "Soft Skills" },
  ]

  const resultsCount = activeSubsection === "certifications" 
    ? `Showing ${sortedCertifications.length} Certification${sortedCertifications.length !== 1 ? 's' : ''}`
    : `Showing ${sortedSkills.length} Skill${sortedSkills.length !== 1 ? 's' : ''}`

  const isFilterActive = sortBy && sortBy !== "newest"

  // Tab-specific descriptions
  const getPageDescription = () => {
    switch (activeSubsection) {
      case "certifications":
        return {
          title: "Professional Certifications",
          subtitle: "Industry-recognized credentials and technical certifications",
          description: "Validated expertise across cloud platforms, cybersecurity, and computer science fundamentals."
        }
      case "skills":
        return {
          title: "Technical Skills & Expertise",
          subtitle: "Technologies, frameworks, and tools I work with",
          description: "Proficient in full-stack development, cloud architecture, and modern software engineering practices."
        }
      default:
        return {
          title: "Professional Certifications",
          subtitle: "Industry-recognized credentials and technical certifications",
          description: "Validated expertise across cloud platforms, cybersecurity, and computer science fundamentals."
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
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
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
            <div className="relative z-50 flex items-center justify-center gap-3 overflow-visible">
              {/* Search toggle button - centered */}
              <button
                onClick={toggleSearch}
                className={`h-[42px] px-3 rounded-lg border transition-all duration-200 hover:scale-105 ${
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
                placeholder="Search by name or keyword..."
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
                            onClick={() => handleFilterChange(option.value)}
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
      <section id="about" className="text-white">
        <div className={`transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100 animate-fade-in-up'}`}>
          {activeSubsection === "certifications" && (
            <div>
              {loading ? renderSkeletonGrid(6) : renderSkillGrid(sortedCertifications)}
            </div>
          )}

          {activeSubsection === "skills" && (
            <div>
              {loading ? renderSkeletonGrid(9) : renderSkillGrid(sortedSkills)}
            </div>
          )}
        </div>
      </section>

      <PDFModalViewer pdfUrl={selectedPDF} onClose={() => setSelectedPDF(null)} />
    </>
  )
}

export default About
