"use client"

import React, { useEffect, useState } from "react"
import { projectsTimelineData } from "../../../data/projectsTimelineData"
import Timeline from "../../Timeline"
import SearchFilterBar from "../../SearchFilterBar"
import { getTimedItem, setTimedItem, removeTimedItem } from "../../../utils/timedStorage"
import { scrollElementIntoViewWithNavbarOffset } from "../../../utils/scrollWithNavbarOffset"
import PageTabs from "../../PageTabs"
import { FaProjectDiagram, FaGithub } from "react-icons/fa"
import ResponsiveCardSkeletonGrid from "../../ResponsiveCardSkeletonGrid"

const filterOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
]

interface ProjectsPageProps {
  onTabChange: (page: string, tab: string | null) => void
  activeTab: string | null
}

const ProjectsPage = ({ onTabChange, activeTab }: ProjectsPageProps) => {
  const tabs = [
    { id: "projects", label: "Projects", tabValue: "projects", icon: <FaProjectDiagram /> },
    { id: "repos", label: "Repositories", tabValue: "repos", icon: <FaGithub /> },
  ]
  const activeId = activeTab ?? "projects"
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
    const rafId = requestAnimationFrame(() => setLoading(false))

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowFilterMenu(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    
    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const scrollToCards = React.useCallback(() => {
    const target = document.getElementById("projects-cards")
    scrollElementIntoViewWithNavbarOffset(target)
  }, [])

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setTimedItem('projectsSortBy', value)
    setShowFilterMenu(false)
  }

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
    setShowTagsMenu(true)
    setTimeout(() => {
      scrollToCards()
    }, 50)
  }

  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>()
    projectsTimelineData.forEach(item => {
      item.tags?.forEach(tag => tagSet.add(tag))
      item.topics?.forEach(topic => tagSet.add(topic))
      if (item.language) tagSet.add(item.language)
    })
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
  }, [])

  const filteredTimelineProjects = projectsTimelineData.filter((project) => {
    const matchesSearch = !search || 
      project.name?.toLowerCase().includes(search.toLowerCase()) ||
      project.summary?.toLowerCase().includes(search.toLowerCase()) ||
      project.language?.toLowerCase().includes(search.toLowerCase()) ||
      project.topics?.some((topic) => topic.toLowerCase().includes(search.toLowerCase())) ||
      project.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    
    const matchesTag = !selectedTag || selectedTag === "Computer Science" ||
      project.tags?.includes(selectedTag) ||
      project.topics?.includes(selectedTag) ||
      project.language?.toLowerCase() === selectedTag.toLowerCase()

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

    return (
      <Timeline
        items={sortedProjects}
        type="project"
        onTagClick={handleTagClick}
        layout="horizontal"
        showLine={false}
      />
    )
  }

  return (
    <>
      <div id="projects-page-header" className="bg-[#222222] rounded-xl border border-[#333333] shadow-lg shadow-black/20 p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Projects
          </h2>
          <p className="mx-auto mb-4 max-w-2xl text-center text-sm text-gray-400">
            Featured builds and milestones from my project timeline.
          </p>
          <div className="flex justify-center mb-4">
            <PageTabs
              tabs={tabs}
              activeId={activeId}
              onChange={(tab) => onTabChange("projects", tab)}
            />
          </div>

          <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-4 shadow-lg shadow-black/20">
            <div className="container mx-auto">
              <SearchFilterBar
                search={search}
                setSearch={setSearch}
                placeholder="Search by name, description, or tags..."
                tags={allTags}
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
                onFilterInteraction={scrollToCards}
              />

              <div className="text-sm text-gray-400 mt-2">
                Showing {sortedProjects.length} Project{sortedProjects.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="projects-cards"
        className="text-white"
        style={{ scrollMarginTop: "calc(var(--navbar-height, 6rem) + 1rem)" }}
      >
        {loading ? (
          <ResponsiveCardSkeletonGrid
            renderCard={(i) => (
              <div
                key={i}
                className="bg-[#151515] border border-[#333333] p-6 rounded-none animate-pulse min-h-[14rem]"
              >
                <div className="h-6 bg-[#333333] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[#333333] rounded w-1/2 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-[#333333] rounded w-full" />
                  <div className="h-3 bg-[#333333] rounded w-5/6" />
                  <div className="h-3 bg-[#333333] rounded w-4/6" />
                </div>
              </div>
            )}
          />
        ) : (
          <div key={`projects-loaded-${activeId}`} className="animate-skeleton-pop">
            {renderTimeline()}
          </div>
        )}
      </div>
    </>
  )
}

export default ProjectsPage
