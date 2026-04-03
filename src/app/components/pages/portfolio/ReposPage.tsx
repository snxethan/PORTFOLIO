"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { FaProjectDiagram, FaGithub as FaGithubIcon } from "react-icons/fa"
import { FaExternalLinkAlt, FaYoutube, FaLock } from "react-icons/fa"
import { useExternalLink } from "../../ExternalLinkHandler"
import TooltipWrapper from "../../ToolTipWrapper"

import { manualProjects } from "../../../data/portfolioProjects"
import SearchFilterBar from "../../SearchFilterBar"
import { getTimedItem, setTimedItem, removeTimedItem } from "../../../utils/timedStorage"
import { scrollElementIntoViewWithNavbarOffset } from "../../../utils/scrollWithNavbarOffset"
import PageTabs from "../../PageTabs"
import ResponsiveCardSkeletonGrid from "../../ResponsiveCardSkeletonGrid"

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
}

const filterOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
]

const getCTAIcon = (icon?: string) => {
  switch (icon) {
    case "github": return <FaGithubIcon className="w-5 h-5" />
    case "external": return <FaExternalLinkAlt className="w-5 h-5" />
    case "youtube": return <FaYoutube className="w-5 h-5" />
    case "private": return <FaLock className="w-5 h-5" />
    default: return <FaGithubIcon className="w-5 h-5" />
  }
}

const repoBadgeBaseClass = "text-xs font-semibold px-2 py-1 rounded-none cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 hover:border-red-600"

interface ReposPageProps {
  onTabChange: (page: string, tab: string | null) => void
  activeTab: string | null
}

