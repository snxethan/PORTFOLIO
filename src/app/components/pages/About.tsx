"use client"
import React, { useEffect, useState } from "react"
import { FaFilePdf, FaExternalLinkAlt, FaCog, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { useSearchParams, useRouter } from "next/navigation"

import { useExternalLink } from "../ExternalLinkHandler"
import TooltipWrapper from "../ToolTipWrapper"
import PDFModalViewer from "../PDFModalViewer"
import { skills, unrelatedSkills, certifications, Skill, Certification } from "../../data/aboutData"
import SubsectionTabs from "../SubsectionTabs"

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
    
    // Handle URL parameters for tab
    const tabParam = searchParams.get("tab")
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
    
    // Update URL with tab parameter
    const currentParams = new URLSearchParams(window.location.search)
    currentParams.set("page", "about")
    currentParams.set("tab", tabId)
    router.push(`?${currentParams.toString()}`, { scroll: false })
    
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
                highlight ? "bg-gradient-to-br from-red-500 to-red-700" : "bg-red-600/40 group-hover:bg-red-600/50"
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

  return (
    <div>
      <section id="about" className="py-20 bg-[#121212] text-white">
        <div className="container mx-auto px-4">
          {/* About description at the top */}
          <div className="text-center space-y-4 mb-12 max-w-4xl mx-auto">
            <p className="text-2xl text-gray-100 font-semibold">I&apos;m a Software Engineer focused on backend or full-stack development.</p>
            <p className="text-lg text-gray-400">Experienced in Java, C#, Node.js, and cloud platforms. Passionate about clean code, performance optimization, and staying current with industry best practices.</p>
          </div>

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
                placeholder={isFocused ? "(Name or keyword)" : "Search..."}
                className="w-full px-4 py-2 pr-12 bg-[#1e1e1e] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-white transition-transform duration-200 ease-out hover:scale-[1.02]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200 ${
                  sortBy && sortBy !== "newest" ? "text-red-500" : "text-gray-400"
                } hover:text-red-400 hover:bg-[#2a2a2a]`}
                title="Filter options"
              >
                <FaCog className="w-5 h-5" />
              </button>
              
              {/* Filter dropdown menu */}
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1e1e1e] border border-[#333333] rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleFilterChange("newest")}
                      className={`w-full text-left px-4 py-2 hover:bg-[#2a2a2a] transition-colors ${
                        sortBy === "newest" ? "text-red-500 bg-[#2a2a2a]" : "text-gray-300"
                      }`}
                    >
                      Newest
                    </button>
                    <button
                      onClick={() => handleFilterChange("name-asc")}
                      className={`w-full text-left px-4 py-2 hover:bg-[#2a2a2a] transition-colors ${
                        sortBy === "name-asc" ? "text-red-500 bg-[#2a2a2a]" : "text-gray-300"
                      }`}
                    >
                      Name (A–Z)
                    </button>
                    <button
                      onClick={() => handleFilterChange("name-desc")}
                      className={`w-full text-left px-4 py-2 hover:bg-[#2a2a2a] transition-colors ${
                        sortBy === "name-desc" ? "text-red-500 bg-[#2a2a2a]" : "text-gray-300"
                      }`}
                    >
                      Name (Z–A)
                    </button>
                    {activeSubsection === "certifications" && (
                      <button
                        onClick={() => handleFilterChange("cs-only")}
                        className={`w-full text-left px-4 py-2 hover:bg-[#2a2a2a] transition-colors ${
                          sortBy === "cs-only" ? "text-red-500 bg-[#2a2a2a]" : "text-gray-300"
                        }`}
                      >
                        Computer Science Only
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags display */}
          {!loading && (
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
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-lg shadow-red-500/30"
                        : "bg-[#333333] text-gray-300 hover:bg-[#444444] hover:scale-105"
                    } ${animationClass}`}
                  >
                    {tag}
                  </button>
                )
              })}
              {sortedTags.length > TAG_LIMIT && (
                <button
                  onClick={handleShowAllTagsToggle}
                  className="px-3 py-1.5 rounded-full text-sm font-medium bg-[#333333] text-gray-300 hover:bg-[#444444] hover:scale-105 transition-all duration-300 flex items-center gap-1"
                  aria-label={showAllTags ? "Show less tags" : "Show more tags"}
                >
                  {showAllTags ? (
                    <>
                      <FaChevronUp className="w-4 h-4 text-red-500" />
                    </>
                  ) : (
                    <>
                      <FaChevronDown className="w-4 h-4 text-red-500" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Result count */}
          <div className="text-center mb-6 text-gray-400 text-sm">
            {activeSubsection === "certifications" && `Showing ${sortedCertifications.length} Certification${sortedCertifications.length !== 1 ? 's' : ''}`}
            {activeSubsection === "skills" && `Showing ${sortedSkills.length} Skill${sortedSkills.length !== 1 ? 's' : ''}`}
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
