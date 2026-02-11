"use client"

import React from "react"
import { useState, useEffect } from "react"
import { FaGithub, FaExternalLinkAlt, FaYoutube, FaLock, FaChevronDown, FaChevronUp, FaCog, FaSearch, FaTimes } from "react-icons/fa"
import { useSearchParams, useRouter } from "next/navigation"
import { useExternalLink } from "../ExternalLinkHandler"
import TooltipWrapper from "../ToolTipWrapper"
import { manualProjects } from "../../data/portfolioProjects"
import Timeline from "../Timeline"
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
  const [selectedTag, setSelectedTag] = useState<string | null>("Computer Science")
  const [showAllTags, setShowAllTags] = useState(false);
  const [tags, setTags] = useState<string[]>(["Computer Science"])
  const [loading, setLoading] = useState(true)
  const { handleExternalClick } = useExternalLink()
  const searchParams = useSearchParams()
  const router = useRouter()
  // Get activeSubsection from URL immediately to avoid flash
  const pageParam = searchParams?.get("page") || "portfolio/projects"
  const [activeSubsection, setActiveSubsection] = useState(pageParam.split("/")[1] || "projects")
  const [isAnimating, setIsAnimating] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [clickedTab, setClickedTab] = useState<string | null>(null)

  const handleShowAllTagsToggle = () => {
    setShowAllTags(!showAllTags)
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
      const uniqueTags = new Set<string>(["Computer Science"])
      allProjects.forEach((project) => {
        const projectTags = new Set<string>()
        if (project.language) projectTags.add(project.language.toLowerCase())
        project.topics?.forEach((tag) => projectTags.add(tag.toLowerCase()))
        projectTags.forEach((tag) => uniqueTags.add(tag))
      })
      setTags(Array.from(uniqueTags))
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
    
    // Load filter from localStorage with validation
    const savedFilter = localStorage.getItem("globalFilter")
    if (savedFilter) {
      // Validate that the saved filter is supported on this page
      const filterOptions = [
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
        { value: "name-asc", label: "Name (A–Z)" },
        { value: "name-desc", label: "Name (Z–A)" },
      ]
      const isValidFilter = filterOptions.some(option => option.value === savedFilter)
      if (isValidFilter) {
        setSortBy(savedFilter)
      }
    }
    
    return () => document.removeEventListener("keydown", handleEscape)
  }, [searchParams])
  
  const handleTabChange = (tabId: string) => {
    setClickedTab(tabId)
    setTimeout(() => setClickedTab(null), 300)
    setIsAnimating(true)
    
    // Save to localStorage
    localStorage.setItem("portfolioActiveTab", tabId)
    
    // Scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: "smooth" })
    
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
    return tags.slice().sort((a, b) => a.localeCompare(b));
  }, [tags]);

  const tagFilteredProjects =
    selectedTag === null || selectedTag === "Computer Science"
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

  const filterOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "name-desc", label: "Name (Z–A)" },
  ]

  const resultsCount = activeSubsection === "projects"
    ? `Showing ${filteredTimelineProjects.length} Project${filteredTimelineProjects.length !== 1 ? 's' : ''}`
    : `Showing ${tagFilteredProjects.length} Repositor${tagFilteredProjects.length !== 1 ? "ies" : "y"}`

  const isFilterActive = sortBy && sortBy !== "newest"

  // Tab-specific descriptions
  const getPageDescription = () => {
    switch (activeSubsection) {
      case "projects":
        return {
          title: "Project Timeline",
          subtitle: "Key projects and contributions throughout my career"
        }
      case "repositories":
        return {
          title: "Open Source Repositories",
          subtitle: "Public repositories and contributions on GitHub"
        }
      default:
        return {
          title: "Project Timeline",
          subtitle: "Key projects and contributions throughout my career"
        }
    }
  }

  const pageDescription = getPageDescription()

  return (
    <>
      {/* Header section - wrapped in styled container */}
      <div className="bg-[#222222] rounded-xl border border-[#333333] p-6 mb-6 animate-fadeInScale">
        {/* Header content */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            {pageDescription.title}
          </h2>
          <p className="text-center text-gray-300 mb-4 max-w-3xl mx-auto">
            {pageDescription.subtitle}
          </p>
        </div>
      
        {/* Navigation subsection */}
        <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-4">
          <div className="container mx-auto">
          {/* Search bar with filter */}
          <div className="flex gap-3 mb-4 overflow-visible relative">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name, description, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white placeholder-gray-400 px-4 py-3 pr-12 rounded-lg border border-[#444444] focus:border-red-600 focus:outline-none transition-all"
              />
              {/* Filter gear icon inside search bar */}
              {filterOptions.length > 0 && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className={`p-2 rounded-lg transition-all ${
                      isFilterActive ? "text-red-500" : "text-gray-400 hover:text-gray-300"
                    }`}
                    title="Filter options"
                  >
                    <FaCog className="w-5 h-5" />
                  </button>
                  
                  {/* Filter dropdown menu */}
                  {showFilterMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowFilterMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 bg-[#2a2a2a] border border-[#444444] rounded-lg shadow-xl py-2 min-w-[200px] z-[9999]">
                        {filterOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleFilterChange(option.value)}
                            className={`w-full text-left px-4 py-2 transition-colors ${
                              sortBy === option.value
                                ? "text-red-500 bg-[#333333]"
                                : "text-gray-300 hover:bg-[#333333] hover:text-white"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Results count */}
          {resultsCount && (
            <div className="text-sm text-gray-400 mb-3">{resultsCount}</div>
          )}

          {/* Tags section */}
          {activeSubsection === "repositories" && sortedTags.length > 0 && (
            <div className={`space-y-2 transition-all duration-300 ease-in-out overflow-hidden ${
              showAllTags ? "max-h-[500px] opacity-100" : "max-h-24 opacity-100"
            }`}>
              <div className="flex flex-wrap gap-2 transition-all duration-300">
                {/* Clear button */}
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    !selectedTag
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30"
                      : "bg-[#333333] text-gray-300 hover:bg-[#444444]"
                  }`}
                >
                  ×
                </button>
                
                {(showAllTags ? sortedTags : sortedTags.slice(0, 8)).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag === "" ? null : tag)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 border ${
                      selectedTag === tag
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30 border-transparent"
                        : "bg-[#333333] text-gray-300 hover:bg-[#444444] hover:text-[#dc2626] hover:border-red-600 border-transparent"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              
              {/* Show more/less button */}
              {sortedTags.length > 8 && (
                <button
                  onClick={handleShowAllTagsToggle}
                  className="text-red-500 hover:text-red-400 text-sm font-medium flex items-center gap-1"
                >
                  {showAllTags ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
      
      {/* Content section - outside header wrapper */}
      <div className={`transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100 animate-fade-in-up'}`}>
            {/* Projects Section */}
            {activeSubsection === "projects" && (
              <div>
                <Timeline items={filteredTimelineProjects} type="project" />
              </div>
            )}

            {/* Repositories Section */}
            {activeSubsection === "repositories" && (
              <div>
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
    </>
  )
}

export default Portfolio
