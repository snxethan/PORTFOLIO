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
        <div className="text-center py-8" style={{ fontSize: "11px", color: "#444444", fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif' }}>
          <p>No items match your current filters.</p>
        </div>
      )
    }

    if (loading) {
      return (
        <ResponsiveCardSkeletonGrid
          renderCard={(i) => (
            <div key={i} className="animate-pulse p-4 min-h-[180px]" style={{
              background: "#d4d0c8",
              borderTop: "1px solid #808080", borderLeft: "1px solid #808080",
              borderRight: "1px solid #fff", borderBottom: "1px solid #fff",
            }}>
              <div style={{ height: 14, background: "#c0bdb4", width: "75%", marginBottom: 8 }} />
              <div style={{ height: 11, background: "#c0bdb4", width: "50%", marginBottom: 8 }} />
              <div className="space-y-2">
                <div style={{ height: 10, background: "#c0bdb4" }} />
                <div style={{ height: 10, background: "#c0bdb4", width: "83%" }} />
              </div>
            </div>
          )}
        />
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
      <div
        id="projects-page-header"
        className="mb-6"
        style={{
          background: "#d4d0c8",
          borderTop: "2px solid #ffffff",
          borderLeft: "2px solid #ffffff",
          borderRight: "2px solid #404040",
          borderBottom: "2px solid #404040",
          fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
        }}
      >
        <div className="win-titlebar">
          <span style={{ fontSize: "11px" }}>📁 Projects</span>
        </div>
        <div className="p-4 mb-2">
          <div style={{ fontSize: "14px", fontWeight: "bold", color: "#000080", textAlign: "center", marginBottom: "8px" }}>
            Projects
          </div>
          <div className="flex justify-center mb-3">
            <PageTabs
              tabs={tabs}
              activeId={activeId}
              onChange={(tab) => onTabChange("projects", tab)}
            />
          </div>

          <div style={{
            background: "#ffffff",
            borderTop: "1px solid #808080",
            borderLeft: "1px solid #808080",
            borderRight: "1px solid #ffffff",
            borderBottom: "1px solid #ffffff",
            padding: "6px 8px",
          }}>
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

              <div style={{ fontSize: "10px", color: "#444444", marginTop: "4px" }}>
                Showing {sortedProjects.length} Project{sortedProjects.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>{/* end p-4 */}
      </div>{/* end win-window */}

      <div
        id="projects-cards"
        style={{ scrollMarginTop: "calc(var(--navbar-height, 6rem) + 1rem)" }}
      >
        <div className="transition-opacity duration-150 opacity-100 animate-fade-in-up">
          {renderTimeline()}
        </div>
      </div>
    </>
  )
}

export default ProjectsPage
