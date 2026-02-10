"use client"
import React, { useEffect, useState } from "react"
import { FaFilePdf, FaExternalLinkAlt, FaCog, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { useSearchParams, useRouter } from "next/navigation"

import { useExternalLink } from "../ExternalLinkHandler"
import TooltipWrapper from "../ToolTipWrapper"
import PDFModalViewer from "../PDFModalViewer"
import { skills, unrelatedSkills, certifications, Skill, Certification } from "../../data/aboutData"
import StaticTabNav from "../StaticTabNav"

const About = () => {
  const [loading, setLoading] = useState(true)
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null)
  const [activeSubsection, setActiveSubsection] = useState("certifications")
  const [isAnimating, setIsAnimating] = useState(false)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [isFocused, setIsFocused] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showAllTags, setShowAllTags] = useState(false)
  const [isExtending, setIsExtending] = useState(false)
  const [isHiding, setIsHiding] = useState(false)
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
    setIsAnimating(true)
    
    // Save to localStorage
    localStorage.setItem("aboutActiveTab", tabId)
    
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

  const renderSkillGrid = (items: Skill[] | Certification[]) => {
    const sortedItems = [...items].sort((a, b) => {
      if (a.highlight === b.highlight) {
        return a.name.localeCompare(b.name)
      }
      return a.highlight ? -1 : 1
    })

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {sortedItems.map(({ name, icon: Icon, highlight, url }) => { 
        const Card = (
          <div
            className={`group relative flex flex-col items-center bg-[#1e1e1e] hover:bg-[#252525] p-3 sm:p-4 rounded-xl shadow-lg border border-[#333333] hover:border-red-600/50 transition-transform duration-300 ease-out hover:scale-[1.09] active:scale-95`} 
          >
            <div // Icon container
              className={`inline-block p-1.5 sm:p-2 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                highlight ? "bg-gradient-to-br from-red-500/80 to-red-700/80" : "bg-red-600/40 group-hover:bg-red-600/50"
              }`} 
            >
              <Icon className="text-white text-lg sm:text-xl" /> 
            </div>
            {/* Removed whitespace-nowrap to allow text to wrap */}
            <p className="text-white mt-1.5 sm:mt-2 font-semibold text-xs sm:text-sm text-center">{name}</p> 
            
            {(url?.endsWith(".pdf") || (url && !url.endsWith(".pdf"))) && (
              <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 text-gray-400 group-hover:text-red-400 transition-colors duration-300"> 
                {url?.endsWith(".pdf") && <FaFilePdf size={14} aria-label="View Certification" />} 
                {url && !url.endsWith(".pdf") && <FaExternalLinkAlt size={14} aria-label="Open external link" />} 
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-[#1e1e1e] border border-[#333333] p-3 sm:p-4 rounded-xl animate-pulse flex flex-col items-center mx-auto">
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
    return ["ALL", ...tags]
  }, [activeSubsection])
  
  const TAG_LIMIT = 8
  
  const sortedTags = React.useMemo(() => {
    if (!allTags.length) return []
    const [first, ...rest] = allTags
    const sortedRest = rest.slice().sort((a, b) => a.localeCompare(b))
    return first === "ALL" ? [first, ...sortedRest] : allTags.slice().sort((a, b) => a.localeCompare(b))
  }, [allTags])

  // Filter certifications based on search, sort, and tag
  const filteredCertifications = certifications.filter((cert) => {
    const matchesSearch = cert.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = sortBy !== "cs-only" || cert.tags?.includes("Computer Science")
    const matchesTag = !selectedTag || selectedTag === "ALL" || cert.tags?.includes(selectedTag)
    return matchesSearch && matchesFilter && matchesTag
  })

  // Apply sorting to certifications
  const sortedCertifications = [...filteredCertifications].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name)
    if (sortBy === "name-desc") return b.name.localeCompare(a.name)
    // Default sort (highlight first, then alphabetical)
    if (a.highlight === b.highlight) {
      return a.name.localeCompare(b.name)
    }
    return a.highlight ? -1 : 1
  })

  // Filter skills based on search and tag
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = sortBy !== "cs-only" || skill.tags?.includes("Computer Science")
    const matchesTag = !selectedTag || selectedTag === "ALL" || skill.tags?.includes(selectedTag)
    return matchesSearch && matchesFilter && matchesTag
  })

  // Apply sorting to skills
  const sortedSkills = [...filteredSkills].sort((a, b) => {
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
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "name-desc", label: "Name (Z–A)" },
    { value: "cs-only", label: "Computer Science Only" },
  ] : [
    { value: "newest", label: "Newest" },
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "name-desc", label: "Name (Z–A)" },
  ]

  const resultsCount = activeSubsection === "certifications" 
    ? `Showing ${sortedCertifications.length} Certification${sortedCertifications.length !== 1 ? 's' : ''}`
    : `Showing ${sortedSkills.length} Skill${sortedSkills.length !== 1 ? 's' : ''}`

  return (
    <div>
      <StaticTabNav
        tabs={tabs}
        activeTab={activeSubsection}
        onTabChange={handleTabChange}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or keyword..."
        tags={sortedTags}
        selectedTag={selectedTag}
        onTagClick={(tag) => setSelectedTag(tag === "ALL" ? null : tag)}
        showAllTags={showAllTags}
        onToggleTags={handleShowAllTagsToggle}
        filterOptions={filterOptions}
        currentFilter={sortBy}
        onFilterChange={handleFilterChange}
        resultsCount={resultsCount}
      />
      
      <section id="about" className="py-20 bg-[#121212] text-white">
        <div className="container mx-auto px-4">
          {/* About description at the top */}
          <div className="text-center space-y-4 mb-12 max-w-4xl mx-auto">
            <p className="text-2xl text-gray-100 font-semibold">I&apos;m a Software Engineer focused on backend or full-stack development.</p>
            <p className="text-lg text-gray-400">Experienced in Java, C#, Node.js, and cloud platforms. Passionate about clean code, performance optimization, and staying current with industry best practices.</p>
          </div>

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
        </div>
      </section>

      <PDFModalViewer pdfUrl={selectedPDF} onClose={() => setSelectedPDF(null)} />
    </div>
  )
}

export default About