const ReposPage = ({ onTabChange, activeTab }: ReposPageProps) => {
  const tabs = [
    { id: "projects", label: "Projects", tabValue: "projects", icon: <FaProjectDiagram /> },
    { id: "repos", label: "Repositories", tabValue: "repos", icon: <FaGithubIcon /> },
  ]
  const activeId = activeTab ?? "repos"
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState(() => {
    if (typeof window !== 'undefined') {
      return getTimedItem<string>('reposSearch') || ""
    }
    return ""
  })
  const [sortBy, setSortBy] = useState(() => {
    if (typeof window !== 'undefined') {
      return getTimedItem<string>('reposSortBy') || "newest"
    }
    return "newest"
  })
  const [selectedTag, setSelectedTag] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = getTimedItem<string>('reposSelectedTag')
      return saved !== null ? saved : "Computer Science"
    }
    return "Computer Science"
  })
  const [showTagsMenu, setShowTagsMenu] = useState(false)
  const [tags, setTags] = useState<string[]>(["Computer Science"])
  const [loading, setLoading] = useState(true)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const { handleExternalClick } = useExternalLink()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimedItem('reposSearch', search)
    }
  }, [search])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimedItem('reposSortBy', sortBy)
    }
  }, [sortBy])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedTag !== null) {
        setTimedItem('reposSelectedTag', selectedTag)
      } else {
        removeTimedItem('reposSelectedTag')
      }
    }
  }, [selectedTag])

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
          throw new Error("GitHub API did not return valid JSON")
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
          ctaLabel: isPortfoliyouProject ? "View my Capstone" : "View Repository",
          ctaIcon: isPortfoliyouProject ? "external" : "github",
        }
      })
      const allProjects = [...githubProjects, ...manualProjects]
      setProjects(allProjects)
      extractTags(allProjects)
    }

    const extractTags = (allProjects: Project[]) => {
      const uniqueTags = new Set<string>(["Computer Science"])
      allProjects.forEach((project) => {
        const projectTags = new Set<string>()
        if (project.language) projectTags.add(project.language.toLowerCase())
        if (project.source) projectTags.add(project.source.toLowerCase())
        project.topics?.forEach((tag) => projectTags.add(tag.toLowerCase()))
        projectTags.forEach((tag) => uniqueTags.add(tag))
      })
      setTags(Array.from(uniqueTags))
    }

    fetchProjects()
  }, [])

  const scrollToCards = useCallback(() => {
    const target = document.getElementById("repositories-cards")
    scrollElementIntoViewWithNavbarOffset(target)
  }, [])
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowFilterMenu(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])
  
  const handleFilterChange = (value: string) => {
    setSortBy(value)
    setShowFilterMenu(false)
  }

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
    setShowTagsMenu(true)
    setTimeout(() => {
      scrollToCards()
    }, 50)
  }

  const handleRepoBadgeClick = (tag: string) => {
    handleTagClick(tag.toLowerCase())
  }

  const handleCardClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current
    if (!container) return

    const target = event.target as HTMLElement | null
    if (target?.closest("a, button, input, select, textarea, [role='button'], [data-skip-card-scroll='true']")) {
      return
    }

    const card = event.currentTarget
    const cardRect = card.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const isClippedLeft = cardRect.left < containerRect.left + 8
    const isClippedRight = cardRect.right > containerRect.right - 8

    if (isClippedLeft || isClippedRight) {
      card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }, [])

  const filteredProjects = projects.filter((project) => {
    const nameMatch = project.name.toLowerCase().includes(search.toLowerCase())
    const descMatch = project.description?.toLowerCase().includes(search.toLowerCase()) ?? false
    const tagMatch = project.topics?.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ?? false
    const sourceMatch = project.source?.toLowerCase().includes(search.toLowerCase()) ?? false
    return nameMatch || descMatch || tagMatch || sourceMatch
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
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

  const sortedTags = React.useMemo(() =>
    tags.slice().sort((a, b) => a.localeCompare(b)),
  [tags])

  const tagFilteredProjects =
    selectedTag === null || selectedTag === "Computer Science"
      ? sortedProjects
      : sortedProjects.filter(
          (project) =>
            project.topics.includes(selectedTag) ||
            project.language?.toLowerCase() === selectedTag ||
            project.source?.toLowerCase() === selectedTag
        )

  const resultsCount = `Showing ${tagFilteredProjects.length} Repositor${tagFilteredProjects.length !== 1 ? "ies" : "y"}`

  return (
    <>
      <div id="repos-page-header" className="bg-[#222222] rounded-xl border border-[#333333] shadow-lg shadow-black/20 p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Projects
          </h2>
          <p className="mx-auto mb-4 max-w-2xl text-center text-sm text-gray-400">
            Search through my GitHub repositories and shipped work.
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
                defaultSort="newest"
                onFilterInteraction={scrollToCards}
              />

              {resultsCount && (
                <div className="text-sm text-gray-400 mt-2">{resultsCount}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div
        id="repositories-cards"
        className="text-white"
        style={{ scrollMarginTop: "calc(var(--navbar-height, 6rem) + 1rem)" }}
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
              <div
                ref={scrollContainerRef}
                className="scroll-edge-fade w-full max-w-full overflow-x-auto overflow-y-visible overscroll-x-contain py-4 snap-x snap-mandatory"
              >
                <div className="relative flex w-full min-w-full flex-nowrap items-stretch gap-6 px-4 pr-16 py-4 lg:px-6 lg:pr-20">
                  {tagFilteredProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={handleCardClick}
                      className="group relative z-0 hover:z-10 bg-[#151515] hover:bg-[#252525] rounded-none border border-[#333333] hover:border-red-600/50 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-red-600/30 flex flex-col shrink-0 snap-center min-w-[260px] w-[calc(100%-2rem)] sm:w-[calc((100%-3.5rem)/2)] lg:w-[calc((100%-6rem)/3)]"
                    >
                       <div className="p-6 flex-grow">
                         <div className="mb-2">
                           <h3 className="text-xl font-semibold text-white group-hover:text-[#dc2626] transition-colors duration-300 mb-1 truncate">
                             {project.name}
                           </h3>
                           <div className="flex flex-wrap items-center gap-2">
                             {project.source === "manual" && (
                               <span
                                 onClick={() => handleRepoBadgeClick("manual")}
                                  data-skip-card-scroll="true"
                                 className={`${repoBadgeBaseClass} bg-green-600 text-white border border-green-500`}
                               >
                                 MANUAL
                               </span>
                             )}
                             {project.source === "github" && (
                               <span
                                 onClick={() => handleRepoBadgeClick("github")}
                                  data-skip-card-scroll="true"
                                 className={`${repoBadgeBaseClass} bg-purple-600 text-white border border-purple-500`}
                               >
                                 GITHUB
                               </span>
                             )}
                             {project.topics.includes("neumont") && (
                               <span
                                 onClick={() => handleRepoBadgeClick("neumont")}
                                  data-skip-card-scroll="true"
                                 className={`${repoBadgeBaseClass} bg-yellow-600 text-white border border-yellow-500`}
                               >
                                 NEU
                               </span>
                             )}
                           </div>
                         </div>
                         <p className="text-gray-300 mb-2 break-words whitespace-normal">{project.description}</p>
                         <p className="text-sm text-gray-400 mb-1">
                           <span className="font-bold">Created On:</span>{" "}
                           {new Date(project.created_at).toLocaleDateString("en-US", {
                             year: "numeric",
                             month: "short",
                             day: "numeric",
                           })}
                         </p>
                         <p className="text-sm text-gray-400 mb-2">
                           <span className="font-bold">Last Updated:</span>{" "}
                           {new Date(project.updated_at).toLocaleDateString("en-US", {
                             year: "numeric",
                             month: "short",
                             day: "numeric",
                           })}
                         </p>
                         <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3">
                           {[...new Set([...project.topics, project.language].filter(Boolean).map((t) => t.toLowerCase()))].map((tag) => (
                             <span
                               key={tag}
                               onClick={() => handleTagClick(tag)}
                                data-skip-card-scroll="true"
                               className="bg-[#3a3a3a] text-gray-300 text-xs px-3 py-1 rounded-full whitespace-nowrap max-w-full min-w-0 truncate transition-all duration-200 border border-transparent hover:bg-[#444444] hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 hover:border-red-600 hover:text-[#dc2626] cursor-pointer active:scale-95"
                             >
                               {tag.toUpperCase()}
                             </span>
                           ))}
                         </div>
                       </div>
                       <div className="px-6 py-4 border-t border-[#333333] bg-[#151515]">
                         <TooltipWrapper label={project.html_url} fullWidth>
                           <button
                             onClick={() => handleExternalClick(project.html_url, true)}
                              data-skip-card-scroll="true"
                             className="flex items-center justify-center gap-2 w-full p-3 min-h-[48px] bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95 text-sm sm:text-base"
                           >
                             {getCTAIcon(project.ctaIcon ?? (project.source === "github" ? "github" : undefined))}
                             <span className="flex-1 break-words text-center leading-tight">
                               {project.name.toLowerCase() === "portfolio"
                                 ? "View Repository (This site!)"
                                 : project.ctaLabel ?? "View Repository"}
                             </span>
                           </button>
                         </TooltipWrapper>
                       </div>
                     </div>
                   ))}
                </div>
              </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ReposPage
