"use client"

import React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { manualProjects } from "../../data/portfolioProjects"
import ProjectCard from "../ui/ProjectCard"
import TagFilter from "../ui/TagFilter"

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  stargazers_count: number;
}
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

const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showAllTags, setShowAllTags] = useState(false);
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isFocused, setIsFocused] = useState(false)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [isExtending, setIsExtending] = useState(false)
  const [isHiding, setIsHiding] = useState(false)

  const handleShowAllTagsToggle = useCallback(() => {
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
  }, [showAllTags])

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
        console.warn("Cache corrupted, refetching")
        localStorage.removeItem(CACHE_KEY)
        localStorage.removeItem(EXPIRY_KEY)
        // Fallback to manual projects while trying to fetch
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
      } catch (error) {
        console.error("Could not fetch projects:", error)
        
        processProjects([])
      } finally {
        setLoading(false)
      }
    }

    const processProjects = (data: GitHubRepo[]) => {
      const githubProjects: Project[] = data.map((project: GitHubRepo) => {
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

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const nameMatch = project.name.toLowerCase().includes(search.toLowerCase())
      const descMatch = project.description?.toLowerCase().includes(search.toLowerCase()) ?? false
      const tagMatch = project.topics?.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ?? false
      return nameMatch || descMatch || tagMatch
    })
  }, [projects, search])

  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
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
  }, [filteredProjects, sortBy])

  const handleTagSelect = useCallback((tag: string) => {
    setSelectedTag(tag === "ALL" ? null : tag)
    setActiveTag(tag)
    setTimeout(() => setActiveTag(null), 500)
  }, [])

  const tagFilteredProjects = useMemo(() => {
    return selectedTag === null || selectedTag === "ALL"
      ? sortedProjects
      : sortedProjects.filter(
          (project) =>
            project.topics.includes(selectedTag) ||
            project.language?.toLowerCase() === selectedTag
        )
  }, [selectedTag, sortedProjects])

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
            <TagFilter
              tags={tags}
              selectedTag={selectedTag}
              activeTag={activeTag}
              showAllTags={showAllTags}
              isExtending={isExtending}
              isHiding={isHiding}
              onTagSelect={handleTagSelect}
              onToggleShowAll={handleShowAllTagsToggle}
            />
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
                  <ProjectCard key={project.id} project={project} />
                ))}
          </div>
        </div>  
      </section>
    </div>
  )
}

export default Portfolio
