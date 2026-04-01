"use client"
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { FaFilePdf, FaExternalLinkAlt, FaCertificate, FaTools, FaBriefcase, FaGraduationCap, FaFolderOpen, FaGithub } from "react-icons/fa"

import { useExternalLink } from "../ExternalLinkHandler"
import TooltipWrapper from "../ToolTipWrapper"
import PDFModalViewer from "../PDFModalViewer"
import { skills, certifications, Skill, Certification } from "../../data/aboutData"
import PageTabs from "../PageTabs"
import SearchFilterBar from "../SearchFilterBar"
import ResponsiveCardSkeletonGrid from "../ResponsiveCardSkeletonGrid"
import { scrollElementIntoViewWithNavbarOffset } from "../../utils/scrollWithNavbarOffset"

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
  const cardsScrollContainerRef = useRef<HTMLDivElement>(null)
  const { handleExternalClick } = useExternalLink()

  const shouldRevealCardFirst = useCallback((cardElement: HTMLElement) => {
    const container = cardsScrollContainerRef.current
    if (!container) return false

    const cardRect = cardElement.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const isClippedLeft = cardRect.left < containerRect.left + 8
    const isClippedRight = cardRect.right > containerRect.right - 8

    if (!isClippedLeft && !isClippedRight) return false

    cardElement.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    return true
  }, [])

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

  const handleCardTagClick = (event: React.MouseEvent<HTMLElement>, tag: string) => {
    event.preventDefault()
    event.stopPropagation()
    setSelectedTag(tag)
    setShowTagsMenu(true)
    requestAnimationFrame(scrollToCards)
  }

  const renderFilterTags = (tags: string[]) => {
    if (tags.length === 0) return null

    return (
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            onMouseDown={(event) => {
              event.preventDefault()
              event.stopPropagation()
            }}
            onClick={(event) => handleCardTagClick(event, tag)}
            style={{
              fontSize: "9px",
              padding: "1px 5px",
              background: "#c0bdb4",
              color: "#000000",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
              borderTop: "1px solid #808080",
              borderLeft: "1px solid #808080",
              borderRight: "1px solid #ffffff",
              borderBottom: "1px solid #ffffff",
            }}
          >
            {tag.toUpperCase()}
          </span>
        ))}
      </div>
    )
  }

  const renderCertificationCard = (item: Certification) => {
    const { name, icon: Icon, highlight, url, year } = item
    const cardTags = item.tags ?? []
    const card = (
      <div className={`group relative z-0 hover:z-10 flex items-start gap-3 p-3 transition-all duration-150 ${cardSizeClass}`}
        style={{
          background: "#d4d0c8",
          borderTop: "1px solid #808080",
          borderLeft: "1px solid #808080",
          borderRight: "1px solid #ffffff",
          borderBottom: "1px solid #ffffff",
          fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
          cursor: url ? "pointer" : "default",
        }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: 32, height: 32,
            background: highlight ? "#000080" : "#c0bdb4",
            borderTop: "1px solid #ffffff",
            borderLeft: "1px solid #ffffff",
            borderRight: "1px solid #404040",
            borderBottom: "1px solid #404040",
          }}
        >
          <Icon style={{ color: highlight ? "#ffffff" : "#000080", fontSize: "14px" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: "11px", fontWeight: "bold", color: "#000000", wordBreak: "break-word", whiteSpace: "normal" }}>
            {name}
          </p>
          {year && <span style={{ fontSize: "10px", color: "#444444" }}>{year}</span>}
          {renderFilterTags(cardTags)}
        </div>
        {url && (
          <div className="absolute bottom-2 right-2" style={{ color: "#808080" }}>
            {url.endsWith(".pdf") ? <FaFilePdf size={11} aria-label="View Certification" /> : <FaExternalLinkAlt size={11} aria-label="Open external link" />}
          </div>
        )}
      </div>
    )

    if (url?.endsWith(".pdf")) {
      return (
        <TooltipWrapper key={name} label="View Certification" url={url}>
          <button
            type="button"
            onClick={(event) => {
              if (shouldRevealCardFirst(event.currentTarget)) return
              setSelectedPDF(url)
            }}
            className="text-left"
          >
            {card}
          </button>
        </TooltipWrapper>
      )
    }

    return url ? (
      <TooltipWrapper key={name} label={url}>
        <button
          type="button"
          onClick={(event) => {
            if (shouldRevealCardFirst(event.currentTarget)) return
            handleExternalClick(url, true)
          }}
          className="text-left"
        >
          {card}
        </button>
      </TooltipWrapper>
    ) : (
      <div key={name}>{card}</div>
    )
  }

  const renderSkillCard = (item: Skill) => {
    const { name, icon: Icon, highlight, url } = item
    const cardTags = Array.from(new Set([highlight ? "Hard Skills" : "Soft Skills", ...(item.tags ?? [])]))
    const card = (
      <div className={`group relative z-0 hover:z-10 flex items-start gap-3 p-3 transition-all duration-150 ${cardSizeClass}`}
        style={{
          background: "#d4d0c8",
          borderTop: "1px solid #808080",
          borderLeft: "1px solid #808080",
          borderRight: "1px solid #ffffff",
          borderBottom: "1px solid #ffffff",
          fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
          cursor: url ? "pointer" : "default",
        }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: 32, height: 32,
            background: highlight ? "#000080" : "#c0bdb4",
            borderTop: "1px solid #ffffff",
            borderLeft: "1px solid #ffffff",
            borderRight: "1px solid #404040",
            borderBottom: "1px solid #404040",
          }}
        >
          <Icon style={{ color: highlight ? "#ffffff" : "#000080", fontSize: "14px" }} />
        </div>
        <div className="min-w-0">
          <p style={{ fontSize: "11px", fontWeight: "bold", color: "#000000", wordBreak: "break-word", whiteSpace: "normal" }}>
            {name}
          </p>
          {renderFilterTags(cardTags)}
        </div>
        {url && !url.endsWith(".pdf") && (
          <div className="absolute bottom-2 right-2" style={{ color: "#808080" }}>
            <FaExternalLinkAlt size={11} aria-label="Open external link" />
          </div>
        )}
      </div>
    )

    return url ? (
      <TooltipWrapper key={name} label={url}>
        <button
          type="button"
          onClick={(event) => {
            if (shouldRevealCardFirst(event.currentTarget)) return
            handleExternalClick(url, true)
          }}
          className="text-left"
        >
          {card}
        </button>
      </TooltipWrapper>
    ) : (
      <div key={name}>{card}</div>
    )
  }

  const tabs = [
    { id: "certifications", label: "Certifications", icon: <FaCertificate /> },
    { id: "skills", label: "Skills", icon: <FaTools /> },
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
    scrollElementIntoViewWithNavbarOffset(target)
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
      <div className="mb-6 animate-fadeInScale" style={{
        background: "#d4d0c8",
        borderTop: "2px solid #ffffff",
        borderLeft: "2px solid #ffffff",
        borderRight: "2px solid #404040",
        borderBottom: "2px solid #404040",
        fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
      }}>
        {/* Win2K title bar */}
        <div className="win-titlebar">
          <span style={{ fontSize: "11px" }}>📁 About — Ethan Townsend</span>
        </div>

        <div className="p-4">
        <div className="mb-4 text-center">
          <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#000080" }}>
            Welcome to My Portfolio
          </h2>
        </div>

        <p className="mt-2 max-w-2xl mx-auto text-center" style={{ fontSize: "11px", color: "#000000" }}>
          I am Ethan Townsend, a Full-Stack Software Engineer with a passion for back-end development.
          <br />
          <br />
          Jump to my{" "}
          <button
            type="button"
            onClick={() => handleJump("about", "certifications")}
            className="inline-flex items-center gap-1"
            style={{ color: "#000080", textDecoration: "underline", fontSize: "11px", background: "transparent", border: "none", cursor: "pointer" }}
          >
            <FaCertificate style={{ fontSize: "11px" }} />
            Certifications
          </button>
          ,{" "}
          <button
            type="button"
            onClick={() => handleJump("about", "skills")}
            className="inline-flex items-center gap-1"
            style={{ color: "#000080", textDecoration: "underline", fontSize: "11px", background: "transparent", border: "none", cursor: "pointer" }}
          >
            <FaTools style={{ fontSize: "11px" }} />
            Skills
          </button>
          ,{" "}
          <button
            type="button"
            onClick={() => handleJump("career", "experience")}
            className="inline-flex items-center gap-1"
            style={{ color: "#000080", textDecoration: "underline", fontSize: "11px", background: "transparent", border: "none", cursor: "pointer" }}
          >
            <FaBriefcase style={{ fontSize: "11px" }} />
            Experience
          </button>
          ,{" "}
          <button
            type="button"
            onClick={() => handleJump("career", "education")}
            className="inline-flex items-center gap-1"
            style={{ color: "#000080", textDecoration: "underline", fontSize: "11px", background: "transparent", border: "none", cursor: "pointer" }}
          >
            <FaGraduationCap style={{ fontSize: "11px" }} />
            Education
          </button>
          , and{" "}
          <button
            type="button"
            onClick={() => handleJump("projects", "projects")}
            className="inline-flex items-center gap-1"
            style={{ color: "#000080", textDecoration: "underline", fontSize: "11px", background: "transparent", border: "none", cursor: "pointer" }}
          >
            <FaFolderOpen style={{ fontSize: "11px" }} />
            Projects
          </button>
          ,{" "}
          <button
            type="button"
            onClick={() => handleJump("projects", "repos")}
            className="inline-flex items-center gap-1"
            style={{ color: "#000080", textDecoration: "underline", fontSize: "11px", background: "transparent", border: "none", cursor: "pointer" }}
          >
            <FaGithub style={{ fontSize: "11px" }} />
            Repositories
          </button>
          .
          <br />
          <br />
        </p>

        <div className="flex justify-center mb-3">
          <PageTabs
            tabs={tabs}
            activeId={activeSubsection}
            onChange={handleAboutTabChange}
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
        id="about-cards"
        className="mt-0 w-full max-w-full overflow-visible"
        style={{ scrollMarginTop: "calc(var(--navbar-height, 6rem) + 1rem)" }}
      >
        {cardsLoading ? (
          <ResponsiveCardSkeletonGrid
            renderCard={(i) => (
              <div
                key={i}
                className="animate-pulse min-h-[120px] p-3"
                style={{
                  background: "#d4d0c8",
                  borderTop: "1px solid #808080",
                  borderLeft: "1px solid #808080",
                  borderRight: "1px solid #ffffff",
                  borderBottom: "1px solid #ffffff",
                }}
              >
                <div className="flex items-start gap-3">
                  <div style={{ width: 32, height: 32, background: "#c0bdb4" }} />
                  <div className="flex-1 space-y-2">
                    <div style={{ height: "10px", background: "#c0bdb4", width: "75%" }} />
                    <div style={{ height: "9px", background: "#c0bdb4", width: "40%" }} />
                  </div>
                </div>
              </div>
            )}
          />
        ) : (
          <div ref={cardsScrollContainerRef} className="w-full max-w-full overflow-x-auto overflow-y-visible overscroll-x-contain snap-x snap-mandatory">
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
