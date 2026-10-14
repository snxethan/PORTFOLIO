"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { FaProjectDiagram, FaGithub as FaGithubIcon, FaArchive } from "react-icons/fa"
import { FaExternalLinkAlt, FaYoutube, FaLock } from "react-icons/fa"
import { useExternalLink } from "../../ExternalLinkHandler"
import TooltipWrapper from "../../ToolTipWrapper"

import { manualProjects } from "@/app/data/portfolioProjects"
import SearchFilterBar from "../../SearchFilterBar"
import SectionHeader from "../../SectionHeader"
import GitHubContributionChart from "../../GitHubContributionChart"
import CardCollection from "../../CardCollection"
import { scrollElementIntoViewWithNavbarOffset, scrollToSectionFilters } from "@/app/utils/scrollWithNavbarOffset"
import ResponsiveCardSkeletonGrid from "../../ResponsiveCardSkeletonGrid"
import { DATE_AND_NAME_SORT_OPTIONS } from "@/app/utils/sortOptions"
import { matchesSelectedTags } from "@/app/utils/tagFilter"
import { useSectionFilters } from "@/app/hooks/useSectionFilters"
import { useSectionView } from "@/app/hooks/useSectionView"

interface Project {
  id: number
  name: string
  description: string
  html_url: string
  language: string
  topics: string[]
  created_at: string
  updated_at: string
  source: "github" | "manual"
  ctaLabel?: string
  ctaIcon?: "github" | "external" | "youtube" | "private" | undefined
  stargazers_count?: number
  archived?: boolean
}

interface GitHubApiProject {
  id: number
  name: string
  description: string
  html_url: string
  language: string
  topics: string[]
  created_at: string
  updated_at: string
  stargazers_count?: number
  archived?: boolean
}

const getCTAIcon = (icon?: string) => {
  switch (icon) {
    case "github": return <FaGithubIcon className="w-5 h-5" />
    case "external": return <FaExternalLinkAlt className="w-5 h-5" />
    case "youtube": return <FaYoutube className="w-5 h-5" />
    case "private": return <FaLock className="w-5 h-5" />
    default: return <FaGithubIcon className="w-5 h-5" />
  }
}

/**
 * Repo name with ellipsis truncation. Only wraps in a tooltip when the text
 * actually overflows, so short names don't sprout a redundant popup.
 */
const RepoTitle = ({ name }: { name: string }) => {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    const el = headingRef.current
    if (!el) return

    // 1px slack keeps sub-pixel text metrics from reporting a false overflow.
    const check = () => setIsTruncated(el.scrollWidth > el.clientWidth + 1)

    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    return () => observer.disconnect()
  }, [name])

  const heading = (
    <h3
      ref={headingRef}
      className="text-xl font-semibold text-white group-hover:text-[#dc2626] transition-colors duration-300 mb-1 truncate"
    >
      {name}
    </h3>
  )

  if (!isTruncated) return heading

  return (
    <TooltipWrapper label={name} fullWidth>
      {heading}
    </TooltipWrapper>
  )
}

const repoBadgeBaseClass =
  "text-xs font-semibold px-2 py-1 rounded-none cursor-pointer transition-[scale,transform,box-shadow] duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
const DEFAULT_SORT = "newest"
// Every repository is a computer-science repository, so this tag matches them all.
const WILDCARD_TAG = "Computer Science"
const DEFAULT_TAGS = [WILDCARD_TAG]
const ARCHIVED_TAG = "archived"

const tabs = [
  { id: "projects", label: "Projects", tabValue: "projects", icon: <FaProjectDiagram /> },
  { id: "repos", label: "Repositories", tabValue: "repos", icon: <FaGithubIcon /> },
]

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

interface ReposPageProps {
  onTabChange: (page: string, tab: string | null) => void
  activeTab: string | null
}

