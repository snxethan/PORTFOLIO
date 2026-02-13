"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { FaGithub, FaExternalLinkAlt, FaYoutube, FaLock } from "react-icons/fa"
import { useExternalLink } from "../../ExternalLinkHandler"
import TooltipWrapper from "../../ToolTipWrapper"
import { manualProjects } from "../../../data/portfolioProjects"
import SearchFilterBar from "../../SearchFilterBar"

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

const ReposPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('reposSearch') || ""
    }
    return ""
  })
  const [sortBy, setSortBy] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('reposSortBy') || "newest"
    }
    return "newest"
  })
  const [selectedTag, setSelectedTag] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reposSelectedTag')
      return saved !== null ? saved : "Computer Science"
    }
    return "Computer Science"
  })
  const [showTagsMenu, setShowTagsMenu] = useState(false)
  const [tags, setTags] = useState<string[]>(["Computer Science"])
  const [loading, setLoading] = useState(true)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const { handleExternalClick } = useExternalLink()
  const searchParams = useSearchParams()

  const filterOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "name-desc", label: "Name (Z–A)" },
  ]

  // Handle tag click from repository cards
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
    setShowTagsMenu(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('reposSearch', search)
    }
  }, [search])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('reposSortBy', sortBy)
    }
  }, [sortBy])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedTag !== null) {
        localStorage.setItem('reposSelectedTag', selectedTag)
      } else {
        localStorage.removeItem('reposSelectedTag')
      }
    }
  }, [selectedTag])

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      const startTime = Date.now()
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
        localStorage.setItem(EXPIRY_KEY, (now + 1000 * 60 * 5).toString())
        processProjects(data)
      } catch {
        processProjects([])
      } finally {
        const elapsed = Date.now() - startTime
        const remainingTime = Math.max(0, 500 - elapsed)
        setTimeout(() => setLoading(false), remainingTime)
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
        project.topics?.forEach((tag) => projectTags.add(tag.toLowerCase()))
        projectTags.forEach((tag) => uniqueTags.add(tag))
      })
      setTags(Array.from(uniqueTags))
    }

    fetchProjects()
  }, [])
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowFilterMenu(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    
    const savedFilter = localStorage.getItem('reposSortBy')
    if (savedFilter) {
      const isValidFilter = filterOptions.some(option => option.value === savedFilter)
      if (isValidFilter) {
        setSortBy(savedFilter)
      }
    }
    
    return () => document.removeEventListener("keydown", handleEscape)
  }, [searchParams])
  
  const handleFilterChange = (value: string) => {
    setSortBy(value)
    localStorage.setItem('reposSortBy', value)
    setShowFilterMenu(false)
  }

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
    if (!tags.length) return []
    return tags.slice().sort((a, b) => a.localeCompare(b))
  }, [tags])

  const tagFilteredProjects =
    selectedTag === null || selectedTag === "Computer Science"
      ? sortedProjects
      : sortedProjects.filter(
          (project) =>
            project.topics.includes(selectedTag) ||
            project.language?.toLowerCase() === selectedTag
        )

  const resultsCount = `Showing ${tagFilteredProjects.length} Repositor${tagFilteredProjects.length !== 1 ? "ies" : "y"}`

  return (
    <>
      <div className="bg-[#222222] rounded-xl border border-[#333333] p-6 mb-6 animate-fadeInScale">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent transition-transform duration-200 ease-out hover:scale-110">
            Open Source Repositories
          </h2>
          <p className="text-center text-gray-300 mb-4 max-w-3xl mx-auto">
            Public repositories and contributions on GitHub
          </p>
          <p className="text-center text-gray-400 max-w-3xl mx-auto">
            Active contributions to open source projects and personal development repositories.
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
              setSelectedSort={handleFilterChange}
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
                    className="group bg-[#1e1e1e] hover:bg-[#252525] rounded-xl overflow-hidden border border-[#333333] hover:border-red-600/50 transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 flex flex-col"
                  >
                    <div className="p-6 flex-grow">
                      <div className="mb-2">
                        <h3 className="text-xl font-semibold text-white group-hover:text-[#dc2626] transition-colors duration-300 mb-1 truncate">
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
                      <p className="text-gray-300 mb-2 line-clamp-3 break-words">{project.description}</p>
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
                            className="bg-[#3a3a3a] text-gray-300 text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 hover:border-red-600 hover:text-[#ef4444] border border-transparent hover:bg-[#444444] cursor-pointer active:scale-95"
                          >
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
      </div>
    </>
  )
}

export default ReposPage
