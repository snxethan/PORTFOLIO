"use client"

import React from "react"
import { useState, useEffect } from "react"
import { FaGithub, FaExternalLinkAlt, FaYoutube, FaLock, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { useExternalLink } from "../ExternalLinkHandler"
import TooltipWrapper from "../ToolTipWrapper"

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

const getCTAIcon = (icon?: string) => {
  switch (icon) {
    case "github": return <FaGithub className="w-5 h-5" />
    case "external": return <FaExternalLinkAlt className="w-5 h-5" />
    case "youtube": return <FaYoutube className="w-5 h-5" />
    case "private": return <FaLock className="w-5 h-5" />
    default: return <FaGithub className="w-5 h-5" />
  }
}

const manualProjects: Project[] = [
  {
    id: 1,
    name: "CSC130-FINAL",
    description: "Built and deployed a web-app based game designed around the hit game 'Gartic Phone', a one-to-one recreation.",
    html_url: "https://github.com/Neumont-VictorKeeler/Artic_Cone",
    language: "TypeScript",
    topics: ["neumont", "game-development", "typescript", "react","tailwind"],
    created_at: "2025-01-20T00:00:00Z",
    updated_at: "2025-01-30T00:00:00Z",
    source: "github",
    ctaLabel: "View Repository",
    ctaIcon: "github"
  },
  {
    id: 2,
    name: "CSC130-FINAL",
    description: "Built, designed, and deployed a Java game based on the classic card game 'UNO'.",
    html_url: "https://github.com/MasterDash5/UnoProject",
    language: "Java",
    topics: ["neumont", "java", "javafx", "cli"],
    created_at: "2025-01-21T00:00:00Z",
    updated_at: "2025-01-28T00:00:00Z",
    source: "github",
    ctaLabel: "This repository is private",
    ctaIcon: "private"
  },
  {
    id: 3,
    name: "CSC110-FINAL",
    description: "Contributed and built a simple and inefficient notepad application using Android Studio and Java. This was my first ever project in Java.",
    html_url: "https://github.com/Tomonator1000/Notepad",
    language: "Java",
    topics: ["java", "android studio", "neumont"],
    created_at: "2023-10-15T00:00:00Z",
    updated_at: "2023-11-30T00:00:00Z",
    source: "github",
    ctaLabel: "View Repository",
    ctaIcon: "github"
  },
  {
    id: 4,
    name: "CSC150-FINAL",
    description: "Built and designed a simple casino CLI game using Java.",
    html_url: "https://github.com/Stat3132/CasinoTeamProject",
    language: "Java",
    topics: ["neumont", "java"],
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-03-04T00:00:00Z",
    source: "github",
    ctaLabel: "View Repository",
    ctaIcon: "github"
  },
  {
    id: 5,
    name: "CSC280-FINAL",
    description: "Built and designed a modular portfolio creation tool using React, TypeScript, and Tailwind CSS.",
    html_url: "https://github.com/Ghussy/Rollio",
    language: "TypeScript",
    topics: ["react", "typescript", "tailwind", "neumont"],
    created_at: "2024-11-13T00:00:00Z",
    updated_at: "2024-12-04T00:00:00Z",
    source: "github",
    ctaLabel: "This repository is private",
    ctaIcon: "private"
  }
]
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
      } catch (err) {
        console.warn("Cache corrupted, refetching")
        localStorage.removeItem(CACHE_KEY)
        localStorage.removeItem(EXPIRY_KEY)
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
      } catch (error) {
        console.error("Could not fetch projects:", error)
        // If GitHub API fails, still show manual projects
        processProjects([])
      } finally {
        setLoading(false)
      }
    }

    const processProjects = (data: any[]) => {
      const githubProjects: Project[] = data.map((project: any) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        html_url: project.html_url,
        language: project.language,
        topics: project.topics || [],
        created_at: project.created_at,
        updated_at: project.updated_at,
        source: "github",
        stargazers_count: project.stargazers_count,
        ctaLabel: "View Repository",
        ctaIcon: "github",
      }))
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

  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-6 relative text-center">
        Projects & Contributions
        <span className="absolute bottom-[-8px] left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-500"></span>
      </h2>
      <section id="portfolio" className="py-20 bg-[#121212]">
        <div className="container mx-auto px-4">
          {/* Search & Sort */}
              <div className="mb-4 text-center text-gray-400 text-sm">
            Showing {tagFilteredProjects.length} project{tagFilteredProjects.length !== 1 && "s"}
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
          type="text"
          placeholder={isFocused ? "(Name, Description or Tags)" : "Search projects..."}
          className="w-full pl-10 pr-4 py-2 bg-[#1e1e1e] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-white transition-transform duration-200 ease-out hover:scale-105"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
/>
        <select
            className="w-full pl-10 pr-4 py-2 bg-[#1e1e1e] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-white appearance-none transition-transform duration-200 ease-out hover:scale-105"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="" disabled hidden>Filter...</option>
            <option value="name-asc">Project Name (A–Z)</option>
            <option value="name-desc">Project Name (Z–A)</option>
            <option value="oldest">Created (Oldest)</option>
            <option value="newest">Created (Newest)</option>
          </select>

          </div>

          {/* Filter Tags */}
          {!loading && (
            <div className="flex flex-wrap gap-3 mb-8">
              {(showAllTags ? sortedTags : sortedTags.slice(0, TAG_LIMIT)).map((tag) => {
                const isSelected = selectedTag === tag || (tag === "ALL" && selectedTag === null)
                const isActive = activeTag === tag

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
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-lg shadow-red-500/30"
                        : "bg-[#333333] text-gray-300 hover:bg-[#444444] hover:scale-105"
                    } ${isActive && !isSelected ? "animate-elastic-in" : ""}`}
                  >
                    {tag}
                  </button>
                )
              })}
            {sortedTags.length > TAG_LIMIT && (
              <button
                onClick={() => setShowAllTags((v) => !v)}
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
          

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {loading
              ? [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#1e1e1e] border border-[#333333] p-6 rounded-xl animate-pulse flex flex-col gap-4 "
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
                      className="group bg-[#1e1e1e] hover:bg-[#252525] rounded-xl overflow-hidden border border-[#333333] hover:border-red-600/50 transition-transform duration-200 ease-out hover:scale-105 flex flex-col active:scale-95"
                    >

                    <div className="p-6 flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold text-white group-hover:text-red-500 transition-colors duration-300">
                          {project.name}
                        </h3>
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
                      <div className="flex flex-wrap gap-2 mt-2">
                        {[...new Set([...project.topics, project.language].filter(Boolean).map((t) => t.toLowerCase()))].map((tag) => (
                          <span key={tag} className="bg-[#333333] text-gray-300 text-xs px-2 py-1 rounded-full">
                            {tag.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                      <div className="px-6 py-4 border-t border-[#333333] bg-[#1a1a1a]">
                        <TooltipWrapper label={project.html_url} fullWidth>
                      <button
                      onClick={() => handleExternalClick(project.html_url, true)}
                      className="flex items-center justify-center gap-2 w-full p-3 min-h-[48px] bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg transition-all text-sm sm:text-base"
                    >
                      {getCTAIcon(project.ctaIcon ?? (project.source === "github" ? "github" : undefined))}
                      <span className="flex-1 break-words text-center leading-tight">
                        {project.name.toLowerCase() === "portfolio"
                          ? "View (This website!) Repository"
                          : project.ctaLabel ?? "View Repository"}
                      </span>
                    </button>
                        </TooltipWrapper>
                      </div>
                  </div>
                ))}
          </div>
        </div>  
      </section>
    </div>
  )
}

export default Portfolio