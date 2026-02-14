"use client"
import React, { useEffect, useState } from "react"
import { FaExternalLinkAlt } from "react-icons/fa"
import { useExternalLink } from "../../ExternalLinkHandler"
import TooltipWrapper from "../../ToolTipWrapper"
import { skills, Skill } from "../../../data/aboutData"
import SearchFilterBar from "../../SearchFilterBar"
import { getTimedItem, setTimedItem, removeTimedItem } from "../../../utils/timedStorage"

const SkillsPage = () => {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(() => {
    if (typeof window !== 'undefined') {
      return getTimedItem<string>('skillsSearch') || ""
    }
    return ""
  })
  const [sortBy, setSortBy] = useState(() => {
    if (typeof window !== 'undefined') {
      return getTimedItem<string>('skillsSortBy') || "hard-soft"
    }
    return "hard-soft"
  })
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showTagsMenu, setShowTagsMenu] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = getTimedItem<string>('skillsSelectedTag')
      return saved !== null ? saved : "Computer Science"
    }
    return "Computer Science"
  })
  const { handleExternalClick } = useExternalLink()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimedItem('skillsSearch', search)
    }
  }, [search])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimedItem('skillsSortBy', sortBy)
    }
  }, [sortBy])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedTag !== null) {
        setTimedItem('skillsSelectedTag', selectedTag)
      } else {
        removeTimedItem('skillsSelectedTag')
      }
    }
  }, [selectedTag])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowFilterMenu(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    
    return () => {
      clearTimeout(timer)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])
  
  const handleFilterChange = (value: string) => {
    setSortBy(value)
    setTimedItem('skillsSortBy', value)
    setShowFilterMenu(false)
  }

  const renderSkillGrid = (items: Skill[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => { 
          const { name, icon: Icon, highlight, url } = item
          const Card = (
            <div
              className={`group relative flex flex-col bg-[#1a1a1a] hover:bg-[#252525] p-6 rounded-xl shadow-lg border border-[#333333] hover:border-red-600/50 transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 min-h-[140px]`} 
            >
              <div className="flex items-start gap-4 mb-3">
                <div
                  className={`flex-shrink-0 p-3 rounded-lg shadow-lg ${
                    highlight ? "bg-gradient-to-br from-red-500/80 to-red-700/80" : "bg-red-600/40 group-hover:bg-red-600/50"
                  }`} 
                >
                  <Icon className="text-white text-2xl" /> 
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-base mb-1 truncate group-hover:text-[#dc2626] transition-colors duration-300">{name}</h3>
                </div>
              </div>
              
              {url && !url.endsWith(".pdf") && (
                <div className="absolute bottom-4 right-4 text-gray-400 group-hover:text-[#dc2626] transition-colors duration-300"> 
                  <FaExternalLinkAlt size={16} aria-label="Open external link" />
                </div>
              )}
            </div>
          )

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

  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>()
    skills.forEach(item => {
      item.tags?.forEach(tag => tagSet.add(tag))
    })
    const tags = Array.from(tagSet).sort()
    return ["Hard Skills", "Soft Skills", ...tags]
  }, [])
  
  const sortedTags = React.useMemo(() => {
    if (!allTags.length) return []
    return allTags.slice().sort((a, b) => a.localeCompare(b))
  }, [allTags])

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = sortBy !== "cs-only" ? true : skill.tags?.includes("Computer Science")
    const matchesTag = !selectedTag || skill.tags?.includes(selectedTag) || 
      (selectedTag === "Hard Skills" && skill.highlight === true) ||
      (selectedTag === "Soft Skills" && skill.highlight !== true)
    return matchesSearch && matchesFilter && matchesTag
  })

  const sortedSkills = [...filteredSkills].sort((a, b) => {
    if (sortBy === "cs-only") return 0
    if (sortBy === "hard-soft") {
      if (a.highlight === b.highlight) return a.name.localeCompare(b.name)
      return a.highlight ? -1 : 1
    }
    if (sortBy === "soft-hard") {
      if (a.highlight === b.highlight) return a.name.localeCompare(b.name)
      return a.highlight ? 1 : -1
    }
    if (sortBy === "name-asc") return a.name.localeCompare(b.name)
    if (sortBy === "name-desc") return b.name.localeCompare(a.name)
    if (a.highlight === b.highlight) {
      return a.name.localeCompare(b.name)
    }
    return a.highlight ? -1 : 1
  })

  const filterOptions = [
    { value: "hard-soft", label: "Skills (Hard-Soft)" },
    { value: "soft-hard", label: "Skills (Soft-Hard)" },
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "name-desc", label: "Name (Z–A)" },
  ]

  const resultsCount = `Showing ${sortedSkills.length} Skill${sortedSkills.length !== 1 ? 's' : ''}`

  return (
    <>
      <div className="bg-[#222222] rounded-xl border border-[#333333] p-6 mb-6 animate-fadeInScale">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent transition-transform duration-200 ease-out hover:scale-110">
            Technical Skills & Expertise
          </h2>
          <p className="text-center text-gray-300 mb-4 max-w-3xl mx-auto">
            Technologies, frameworks, and tools I work with
          </p>
          <p className="text-center text-gray-400 max-w-3xl mx-auto">
            Proficient in full-stack development, cloud architecture, and modern software engineering practices.
          </p>
        </div>
      
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl py-4 px-4">
          <div className="container mx-auto">
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
              defaultSort="hard-soft"
            />

            {resultsCount && (
              <div className="text-sm text-gray-400 mb-3">{resultsCount}</div>
            )}
          </div>
        </div>
      </div>
      
      <section id="skills" className="text-white">
        <div className="transition-opacity duration-150 opacity-100 animate-fade-in-up">
          {loading ? renderSkeletonGrid(9) : renderSkillGrid(sortedSkills)}
        </div>
      </section>
    </>
  )
}

export default SkillsPage
