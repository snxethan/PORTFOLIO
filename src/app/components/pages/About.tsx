"use client"
import React, { useEffect, useState } from "react"
import { FaFilePdf, FaExternalLinkAlt, FaSort, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { IoMdClose } from "react-icons/io"
import { useSearchParams, useRouter } from "next/navigation"

import { useExternalLink } from "../ExternalLinkHandler"
import TooltipWrapper from "../ToolTipWrapper"
import PDFModalViewer from "../PDFModalViewer"
import { skills, certifications, Skill, Certification } from "../../data/aboutData"
import SearchFilterBar from "../SearchFilterBar"

const About = () => {
  const [loading, setLoading] = useState(true)
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null)
  const [activeSubsection, setActiveSubsection] = useState("certifications")
  const [isAnimating, setIsAnimating] = useState(false)
  const [search, setSearch] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aboutSearch') || ""
    }
    return ""
  })
  const [sortBy, setSortBy] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aboutSortBy') || "newest"
    }
    return "newest"
  })
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showTagsMenu, setShowTagsMenu] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aboutSelectedTag')
      return saved !== null ? saved : "Computer Science"
    }
    return "Computer Science"
  })
  const [showAllTags, setShowAllTags] = useState(false)
  const [clickedTab, setClickedTab] = useState<string | null>(null)
  const { handleExternalClick } = useExternalLink()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Persist filter and sort state for About page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aboutSearch', search)
    }
  }, [search])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aboutSortBy', sortBy)
    }
  }, [sortBy])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedTag !== null) {
        localStorage.setItem('aboutSelectedTag', selectedTag)
      } else {
        localStorage.removeItem('aboutSelectedTag')
      }
    }
  }, [selectedTag])

  useEffect(() => {
    // Show skeleton loader for 500ms for consistent UX
    const timer = setTimeout(() => setLoading(false), 500)
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
    
    // Load filter from localStorage (per-tab persistence)
    const savedFilter = localStorage.getItem(`${activeSubsection}-filter`)
    if (savedFilter) {
      setSortBy(savedFilter)
    }
    
    return () => {
      clearTimeout(timer)
      document.removeEventListener("keydown", handleEscape)
    }
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
    localStorage.setItem(`${activeSubsection}-filter`, value)
    setShowFilterMenu(false)
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
            className={`group relative flex flex-col bg-[#1a1a1a] hover:bg-[#252525] p-6 rounded-xl shadow-lg border border-[#333333] hover:border-red-600/50 transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 min-h-[140px]`} 
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
                <h3 className="text-white font-semibold text-base mb-1 truncate group-hover:text-[#dc2626] transition-colors duration-300">{name}</h3>
                {year && (
                  <span className="text-gray-400 text-sm">{year}</span>
                )} 
              </div>
            </div>
            
            {(url?.endsWith(".pdf") || (url && !url.endsWith(".pdf"))) && (
              <div className="absolute bottom-4 right-4 text-gray-400 group-hover:text-[#dc2626] transition-colors duration-300"> 
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
        <div key={i} className="bg-[#1a1a1a] border border-[#333333] p-6 rounded-xl animate-pulse flex flex-col gap-4 min-h-[140px]">
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
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl py-4 px-4">
          {/* Main tab row */}
          <div className="container mx-auto">
            {/* Search bar with filter using SearchFilterBar component */}
            <SearchFilterBar
              search={search}
              setSearch={setSearch}
              placeholder="Search by name, keyword, or tags..."
              tags={sortedTags}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              sortOptions={filterOptions}
              selectedSort={sortBy}
              setSelectedSort={handleFilterChange}
              showTagsMenu={showTagsMenu}
              setShowTagsMenu={setShowTagsMenu}
              showFilterMenu={showFilterMenu}
              setShowFilterMenu={setShowFilterMenu}
            />

            {/* Results count */}
            {resultsCount && (
              <div className="text-sm text-gray-400 mb-3">{resultsCount}</div>
            )}
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
