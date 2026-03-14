"use client"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { FaFilePdf, FaExternalLinkAlt, FaCertificate, FaTools, FaBriefcase, FaGraduationCap, FaFolderOpen, FaGithub } from "react-icons/fa"

import { useExternalLink } from "../ExternalLinkHandler"
import TooltipWrapper from "../ToolTipWrapper"
import PDFModalViewer from "../PDFModalViewer"
import { skills, certifications, Skill, Certification } from "../../data/aboutData"
import PageTabs from "../PageTabs"
import SearchFilterBar from "../SearchFilterBar"
import ResponsiveCardSkeletonGrid from "../ResponsiveCardSkeletonGrid"

const About = ({ onTabChange, externalSubsection, onExternalSubsectionConsumed, refreshSignal }: { onTabChange?: (page: string, tab: string | null) => void; externalSubsection?: string | null; onExternalSubsectionConsumed?: () => void; refreshSignal?: number }) => {
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null)
  const [activeSubsection, setActiveSubsection] = useState<"certifications" | "skills">("certifications")
  const [search, setSearch] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("aboutSearch") || ""
    }
    return ""
  })
  const [sortBy, setSortBy] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("aboutSortBy") || "newest"
    }
    return "newest"
  })
  const [selectedTag, setSelectedTag] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aboutSelectedTag")
      return saved !== null ? saved : "Computer Science"
    }
    return "Computer Science"
  })
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showTagsMenu, setShowTagsMenu] = useState(false)
  const [cardsLoading, setCardsLoading] = useState(true)
  const { handleExternalClick } = useExternalLink()

  useEffect(() => {
    if (typeof window === "undefined") return
    const savedTab = localStorage.getItem("aboutActiveTab")
    if (savedTab === "certifications" || savedTab === "skills") {
      setActiveSubsection(savedTab)
    }
  }, [])

  // Respond to external sub-section override (e.g. from navbar context menu)
  useEffect(() => {
    if (externalSubsection === "certifications" || externalSubsection === "skills") {
      setActiveSubsection(externalSubsection)
      onExternalSubsectionConsumed?.()
    }
  }, [externalSubsection, onExternalSubsectionConsumed])

  // Reset content when the same tab is re-clicked (refreshSignal increments)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setSearch("")
    setSortBy(activeSubsection === "certifications" ? "newest" : "hard-soft")
    setSelectedTag("Computer Science")
    setShowFilterMenu(false)
    setShowTagsMenu(false)
    setCardsLoading(true)
    const rafId = requestAnimationFrame(() => setCardsLoading(false))
    return () => cancelAnimationFrame(rafId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aboutActiveTab", activeSubsection)
    }

    const savedSearch = localStorage.getItem(`about-${activeSubsection}-search`)
    const savedSort = localStorage.getItem(`about-${activeSubsection}-sort`)
    const savedTag = localStorage.getItem(`about-${activeSubsection}-tag`)

    setSearch(savedSearch ?? "")
    setSortBy(savedSort ?? (activeSubsection === "certifications" ? "newest" : "hard-soft"))
    setSelectedTag(savedTag !== null ? savedTag : "Computer Science")
    setShowFilterMenu(false)
    setShowTagsMenu(false)
  }, [activeSubsection])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aboutSearch", search)
      localStorage.setItem(`about-${activeSubsection}-search`, search)
    }
  }, [search, activeSubsection])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aboutSortBy", sortBy)
      localStorage.setItem(`about-${activeSubsection}-sort`, sortBy)
    }
  }, [sortBy, activeSubsection])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedTag !== null) {
        localStorage.setItem("aboutSelectedTag", selectedTag)
        localStorage.setItem(`about-${activeSubsection}-tag`, selectedTag)
      } else {
        localStorage.removeItem("aboutSelectedTag")
        localStorage.removeItem(`about-${activeSubsection}-tag`)
      }
    }
  }, [selectedTag, activeSubsection])

  useEffect(() => {
    let isCancelled = false
    setCardsLoading(true)

    const rafId = requestAnimationFrame(() => {
      if (!isCancelled) setCardsLoading(false)
    })

    return () => {
      isCancelled = true
      cancelAnimationFrame(rafId)
    }
  }, [activeSubsection])

  const cardSizeClass = "min-h-[180px] h-full min-w-[260px] w-[calc(100%-1.5rem)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] 2xl:w-[calc((100%-4.5rem)/4)] shrink-0 snap-start"

  const renderCertificationCard = (item: Certification) => {
    const { name, icon: Icon, highlight, url, year } = item
    const card = (
      <div className={`group relative z-0 hover:z-10 flex items-start gap-4 bg-[#151515] hover:bg-[#252525] p-5 rounded-none border border-[#333333] hover:border-red-600/50 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-red-600/30 ${cardSizeClass}`}>
        <div
          className={`flex-shrink-0 p-3 rounded-lg shadow-lg ${
            highlight ? "bg-gradient-to-br from-red-500/80 to-red-700/80" : "bg-red-600/40 group-hover:bg-red-600/50"
          }`}
        >
          <Icon className="text-white text-xl" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-base break-words whitespace-normal group-hover:text-[#dc2626] transition-colors duration-300">
            {name}
          </p>
          {year && <span className="text-gray-400 text-sm">{year}</span>}
        </div>
        {url && (
          <div className="absolute bottom-3 right-3 text-gray-400 group-hover:text-[#dc2626] transition-colors duration-300">
            {url.endsWith(".pdf") ? <FaFilePdf size={14} aria-label="View Certification" /> : <FaExternalLinkAlt size={14} aria-label="Open external link" />}
          </div>
        )}
      </div>
    )

    if (url?.endsWith(".pdf")) {
      return (
        <TooltipWrapper key={name} label="View Certification" url={url}>
          <button type="button" onClick={() => setSelectedPDF(url)} className="text-left">
            {card}
          </button>
        </TooltipWrapper>
      )
    }

    return url ? (
      <TooltipWrapper key={name} label={url}>
        <button type="button" onClick={() => handleExternalClick(url, true)} className="text-left">
          {card}
        </button>
      </TooltipWrapper>
    ) : (
      <div key={name}>{card}</div>
    )
  }

  const renderSkillCard = (item: Skill) => {
    const { name, icon: Icon, highlight, url } = item
    const card = (
      <div className={`group relative z-0 hover:z-10 flex items-start gap-4 bg-[#151515] hover:bg-[#252525] p-5 rounded-none border border-[#333333] hover:border-red-600/50 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-red-600/30 ${cardSizeClass}`}>
        <div
          className={`flex-shrink-0 p-3 rounded-lg shadow-lg ${
            highlight ? "bg-gradient-to-br from-red-500/80 to-red-700/80" : "bg-red-600/40 group-hover:bg-red-600/50"
          }`}
        >
          <Icon className="text-white text-xl" />
        </div>
        <p className="text-white font-semibold text-base break-words whitespace-normal group-hover:text-[#dc2626] transition-colors duration-300">
          {name}
        </p>
        {url && !url.endsWith(".pdf") && (
          <div className="absolute bottom-3 right-3 text-gray-400 group-hover:text-[#dc2626] transition-colors duration-300">
            <FaExternalLinkAlt size={14} aria-label="Open external link" />
          </div>
        )}
      </div>
    )

    return url ? (
      <TooltipWrapper key={name} label={url}>
        <button type="button" onClick={() => handleExternalClick(url, true)} className="text-left">
          {card}
        </button>
      </TooltipWrapper>
    ) : (
      <div key={name}>{card}</div>
    )
  }

  const tabs = [
    { id: "certifications", label: "Certifications" },
    { id: "skills", label: "Skills" },
  ]

  const tagOptions = useMemo(() => {
    const tagSet = new Set<string>()
    const items = activeSubsection === "certifications" ? certifications : skills
    items.forEach((item) => {
      item.tags?.forEach((tag) => tagSet.add(tag))
    })
    const tags = Array.from(tagSet).sort()
    if (activeSubsection === "skills") {
      return ["Hard Skills", "Soft Skills", ...tags]
    }
    return tags
  }, [activeSubsection])

  const filterOptions = activeSubsection === "certifications" ? [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "name-desc", label: "Name (Z–A)" },
  ] : [
    { value: "hard-soft", label: "Skills (Hard-Soft)" },
    { value: "soft-hard", label: "Skills (Soft-Hard)" },
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "name-desc", label: "Name (Z–A)" },
  ]

  const filteredCertifications = useMemo(() => (
    certifications.filter((cert) => {
      const matchesSearch = cert.name.toLowerCase().includes(search.toLowerCase())
      const matchesTag = !selectedTag || cert.tags?.includes(selectedTag)
      return matchesSearch && matchesTag
    })
  ), [search, selectedTag])

  const sortedCertifications = useMemo(() => (
    [...filteredCertifications].sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name)
      if (sortBy === "name-desc") return b.name.localeCompare(a.name)
      if (sortBy === "oldest") return a.year - b.year
      if (sortBy === "newest") return b.year - a.year
      if (a.highlight === b.highlight) return a.name.localeCompare(b.name)
      return a.highlight ? -1 : 1
    })
  ), [filteredCertifications, sortBy])

  const filteredSkills = useMemo(() => (
    skills.filter((skill) => {
      const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase())
      const matchesTag = !selectedTag ||
        skill.tags?.includes(selectedTag) ||
        (selectedTag === "Hard Skills" && skill.highlight === true) ||
        (selectedTag === "Soft Skills" && skill.highlight !== true)
      return matchesSearch && matchesTag
    })
  ), [search, selectedTag])

  const sortedSkills = useMemo(() => (
    [...filteredSkills].sort((a, b) => {
      if (sortBy === "hard-soft") {
        if (a.highlight === b.highlight) return a.name.localeCompare(b.name)
        return a.highlight ? -1 : 1
      }
      if (sortBy === "soft-hard") {
        if (a.highlight === b.highlight) return a.name.localeCompare(b.name)
        return a.highlight ? 1 : -1
      }
      if (sortBy === "name-asc") return a.name.localeCompare(b.name)
      if (sortBy === "name-desc") return b.name.localeCompare(a.name)
      if (a.highlight === b.highlight) return a.name.localeCompare(b.name)
      return a.highlight ? -1 : 1
    })
  ), [filteredSkills, sortBy])

  const resultsCount = activeSubsection === "certifications"
    ? `Showing ${sortedCertifications.length} Certification${sortedCertifications.length !== 1 ? "s" : ""}`
    : `Showing ${sortedSkills.length} Skill${sortedSkills.length !== 1 ? "s" : ""}`

  const handleFilterChange = (value: string) => {
    setSortBy(value)
    setShowFilterMenu(false)
  }

  const handleJump = (page: string, tab: string | null) => {
    if (page === "about" && (tab === "certifications" || tab === "skills")) {
      setActiveSubsection(tab)
    }
    onTabChange?.(page, tab)
  }

  const scrollToCards = () => {
    if (typeof window === "undefined") return
    const target = document.getElementById("about-cards")
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleAboutTabChange = (tab: string | null) => {
    const nextTab = tab === "skills" ? "skills" : "certifications"
    // Always call parent — HomeClient detects same-tab re-clicks and increments the refresh key
    onTabChange?.("about", nextTab)
    // Also update internal state immediately so the switch is instant
    setActiveSubsection(nextTab)
    requestAnimationFrame(scrollToCards)
  }

  return (
    <>
      <div className="bg-[#222222] rounded-xl border border-[#333333] p-6 mb-6 animate-fadeInScale">
        <div className="mb-5 text-center">
          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent transition-transform">
            Welcome to My Portfolio
          </h2>
        </div>

        <p className="mt-4 text-gray-300 max-w-2xl mx-auto text-center">
          I am Ethan Townsend, a Full-Stack Software Engineer with a passion for back-end development.
          <br />
          <br />
          Jump to my{" "}
          <button
            type="button"
            onClick={() => handleJump("about", "certifications")}
            className="text-red-500 hover:text-red-300 underline-offset-4 hover:underline decoration-red-400/70 decoration-2 inline-flex items-center gap-1 transition-all duration-200 hover:scale-[1.02]"
          >
            <FaCertificate className="text-base" />
            Certifications
          </button>
          ,{" "}
          <button
            type="button"
            onClick={() => handleJump("about", "skills")}
            className="text-red-500 hover:text-red-300 underline-offset-4 hover:underline decoration-red-400/70 decoration-2 inline-flex items-center gap-1 transition-all duration-200 hover:scale-[1.02]"
          >
            <FaTools className="text-base" />
            Skills
          </button>
          ,{" "}
          <button
            type="button"
            onClick={() => handleJump("career", "experience")}
            className="text-red-500 hover:text-red-300 underline-offset-4 hover:underline decoration-red-400/70 decoration-2 inline-flex items-center gap-1 transition-all duration-200 hover:scale-[1.02]"
          >
            <FaBriefcase className="text-base" />
            Experience
          </button>
          ,{" "}
          <button
            type="button"
            onClick={() => handleJump("career", "education")}
            className="text-red-500 hover:text-red-300 underline-offset-4 hover:underline decoration-red-400/70 decoration-2 inline-flex items-center gap-1 transition-all duration-200 hover:scale-[1.02]"
          >
            <FaGraduationCap className="text-base" />
            Education
          </button>
          , and{" "}
          <button
            type="button"
            onClick={() => handleJump("projects", "projects")}
            className="text-red-500 hover:text-red-300 underline-offset-4 hover:underline decoration-red-400/70 decoration-2 inline-flex items-center gap-1 transition-all duration-200 hover:scale-[1.02]"
          >
            <FaFolderOpen className="text-base" />
            Projects
          </button>
          ,{" "}
          <button
            type="button"
            onClick={() => handleJump("projects", "repos")}
            className="text-red-500 hover:text-red-300 underline-offset-4 hover:underline decoration-red-400/70 decoration-2 inline-flex items-center gap-1 transition-all duration-200 hover:scale-[1.02]"
          >
            <FaGithub className="text-base" />
            Repositories
          </button>
          .
          <br />
          <br />
        </p>

        <div className="flex justify-center mb-4">
          <PageTabs
            tabs={tabs}
            activeId={activeSubsection}
            onChange={handleAboutTabChange}
          />

        </div>

        <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-4">
          <div className="container mx-auto">
            <SearchFilterBar
              search={search}
              setSearch={setSearch}
              placeholder={`Search ${activeSubsection} by name or tags...`}
              tags={tagOptions}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              sortOptions={filterOptions}
              selectedSort={sortBy}
              setSelectedSort={handleFilterChange}
              showTagsMenu={showTagsMenu}
              setShowTagsMenu={setShowTagsMenu}
              showFilterMenu={showFilterMenu}
              setShowFilterMenu={setShowFilterMenu}
              defaultSort={activeSubsection === "certifications" ? "newest" : "hard-soft"}
            />

            {resultsCount && (
              <div className="text-sm text-gray-400 mt-2 text-center sm:text-left">{resultsCount}</div>
            )}
          </div>
        </div>
      </div>

      <div
        id="about-cards"
        className="mt-0 w-full max-w-full overflow-visible"
        style={{ scrollMarginTop: "calc(var(--navbar-height, 6rem) + 1rem)" }}
      >
        {cardsLoading ? (
          <ResponsiveCardSkeletonGrid
            renderCard={(i) => (
              <div
                key={i}
                className="bg-[#151515] border border-[#333333] p-5 rounded-none animate-pulse min-h-[180px]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[#333333] rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#333333] rounded w-3/4" />
                    <div className="h-3 bg-[#333333] rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-2 mt-5">
                  <div className="h-3 bg-[#333333] rounded w-full" />
                  <div className="h-3 bg-[#333333] rounded w-5/6" />
                </div>
              </div>
            )}
          />
        ) : (
          <div className="w-full max-w-full overflow-x-auto overflow-y-visible overscroll-x-contain snap-x snap-mandatory">
            <div className="flex w-full min-w-full items-stretch gap-6 px-3 py-4">
              {activeSubsection === "certifications"
                ? sortedCertifications.map(renderCertificationCard)
                : sortedSkills.map(renderSkillCard)}
            </div>
          </div>
        )}
      </div>

      {selectedPDF && (
        <PDFModalViewer pdfUrl={selectedPDF} onClose={() => setSelectedPDF(null)} />
      )}
    </>
  )
}

export default About
