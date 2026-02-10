"use client"

import React from "react"
import { useState, useEffect } from "react"
import { FaGithub, FaExternalLinkAlt, FaYoutube, FaLock, FaChevronDown, FaChevronUp, FaCog } from "react-icons/fa"
import { useSearchParams, useRouter } from "next/navigation"
import { useExternalLink } from "../ExternalLinkHandler"
import TooltipWrapper from "../ToolTipWrapper"
import { manualProjects } from "../../data/portfolioProjects"
import Timeline from "../Timeline"
import SubsectionTabs from "../SubsectionTabs"
import { projectsTimelineData } from "../../data/projectsTimelineData"

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

const getCTAIcon = (icon?: string) => {
  switch (icon) {
    case "github": return <FaGithub className="w-5 h-5" />
    case "external": return <FaExternalLinkAlt className="w-5 h-5" />
    case "youtube": return <FaYoutube className="w-5 h-5" />
    case "private": return <FaLock className="w-5 h-5" />
    default: return <FaGithub className="w-5 h-5" />
  }
}


const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showAllTags, setShowAllTags] = useState(false);
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isFocused, setIsFocused] = useState(false)
  const { handleExternalClick } = useExternalLink()
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [isExtending, setIsExtending] = useState(false)
  const [isHiding, setIsHiding] = useState(false)
  const [activeSubsection, setActiveSubsection] = useState("projects")
  const [isAnimating, setIsAnimating] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleShowAllTagsToggle = () => {
    if (showAllTags) {
      // Hiding tags
      setIsHiding(true)
      setTimeout(() => {
        setShowAllTags(false)
        setIsHiding(false)
      }, 200) // Match the tag-hide animation duration
    } else {
      // Showing tags
      setShowAllTags(true)
      setIsExtending(true)
      setTimeout(() => {
        setIsExtending(false)
      }, 300) // Match the tag-extend animation duration
    }
  }

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      const CACHE_KEY = "githubProjectsCache"
      const EXPIRY_KEY = "githubProjectsExpiry"
      const now = Date.now()
      const expiry = parseInt(localStorage.getItem(EXPIRY_KEY) || "0")
      const cache = localStorage.getItem(CACHE_KEY)

    if (cache && now < expiry) {
      try {
        const data = JSON.parse(cache)
        processProjects(data)
      } catch {
        // Cache corrupted, clear it and fallback to manual projects
        localStorage.removeItem(CACHE_KEY)
        localStorage.removeItem(EXPIRY_KEY)
        processProjects([])
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
        localStorage.setItem(EXPIRY_KEY, (now + 1000 * 60 * 5).toString()) // 5 minutes
        processProjects(data)
      } catch {
        // Could not fetch projects, use manual projects only
        processProjects([])
      } finally {
        setLoading(false)
      }
    }

    const processProjects = (data: GitHubApiProject[]) => {
      const githubProjects: Project[] = data.map((project: GitHubApiProject) => {
        // Only redirect portfoliyou project to the portfoli-you page
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
      const uniqueTags = new Set<string>()
      allProjects.forEach((project) => {
        const projectTags = new Set<string>()
        if (project.language) projectTags.add(project.language.toLowerCase())
        project.topics?.forEach((tag) => projectTags.add(tag.toLowerCase()))
        projectTags.forEach((tag) => uniqueTags.add(tag))
      })
      setTags(["ALL", ...Array.from(uniqueTags)])
    }

    fetchProjects()
  }, [])
  
  useEffect(() => {
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowFilterMenu(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    
    // Load tab from localStorage first
    const savedTab = localStorage.getItem("portfolioActiveTab")
    if (savedTab && (savedTab === "projects" || savedTab === "repositories")) {
      setActiveSubsection(savedTab)
    }
    
    // Handle URL parameters for tab (overrides localStorage)
    const pageParam = searchParams.get("page")
    const parts = pageParam?.split("/")
    const tabParam = parts?.[1]
    if (tabParam && (tabParam === "projects" || tabParam === "repositories")) {
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
    localStorage.setItem("portfolioActiveTab", tabId)
    
    // Update URL with new format
    router.push(`?page=portfolio/${tabId}`, { scroll: false })
    
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

  // Filter both timeline projects and repository projects
  const filteredTimelineProjects = projectsTimelineData.filter((project) => {
    const nameMatch = project.name?.toLowerCase().includes(search.toLowerCase()) ?? false
    const summaryMatch = project.summary?.toLowerCase().includes(search.toLowerCase()) ?? false
    const topicMatch = project.topics?.some((topic) => topic.toLowerCase().includes(search.toLowerCase())) ?? false
    return nameMatch || summaryMatch || topicMatch
  })

  const filteredProjects = projects.filter((project) => {
    const nameMatch = project.name.toLowerCase().includes(search.toLowerCase())
    const descMatch = project.description?.toLowerCase().includes(search.toLowerCase()) ?? false
    const tagMatch = project.topics?.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ?? false
    return nameMatch || descMatch || tagMatch
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

  const sortedTags = React.useMemo(() => {
    if (!tags.length) return [];
    const [first, ...rest] = tags;
    const sortedRest = rest.slice().sort((a, b) => a.localeCompare(b));
    return first === "ALL" ? [first, ...sortedRest] : tags.slice().sort((a, b) => a.localeCompare(b));
  }, [tags]);

  const TAG_LIMIT = 8;

  const tagFilteredProjects =
    selectedTag === null || selectedTag === "ALL"
      ? sortedProjects
      : sortedProjects.filter(
          (project) =>
            project.topics.includes(selectedTag) ||
            project.language?.toLowerCase() === selectedTag
        )

  const tabs = [
    { id: "projects", label: "Projects" },
    { id: "repositories", label: "Repositories" },
  ]

  return (
    <div>
      <section id="portfolio" className="py-20 bg-[#121212]">
        <div className="container mx-auto px-4">
          {/* Portfolio description at the top */}
          <div className="text-center space-y-4 mb-12 max-w-4xl mx-auto">
            <p className="text-2xl text-gray-100 font-semibold">Projects & Contributions</p>
            <p className="text-lg text-gray-400">Showcasing my projects and contributions to the software development community.</p>
          </div>

          {/* Tabs and Search Section in Styled Box */}
          <div className="bg-[#1e1e1e] border border-[#333333] hover:border-red-600/50 rounded-xl p-6 shadow-lg mb-6 transition-all duration-300 max-w-4xl mx-auto">
            {/* Tabs */}
            <SubsectionTabs 
              tabs={tabs}
              activeTab={activeSubsection}
              onTabChange={handleTabChange}
            />

            {/* Search bar with gear icon filter */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder={isFocused ? "(Name, Description or Tags)" : "Search projects..."}
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
                  title="Sort options"
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
                        onClick={() => handleFilterChange("oldest")}
                        className={`w-full text-left px-4 py-2 hover:bg-[#2a2a2a] transition-colors ${
                          sortBy === "oldest" ? "text-red-500 bg-[#2a2a2a]" : "text-gray-300"
                        }`}
                      >
                        Oldest
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
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Filter Tags under search bar - only show for repositories */}
            {activeSubsection === "repositories" && !loading && (
              <div className="flex flex-wrap justify-center gap-3">
                {(showAllTags ? sortedTags : sortedTags.slice(0, TAG_LIMIT)).map((tag, index) => {
                  const isSelected = selectedTag === tag || (tag === "ALL" && selectedTag === null)
                  const isActive = activeTag === tag
                  const isAdditionalTag = index >= TAG_LIMIT
                  
                  // Determine animation class for additional tags
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
                      onClick={() => {
                        setSelectedTag(tag === "ALL" ? null : tag)
                        setActiveTag(tag)
                        setTimeout(() => setActiveTag(null), 500)
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform ${
                        isSelected
                          ? "bg-gradient-to-r from-red-600/70 to-red-500/70 text-white scale-105 shadow-lg shadow-red-500/30"
                          : "bg-[#333333] text-gray-300 hover:bg-[#444444] hover:scale-105"
                      } ${isActive && !isSelected ? "animate-elastic-in" : ""} ${animationClass}`}
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
          </div>

          <div className={`transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100 animate-fade-in-up'}`}>
            {/* Projects Section */}
            {activeSubsection === "projects" && (
              <div>
                <div className="mb-6 text-center">
                  <p className="text-gray-400 text-sm">
                    Showing {filteredTimelineProjects.length} Project{filteredTimelineProjects.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Timeline items={filteredTimelineProjects} type="project" />
              </div>
            )}

            {/* Repositories Section */}
            {activeSubsection === "repositories" && (
              <div>
              <div className="mb-6 text-center">
                <p className="text-gray-400 text-sm">
                  Showing {tagFilteredProjects.length} Project Repositor{tagFilteredProjects.length !== 1 ? "ies" : "y"}
                </p>
              </div>

              {/* Project Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                  ? [...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-[#1e1e1e] border border-[#333333] p-6 rounded-xl animate-pulse flex flex-col gap-4"
                      >
                        <div className="h-6 bg-[#333333] rounded w-3/4" />
                        <div className="h-4 bg-[#333333] rounded w-2/3" />
                        <div className="h-4 bg-[#333333] rounded w-5/6" />
                        <div className="flex-1" />
                        <div className="h-10 bg-[#292929] rounded w-full" />
                      </div>
                    ))

                  : tagFilteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="group bg-[#1e1e1e] hover:bg-[#252525] rounded-xl overflow-hidden border border-[#333333] hover:border-red-600/50 transition-transform duration-200 ease-out hover:scale-105 flex flex-col"
                      >
                        <div className="p-6 flex-grow">
                          <div className="mb-2">
                            <h3 className="text-xl font-semibold text-white group-hover:text-red-500 transition-colors duration-300 mb-1">
                              {project.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                              {project.source === "manual" && (
                                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">MANUAL</span>
                              )}
                              {project.source === "github" && (
                                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">GITHUB</span>
                              )}
                              {project.topics.includes("neumont") && (
                                <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">NEU</span>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-300 mb-2">{project.description}</p>
                          <p className="text-sm text-gray-400 mb-1">
                            Created On:{" "}
                            {new Date(project.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-gray-400 mb-2">
                            Last Updated:{" "}
                            {new Date(project.updated_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3">
                            {[...new Set([...project.topics, project.language].filter(Boolean).map((t) => t.toLowerCase()))].map((tag) => (
                              <span key={tag} className="bg-[#333333] text-gray-300 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                                {tag.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="px-6 py-4 border-t border-[#333333] bg-[#1a1a1a]">
                          <TooltipWrapper label={project.html_url} fullWidth>
                            <button
                              onClick={() => handleExternalClick(project.html_url, true)}
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
          )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Portfolio
