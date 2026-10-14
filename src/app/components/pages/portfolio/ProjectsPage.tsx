"use client"

import React, { useEffect, useMemo, useState } from "react"
import { projectsTimelineData, getProjectSlug } from "../../../data/projectsTimelineData"
import SearchFilterBar from "../../SearchFilterBar"
import SectionHeader from "../../SectionHeader"
import CardCollection from "../../CardCollection"
import DetailCard from "../../detail/DetailCard"
import { scrollElementIntoViewWithNavbarOffset, scrollToSectionFilters } from "../../../utils/scrollWithNavbarOffset"
import { FaProjectDiagram, FaGithub } from "react-icons/fa"
import ResponsiveCardSkeletonGrid from "../../ResponsiveCardSkeletonGrid"
import { DATE_AND_NAME_SORT_OPTIONS } from "../../../utils/sortOptions"
import { matchesSelectedTags } from "../../../utils/tagFilter"
import { useSectionFilters } from "../../../hooks/useSectionFilters"
import { useSectionView } from "../../../hooks/useSectionView"

const DEFAULT_SORT = "newest"
// Every project is a computer-science project, so this tag matches them all.
const WILDCARD_TAG = "Computer Science"
const DEFAULT_TAGS = [WILDCARD_TAG]

const tabs = [
  { id: "projects", label: "Projects", tabValue: "projects", icon: <FaProjectDiagram /> },
  { id: "repos", label: "Repositories", tabValue: "repos", icon: <FaGithub /> },
]

interface ProjectsPageProps {
  onTabChange: (page: string, tab: string | null) => void
  activeTab: string | null
  /** Opens a project's detail popup (HomeClient owns it and the URL). */
  onOpenProject: (slug: string) => void
  /** Project card to outline briefly (after jumping here from a related link). */
  highlightedSlug?: string | null
}

const ProjectsPage = ({ onTabChange, activeTab, onOpenProject, highlightedSlug = null }: ProjectsPageProps) => {
  const activeId = activeTab ?? "projects"
  const filters = useSectionFilters("projects", { sort: DEFAULT_SORT, tags: DEFAULT_TAGS })
  const { viewMode, setViewMode, autoScroll, setAutoScroll } = useSectionView("projects", projectsTimelineData.length)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const rafId = requestAnimationFrame(() => setLoading(false))
    return () => cancelAnimationFrame(rafId)
  }, [])

  const scrollToCards = React.useCallback(() => {
    scrollElementIntoViewWithNavbarOffset(document.getElementById("projects-cards"))
  }, [])

  // A tag on a card: filter by it, stop auto-scroll, and bring the filter
  // panel into view so the visitor sees what changed.
  const handleCardTagClick = (tag: string) => {
    filters.focusTag(tag)
    setAutoScroll(false)
    scrollToSectionFilters("projects-page-header")
  }

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    projectsTimelineData.forEach((item) => {
      item.tags?.forEach((tag) => tagSet.add(tag))
      item.topics?.forEach((topic) => tagSet.add(topic))
      if (item.language) tagSet.add(item.language)
    })
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
  }, [])

  const { search, sortBy, selectedTags, tagMatchMode } = filters
  const sortedProjects = useMemo(() => {
    const query = search.toLowerCase()
    const filtered = projectsTimelineData.filter((project) => {
      const matchesSearch = !query ||
        project.name?.toLowerCase().includes(query) ||
        project.summary?.toLowerCase().includes(query) ||
        project.language?.toLowerCase().includes(query) ||
        project.topics?.some((topic) => topic.toLowerCase().includes(query)) ||
        project.tags?.some((tag) => tag.toLowerCase().includes(query))

      const matchesTags = matchesSelectedTags(selectedTags, tagMatchMode, (tag) =>
        tag === WILDCARD_TAG ||
        Boolean(project.tags?.includes(tag)) ||
        Boolean(project.topics?.includes(tag)) ||
        project.language?.toLowerCase() === tag.toLowerCase()
      )

      return matchesSearch && matchesTags
    })

    return filtered.sort((a, b) => {
      if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "")
      if (sortBy === "name-desc") return (b.name || "").localeCompare(a.name || "")
      if (sortBy === "oldest") return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })
  }, [search, selectedTags, sortBy, tagMatchMode])

  return (
    <>
      <SectionHeader
        id="projects-page-header"
        title="Projects"
        description="Featured builds and milestones. Open a project for the why and the how."
        tabs={tabs}
        activeTabId={activeId}
        onTabChange={(tab) => onTabChange("projects", tab)}
        resultsText={`Showing ${sortedProjects.length} Project${sortedProjects.length !== 1 ? "s" : ""}`}
      >
        <SearchFilterBar
          search={filters.search}
          setSearch={filters.setSearch}
          placeholder="Search by name, description, or tags..."
          tags={allTags}
          selectedTags={filters.selectedTags}
          setSelectedTags={filters.setSelectedTags}
          tagMatchMode={filters.tagMatchMode}
          setTagMatchMode={filters.setTagMatchMode}
          sortOptions={DATE_AND_NAME_SORT_OPTIONS}
          selectedSort={filters.sortBy}
          setSelectedSort={filters.setSortBy}
          showTagsMenu={filters.showTagsMenu}
          setShowTagsMenu={filters.setShowTagsMenu}
          showFilterMenu={filters.showFilterMenu}
          setShowFilterMenu={filters.setShowFilterMenu}
          defaultSort={DEFAULT_SORT}
          onFilterInteraction={scrollToCards}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          autoScroll={autoScroll}
          onAutoScrollChange={setAutoScroll}
        />
      </SectionHeader>

      <div
        id="projects-cards"
        className="text-white"
        style={{ scrollMarginTop: "calc(var(--navbar-height, 0px) + 1rem)" }}
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
            <CardCollection
              items={sortedProjects}
              getKey={getProjectSlug}
              viewMode={viewMode}
              autoScroll={autoScroll}
              size="standard"
              label="Projects"
              renderCard={(project) => {
                const slug = getProjectSlug(project)
                return (
                  <DetailCard
                    item={project}
                    id={`project-card-${slug}`}
                    onOpen={() => onOpenProject(slug)}
                    onTagClick={handleCardTagClick}
                    highlighted={highlightedSlug === slug}
                  />
                )
              }}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default ProjectsPage
