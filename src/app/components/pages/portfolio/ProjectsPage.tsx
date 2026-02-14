"use client"

import React, { useEffect, useState } from "react"
import { projectsTimelineData } from "../../../data/projectsTimelineData"
import Timeline from "../../Timeline"
import SearchFilterBar from "../../SearchFilterBar"
import { getTimedItem, setTimedItem, removeTimedItem } from "../../../utils/timedStorage"

const filterOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
]

const ProjectsPage = () => {
  const [search, setSearch] = useState(() => {
    if (typeof window !== 'undefined') {
      return getTimedItem<string>('projectsSearch') || ""
    }
    return ""
  })
  const [sortBy, setSortBy] = useState(() => {
    if (typeof window !== 'undefined') {
      return getTimedItem<string>('projectsSortBy') || "newest"
    }
    return "newest"
  })
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showTagsMenu, setShowTagsMenu] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = getTimedItem<string>('projectsSelectedTag')
      return saved !== null ? saved : "Computer Science"
    }
    return "Computer Science"
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimedItem('projectsSearch', search)
    }
  }, [search])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimedItem('projectsSortBy', sortBy)
    }
  }, [sortBy])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedTag !== null) {
        setTimedItem('projectsSelectedTag', selectedTag)
      } else {
        removeTimedItem('projectsSelectedTag')
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
    
    const savedFilter = localStorage.getItem('projectsSortBy')
    if (savedFilter) {
      const isValidFilter = filterOptions.some(option => option.value === savedFilter)
      if (isValidFilter) {
        setSortBy(savedFilter)
      }
    }
    
    return () => {
      clearTimeout(timer)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setTimedItem('projectsSortBy', value)
    setShowFilterMenu(false)
  }

  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>()
    projectsTimelineData.forEach(item => {
      item.tags?.forEach(tag => tagSet.add(tag))
      item.topics?.forEach(topic => tagSet.add(topic))
    })
    return Array.from(tagSet).sort()
  }, [])
  
  const sortedTags = React.useMemo(() => {
    if (!allTags.length) return []
    return allTags.slice().sort((a, b) => a.localeCompare(b))
  }, [allTags])

  const filteredTimelineProjects = projectsTimelineData.filter((project) => {
    const matchesSearch = !search || 
      project.name?.toLowerCase().includes(search.toLowerCase()) ||
      project.summary?.toLowerCase().includes(search.toLowerCase()) ||
      project.topics?.some((topic) => topic.toLowerCase().includes(search.toLowerCase())) ||
      project.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    
    const matchesTag = !selectedTag || selectedTag === "Computer Science" ||
      project.tags?.includes(selectedTag) ||
      project.topics?.includes(selectedTag)
    
    return matchesSearch && matchesTag
  })

  const sortedProjects = [...filteredTimelineProjects].sort((a, b) => {
    if (sortBy === "name-asc") {
      return (a.name || "").localeCompare(b.name || "")
    }
    if (sortBy === "name-desc") {
      return (b.name || "").localeCompare(a.name || "")
    }
    if (sortBy === "oldest") {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    }
    if (sortBy === "newest") {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    }
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })

  const renderTimeline = () => {
    if (sortedProjects.length === 0) {
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

    return <Timeline items={sortedProjects} type="project" />
  }

  const resultsCount = `Showing ${sortedProjects.length} Project${sortedProjects.length !== 1 ? 's' : ''}`

  return (
    <>
      <div className="bg-[#222222] rounded-xl border border-[#333333] p-6 mb-6 animate-fadeInScale">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Project Timeline
          </h2>
          <p className="text-center text-gray-300 mb-4 max-w-3xl mx-auto">
            Key projects and contributions throughout my career
          </p>
          <p className="text-center text-gray-400 max-w-3xl mx-auto">
            Full-stack applications, web games, and development tools built with modern technologies.
          </p>
        </div>
      
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl py-4 px-4">
          <div className="container mx-auto">
            <SearchFilterBar
              search={search}
              setSearch={setSearch}
              placeholder="Search by name, description, or tags..."
              tags={sortedTags}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              sortOptions={filterOptions}
              selectedSort={sortBy}
              setSelectedSort={handleSortChange}
              showTagsMenu={showTagsMenu}
              setShowTagsMenu={setShowTagsMenu}
              showFilterMenu={showFilterMenu}
              setShowFilterMenu={setShowFilterMenu}
              defaultSort="newest"
            />

            {resultsCount && (
              <div className="text-sm text-gray-400 mb-3">{resultsCount}</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-white">
        <div className="transition-opacity duration-150 opacity-100 animate-fade-in-up">
          {renderTimeline()}
        </div>
      </div>
    </>
  )
}

export default ProjectsPage
