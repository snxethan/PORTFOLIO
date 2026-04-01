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
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return
    // Disable pointer events on cards during scroll so hover state is cleared
    container.style.pointerEvents = "none"
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    scrollTimerRef.current = setTimeout(() => {
      container.style.pointerEvents = ""
    }, 80)
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
      <div
        id="repos-page-header"
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
          <span style={{ fontSize: "11px" }}>📂 Projects — Repositories</span>
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
                <div style={{ fontSize: "10px", color: "#444444", marginTop: "4px" }}>{resultsCount}</div>
              )}
            </div>
          </div>
        </div>{/* end p-4 */}
      </div>{/* end win-window */}
      
      <div
        id="repositories-cards"
        style={{ scrollMarginTop: "calc(var(--navbar-height, 6rem) + 1rem)" }}
      >
        <div className="transition-opacity duration-150 opacity-100 animate-fade-in-up">
          {loading ? (
            <ResponsiveCardSkeletonGrid
              renderCard={(i) => (
                <div key={i} className="animate-pulse flex flex-col gap-3 p-3 min-h-[200px]" style={{
                  background: "#d4d0c8",
                  borderTop: "1px solid #808080", borderLeft: "1px solid #808080",
                  borderRight: "1px solid #fff", borderBottom: "1px solid #fff",
                }}>
                  <div style={{ height: 12, background: "#c0bdb4", width: "75%" }} />
                  <div style={{ height: 10, background: "#c0bdb4", width: "66%" }} />
                  <div style={{ height: 10, background: "#c0bdb4", width: "83%" }} />
                  <div className="flex-1" />
                  <div style={{ height: 24, background: "#c0bdb4", width: "100%" }} />
                </div>
              )}
            />
          ) : (
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="w-full max-w-full overflow-x-auto overflow-y-visible overscroll-x-contain snap-x snap-proximity"
            >
              <div className="flex w-full min-w-full items-stretch gap-6 px-3 py-4">
                {tagFilteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group flex flex-col shrink-0 snap-start min-w-[260px] w-[calc(100%-1.5rem)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] 2xl:w-[calc((100%-4.5rem)/4)]"
                      style={{
                        background: "#d4d0c8",
                        borderTop: "1px solid #ffffff",
                        borderLeft: "1px solid #ffffff",
                        borderRight: "1px solid #404040",
                        borderBottom: "1px solid #404040",
                        fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
                      }}
                    >
                      {/* Win2K title bar */}
                      <div className="win-titlebar" style={{ fontSize: "11px" }}>
                        <span className="truncate">{project.name}</span>
                      </div>

                       <div className="p-3 flex-grow">
                         <div className="mb-2">
                           <h3 style={{ fontSize: "12px", fontWeight: "bold", color: "#000080", marginBottom: "4px" }} className="truncate">
                             {project.name}
                           </h3>
                           <div className="flex flex-wrap items-center gap-1">
                             {project.source === "manual" && (
                               <span
                                 onClick={() => handleRepoBadgeClick("manual")}
                                 style={{ fontSize: "9px", padding: "1px 5px", background: "#008000", color: "#ffffff", cursor: "pointer" }}
                               >
                                 MANUAL
                               </span>
                             )}
                             {project.source === "github" && (
                               <span
                                 onClick={() => handleRepoBadgeClick("github")}
                                 style={{ fontSize: "9px", padding: "1px 5px", background: "#800080", color: "#ffffff", cursor: "pointer" }}
                               >
                                 GITHUB
                               </span>
                             )}
                             {project.topics.includes("neumont") && (
                               <span
                                 onClick={() => handleRepoBadgeClick("neumont")}
                                 style={{ fontSize: "9px", padding: "1px 5px", background: "#808000", color: "#ffffff", cursor: "pointer" }}
                               >
                                 NEU
                               </span>
                             )}
                           </div>
                         </div>
                         <p className="mb-2 break-words whitespace-normal" style={{ fontSize: "11px", color: "#000000" }}>{project.description}</p>
                         <p style={{ fontSize: "10px", color: "#444444", marginBottom: "2px" }}>
                           <span style={{ fontWeight: "bold" }}>Created:</span>{" "}
                           {new Date(project.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                         </p>
                         <p style={{ fontSize: "10px", color: "#444444", marginBottom: "6px" }}>
                           <span style={{ fontWeight: "bold" }}>Updated:</span>{" "}
                           {new Date(project.updated_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                         </p>
                         <div className="flex flex-wrap gap-1 mt-2">
                           {[...new Set([...project.topics, project.language].filter(Boolean).map((t) => t.toLowerCase()))].map((tag) => (
                             <span
                               key={tag}
                               onClick={() => handleTagClick(tag)}
                               style={{
                                 fontSize: "9px",
                                 padding: "1px 5px",
                                 background: "#c0bdb4",
                                 color: "#000000",
                                 borderTop: "1px solid #808080",
                                 borderLeft: "1px solid #808080",
                                 borderRight: "1px solid #ffffff",
                                 borderBottom: "1px solid #ffffff",
                                 cursor: "pointer",
                                 whiteSpace: "nowrap",
                               }}
                             >
                               {tag.toUpperCase()}
                             </span>
                           ))}
                         </div>
                       </div>
                       <div style={{
                         padding: "6px 8px",
                         borderTop: "1px solid #808080",
                         background: "#c8c5bc",
                       }}>
                         <TooltipWrapper label={project.html_url} fullWidth>
                           <button
                             onClick={() => handleExternalClick(project.html_url, true)}
                             className="win-btn flex items-center justify-center gap-2 w-full"
                             style={{ fontSize: "11px", padding: "4px 8px" }}
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
          )}
        </div>
      </div>
    </>
  )
}

export default ReposPage