const ReposPage = ({ onTabChange, activeTab }: ReposPageProps) => {
  const activeId = activeTab ?? "repos"
  const [projects, setProjects] = useState<Project[]>([])
  const [tags, setTags] = useState<string[]>([WILDCARD_TAG])
  const [loading, setLoading] = useState(true)
  const filters = useSectionFilters("repos", { sort: DEFAULT_SORT, tags: DEFAULT_TAGS })
  const { viewMode, setViewMode, autoScroll, setAutoScroll } = useSectionView("repos", projects.length)
  const { handleExternalClick } = useExternalLink()

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      const CACHE_KEY = "githubProjectsCache"
      const EXPIRY_KEY = "githubProjectsExpiry"
      const now = Date.now()
      const expiry = parseInt(localStorage.getItem(EXPIRY_KEY) || "0")
      const cache = localStorage.getItem(CACHE_KEY)
      let hasValidCache = false

      if (cache && now < expiry) {
        try {
          const data = JSON.parse(cache)
          processProjects(data)
          hasValidCache = true
          setLoading(false)
        } catch {
          localStorage.removeItem(CACHE_KEY)
          localStorage.removeItem(EXPIRY_KEY)
          processProjects([])
          setLoading(false)
        }
      }

      try {
        const response = await fetch("https://api.github.com/users/snxethan/repos?sort=created&direction=asc")
        const contentType = response.headers.get("content-type")
        if (!response.ok || !contentType?.includes("application/json")) {
          const errorText = await response.text()
          console.error("Non-JSON GitHub response:", errorText.slice(0, 200))
          if (!hasValidCache) {
            processProjects([])
          }
          return
        }
        const data = await response.json()
        localStorage.setItem(CACHE_KEY, JSON.stringify(data))
        localStorage.setItem(EXPIRY_KEY, (now + 1000 * 60 * 5).toString())
        processProjects(data)
      } catch {
        if (!hasValidCache) {
          processProjects([])
        }
      } finally {
        setLoading(false)
      }
    }

    const processProjects = (data: GitHubApiProject[]) => {
      const githubProjects: Project[] = data.map((project: GitHubApiProject) => {
        const isPortfoliyouProject = project.name.toLowerCase().includes('portfoliyou')

        return {
          id: project.id,
          name: project.name,
          description: project.description,
          html_url: isPortfoliyouProject ? "https://portfoliyou.snxethan.dev" : project.html_url,
          language: project.language,
          topics: project.topics || [],
          created_at: project.created_at,
          updated_at: project.updated_at,
          source: "github",
          stargazers_count: project.stargazers_count,
          archived: Boolean(project.archived),
          ctaLabel: isPortfoliyouProject ? "View my Capstone" : "View Repository",
          ctaIcon: isPortfoliyouProject ? "external" : "github",
        }
      })
      const allProjects = [...githubProjects, ...manualProjects]
      setProjects(allProjects)
      extractTags(allProjects)
    }

    const extractTags = (allProjects: Project[]) => {
      const uniqueTags = new Set<string>([WILDCARD_TAG])
      allProjects.forEach((project) => {
        if (project.language) uniqueTags.add(project.language.toLowerCase())
        if (project.source) uniqueTags.add(project.source.toLowerCase())
        if (project.archived) uniqueTags.add(ARCHIVED_TAG)
        project.topics?.forEach((tag) => uniqueTags.add(tag.toLowerCase()))
      })
      setTags(Array.from(uniqueTags))
    }

    fetchProjects()
  }, [])

  const scrollToCards = useCallback(() => {
    scrollElementIntoViewWithNavbarOffset(document.getElementById("repositories-cards"))
  }, [])

  // A tag on a card: filter by it, stop auto-scroll, and bring the filter
  // panel into view so the visitor sees what changed.
  const handleTagClick = (tag: string) => {
    filters.focusTag(tag.toLowerCase())
    setAutoScroll(false)
    scrollToSectionFilters("repos-page-header")
  }

  const { search, sortBy, selectedTags, tagMatchMode } = filters
  const visibleProjects = useMemo(() => {
    const query = search.toLowerCase()
    const filtered = projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(query) ||
        (project.description?.toLowerCase().includes(query) ?? false) ||
        (project.topics?.some((tag) => tag.toLowerCase().includes(query)) ?? false) ||
        (project.source?.toLowerCase().includes(query) ?? false)

      const matchesTags = matchesSelectedTags(selectedTags, tagMatchMode, (tag) =>
        tag === WILDCARD_TAG ||
        project.topics.includes(tag) ||
        project.language?.toLowerCase() === tag ||
        project.source?.toLowerCase() === tag ||
        (tag === ARCHIVED_TAG && Boolean(project.archived))
      )

      return matchesSearch && matchesTags
    })

    return filtered.sort((a, b) => {
      const aDate = new Date(a.created_at).getTime()
      const bDate = new Date(b.created_at).getTime()
      switch (sortBy) {
        case "name-asc": return a.name.localeCompare(b.name)
        case "name-desc": return b.name.localeCompare(a.name)
        case "oldest": return aDate - bDate
        case "newest": return bDate - aDate
        default: return 0
      }
    })
  }, [projects, search, selectedTags, sortBy, tagMatchMode])

  const sortedTags = useMemo(() => tags.slice().sort((a, b) => a.localeCompare(b)), [tags])

  const renderRepoCard = (project: Project) => {
    const ctaLabel = project.archived
      ? "This Repository is Archived"
      : project.name.toLowerCase() === "portfolio"
        ? "View Repository (This site!)"
        : project.ctaLabel ?? "View Repository"

    return (
      <div className="group relative flex h-full w-full flex-col bg-[#151515] hover:bg-[#1c1c1c] rounded-none border border-[#333333] hover:border-red-600/50 transition-[scale,transform,background-color,border-color,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-600/25">
        <div className="p-6 flex-grow">
          <div className="mb-2">
            <RepoTitle name={project.name} />
            <div className="flex flex-wrap items-center gap-2">
              {project.source === "manual" && (
                <button type="button" onClick={() => handleTagClick("manual")} className={`${repoBadgeBaseClass} bg-green-600 text-white border border-green-500`}>
                  MANUAL
                </button>
              )}
              {project.source === "github" && (
                <button type="button" onClick={() => handleTagClick("github")} className={`${repoBadgeBaseClass} bg-purple-600 text-white border border-purple-500`}>
                  GITHUB
                </button>
              )}
              {project.topics.includes("neumont") && (
                <button type="button" onClick={() => handleTagClick("neumont")} className={`${repoBadgeBaseClass} bg-yellow-600 text-white border border-yellow-500`}>
                  NEU
                </button>
              )}
              {project.archived && (
                <button
                  type="button"
                  onClick={() => handleTagClick(ARCHIVED_TAG)}
                  className={`${repoBadgeBaseClass} inline-flex items-center gap-1 bg-gray-600 text-white border border-gray-500`}
                >
                  <FaArchive className="h-3 w-3" aria-hidden="true" />
                  ARCHIVED
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-300 mb-2 break-words whitespace-normal">{project.description}</p>
          <p className="text-sm text-gray-400 mb-1">
            <span className="font-bold">Created On:</span> {formatDate(project.created_at)}
          </p>
          <p className="text-sm text-gray-400 mb-2">
            <span className="font-bold">Last Updated:</span> {formatDate(project.updated_at)}
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3">
            {[...new Set([...project.topics, project.language].filter(Boolean).map((t) => t.toLowerCase()))].map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="bg-[#3a3a3a] text-gray-300 text-xs px-3 py-1 rounded-full whitespace-nowrap max-w-full min-w-0 truncate transition-[scale,transform,color,background-color,border-color] duration-200 hover:scale-105 border border-transparent hover:bg-[#444444] hover:border-red-600 hover:text-[#dc2626] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                {tag.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#333333] bg-[#151515]">
          <TooltipWrapper label={project.html_url} fullWidth>
            <button
              type="button"
              onClick={() => handleExternalClick(project.html_url, true)}
              className={`flex items-center justify-center gap-2 w-full p-3 min-h-[48px] text-white rounded-lg transition-colors duration-200 text-sm sm:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                project.archived
                  ? "bg-gradient-to-r from-[#3a3a3a] to-[#333333] text-gray-200 hover:from-[#454545] hover:to-[#3d3d3d]"
                  : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"
              }`}
            >
              {project.archived
                ? <FaArchive className="w-5 h-5" />
                : getCTAIcon(project.ctaIcon ?? (project.source === "github" ? "github" : undefined))}
              <span className="flex-1 break-words text-center leading-tight">{ctaLabel}</span>
            </button>
          </TooltipWrapper>
        </div>
      </div>
    )
  }

  return (
    <>
      <SectionHeader
        id="repos-page-header"
        title="Projects"
        description={<GitHubContributionChart />}
        tabs={tabs}
        activeTabId={activeId}
        onTabChange={(tab) => onTabChange("projects", tab)}
        resultsText={`Showing ${visibleProjects.length} Repositor${visibleProjects.length !== 1 ? "ies" : "y"}`}
      >
        <SearchFilterBar
          search={filters.search}
          setSearch={filters.setSearch}
          placeholder="Search by name, description, or tags..."
          tags={sortedTags}
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
        id="repositories-cards"
        className="text-white"
        style={{ scrollMarginTop: "calc(var(--navbar-height, 0px) + 1rem)" }}
      >
        {loading ? (
          <ResponsiveCardSkeletonGrid
            renderCard={(i) => (
              <div
                key={i}
                className="bg-[#151515] border border-[#333333] p-6 rounded-none animate-pulse flex flex-col gap-4 min-h-[220px]"
              >
                <div className="h-6 bg-[#333333] rounded w-3/4" />
                <div className="h-4 bg-[#333333] rounded w-2/3" />
                <div className="h-4 bg-[#333333] rounded w-5/6" />
                <div className="flex-1" />
                <div className="h-10 bg-[#292929] rounded w-full" />
              </div>
            )}
          />
        ) : (
          <div key={`repos-loaded-${activeId}`} className="animate-skeleton-pop">
            <CardCollection
              items={visibleProjects}
              getKey={(project) => `${project.source}-${project.id}`}
              viewMode={viewMode}
              autoScroll={autoScroll}
              size="standard"
              label="Repositories"
              renderCard={renderRepoCard}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default ReposPage
