"use client"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { FaFilePdf, FaExternalLinkAlt, FaCertificate, FaTools, FaCompass } from "react-icons/fa"
import { NAVBAR_ATTENTION_EVENT } from "./Navbar"

import { useExternalLink } from "../ExternalLinkHandler"
import TooltipWrapper from "../ToolTipWrapper"
import MediaModal from "../MediaModal"
import { skills, certifications, Skill, Certification } from "../../data/aboutData"
import SearchFilterBar from "../SearchFilterBar"
import SectionHeader from "../SectionHeader"
import CardCollection from "../CardCollection"
import ResponsiveCardSkeletonGrid from "../ResponsiveCardSkeletonGrid"
import { scrollElementIntoViewWithNavbarOffset, scrollToSectionFilters } from "../../utils/scrollWithNavbarOffset"
import { DATE_AND_NAME_SORT_OPTIONS, SKILL_SORT_OPTIONS } from "../../utils/sortOptions"
import { matchesSelectedTags } from "../../utils/tagFilter"
import { useSectionFilters } from "../../hooks/useSectionFilters"
import { useSectionView } from "../../hooks/useSectionView"

type AboutSubsection = "certifications" | "skills"

const DEFAULT_TAGS = ["Computer Science"]
const DEFAULT_SORT: Record<AboutSubsection, string> = {
  certifications: "newest",
  skills: "hard-soft",
}
const STORAGE_PREFIX: Record<AboutSubsection, string> = {
  certifications: "aboutCertifications",
  skills: "aboutSkills",
}

const tabs = [
  { id: "certifications", label: "Certifications", icon: <FaCertificate /> },
  { id: "skills", label: "Skills", icon: <FaTools /> },
]

const cardClass =
  "group relative flex h-full w-full flex-col overflow-hidden bg-[#151515] hover:bg-[#1c1c1c] p-5 rounded-none border border-[#333333] hover:border-red-600/50 transition-[scale,transform,background-color,border-color,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-600/25"

const cardButtonClass =
  "flex h-full w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"

interface AboutProps {
  onTabChange?: (page: string, tab: string | null) => void
  externalSubsection?: string | null
  onExternalSubsectionConsumed?: () => void
  refreshSignal?: number
}

const About = ({ onTabChange, externalSubsection, onExternalSubsectionConsumed, refreshSignal }: AboutProps) => {
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null)
  const [activeSubsection, setActiveSubsection] = useState<AboutSubsection>("certifications")
  const [cardsLoading, setCardsLoading] = useState(true)
  const { handleExternalClick } = useExternalLink()

  const filters = useSectionFilters(STORAGE_PREFIX[activeSubsection], {
    sort: DEFAULT_SORT[activeSubsection],
    tags: DEFAULT_TAGS,
  })
  const itemCount = activeSubsection === "certifications" ? certifications.length : skills.length
  const { viewMode, setViewMode, autoScroll, setAutoScroll } = useSectionView(activeSubsection, itemCount)

  useEffect(() => {
    if (typeof window === "undefined") return
    const savedTab = localStorage.getItem("aboutActiveTab")
    if (savedTab === "certifications" || savedTab === "skills") {
      setActiveSubsection(savedTab)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("aboutActiveTab", activeSubsection)
  }, [activeSubsection])

  // Respond to external sub-section override (e.g. from navbar context menu)
  useEffect(() => {
    if (externalSubsection === "certifications" || externalSubsection === "skills") {
      setActiveSubsection(externalSubsection)
      onExternalSubsectionConsumed?.()
    }
  }, [externalSubsection, onExternalSubsectionConsumed])

  // Reset content when the same tab is re-clicked (refreshSignal increments)
  const isFirstRender = useRef(true)
  const { reset: resetFilters } = filters
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    resetFilters()
    setCardsLoading(true)
    const rafId = requestAnimationFrame(() => setCardsLoading(false))
    return () => cancelAnimationFrame(rafId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal])

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

  const scrollToCards = () => {
    scrollElementIntoViewWithNavbarOffset(document.getElementById("about-cards"))
  }

  const handleCardTagClick = (event: React.SyntheticEvent<HTMLElement>, tag: string) => {
    event.preventDefault()
    event.stopPropagation()
    filters.focusTag(tag)
    setAutoScroll(false)
    scrollToSectionFilters("about-page-header")
  }

  const renderFilterTags = (tags: string[]) => {
    if (tags.length === 0) return null

    return (
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            role="button"
            tabIndex={0}
            onMouseDown={(event) => {
              event.preventDefault()
              event.stopPropagation()
            }}
            onClick={(event) => handleCardTagClick(event, tag)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                handleCardTagClick(event, tag)
              }
            }}
            className="inline-flex items-center text-xs px-3 py-1 rounded-full whitespace-nowrap transition-[scale,transform,color,background-color,border-color] duration-200 hover:scale-105 border cursor-pointer bg-[#3a3a3a] text-gray-300 border-transparent hover:bg-[#444444] hover:border-red-600 hover:text-[#dc2626]"
          >
            {tag.toUpperCase()}
          </span>
        ))}
      </div>
    )
  }

  const renderCertificationCard = (item: Certification) => {
    const { name, icon: Icon, highlight, url, year } = item
    const card = (
      <div className={cardClass}>
        <div className="flex items-start gap-4 min-w-0">
          <div
            className={`flex-shrink-0 p-3 rounded-lg shadow-lg ${
              highlight ? "bg-gradient-to-br from-red-500/80 to-red-700/80" : "bg-red-600/40 group-hover:bg-red-600/50"
            }`}
          >
            <Icon className="text-white text-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-semibold text-base break-words whitespace-normal group-hover:text-[#dc2626] transition-colors duration-300">
              {name}
            </p>
            {year && <span className="text-gray-400 text-sm">{year}</span>}
          </div>
        </div>
        <div className="mt-4 w-full min-w-0">{renderFilterTags(item.tags ?? [])}</div>
        {url && (
          <div className="mt-auto pt-3 flex justify-end text-gray-400 group-hover:text-[#dc2626] transition-colors duration-300">
            {url.endsWith(".pdf") ? <FaFilePdf size={14} aria-label="View Certification" /> : <FaExternalLinkAlt size={14} aria-label="Open external link" />}
          </div>
        )}
      </div>
    )

    if (!url) return card

    const isPdf = url.endsWith(".pdf")
    return (
      <TooltipWrapper label={isPdf ? "View Certification" : url} url={isPdf ? url : undefined} fullWidth className="flex h-full">
        <button
          type="button"
          onClick={() => (isPdf ? setSelectedPDF(url) : handleExternalClick(url, true))}
          className={cardButtonClass}
        >
          {card}
        </button>
      </TooltipWrapper>
    )
  }

  const renderSkillCard = (item: Skill) => {
    const { name, icon: Icon, hardSkill, url } = item
    const cardTags = Array.from(new Set([hardSkill ? "Hard Skills" : "Soft Skills", ...(item.tags ?? [])]))
    const card = (
      <div className={cardClass}>
        <div className="flex items-start gap-4 min-w-0">
          <div
            className={`flex-shrink-0 p-3 rounded-lg shadow-lg ${
              hardSkill ? "bg-gradient-to-br from-red-500/80 to-red-700/80" : "bg-red-600/40 group-hover:bg-red-600/50"
            }`}
          >
            <Icon className="text-white text-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-semibold text-base break-words whitespace-normal group-hover:text-[#dc2626] transition-colors duration-300">
              {name}
            </p>
          </div>
        </div>
        <div className="mt-4 w-full min-w-0">{renderFilterTags(cardTags)}</div>
        {url && !url.endsWith(".pdf") && (
          <div className="mt-auto pt-3 flex justify-end text-gray-400 group-hover:text-[#dc2626] transition-colors duration-300">
            <FaExternalLinkAlt size={14} aria-label="Open external link" />
          </div>
        )}
      </div>
    )

    if (!url) return card

    return (
      <TooltipWrapper label={url} fullWidth className="flex h-full">
        <button type="button" onClick={() => handleExternalClick(url, true)} className={cardButtonClass}>
          {card}
        </button>
      </TooltipWrapper>
    )
  }

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

  const { search, sortBy, selectedTags, tagMatchMode } = filters

  const sortedCertifications = useMemo(() => {
    const query = search.toLowerCase()
    return certifications
      .filter((cert) =>
        cert.name.toLowerCase().includes(query) &&
        matchesSelectedTags(selectedTags, tagMatchMode, (tag) => Boolean(cert.tags?.includes(tag)))
      )
      .sort((a, b) => {
        if (sortBy === "name-asc") return a.name.localeCompare(b.name)
        if (sortBy === "name-desc") return b.name.localeCompare(a.name)
        if (sortBy === "oldest") return a.year - b.year
        if (sortBy === "newest") return b.year - a.year
        if (a.highlight === b.highlight) return a.name.localeCompare(b.name)
        return a.highlight ? -1 : 1
      })
  }, [search, selectedTags, sortBy, tagMatchMode])

  const sortedSkills = useMemo(() => {
    const query = search.toLowerCase()
    return skills
      .filter((skill) =>
        skill.name.toLowerCase().includes(query) &&
        matchesSelectedTags(selectedTags, tagMatchMode, (tag) =>
          Boolean(skill.tags?.includes(tag)) ||
          (tag === "Hard Skills" && skill.hardSkill === true) ||
          (tag === "Soft Skills" && skill.hardSkill !== true)
        )
      )
      .sort((a, b) => {
        if (sortBy === "name-asc") return a.name.localeCompare(b.name)
        if (sortBy === "name-desc") return b.name.localeCompare(a.name)
        if (a.hardSkill === b.hardSkill) return a.name.localeCompare(b.name)
        if (sortBy === "soft-hard") return a.hardSkill ? 1 : -1
        return a.hardSkill ? -1 : 1
      })
  }, [search, selectedTags, sortBy, tagMatchMode])

  const resultsText = activeSubsection === "certifications"
    ? `Showing ${sortedCertifications.length} Certification${sortedCertifications.length !== 1 ? "s" : ""}`
    : `Showing ${sortedSkills.length} Skill${sortedSkills.length !== 1 ? "s" : ""}`

  const handleAboutTabChange = (tab: string | null) => {
    const nextTab = tab === "skills" ? "skills" : "certifications"
    // Always call parent — HomeClient detects same-tab re-clicks and increments the refresh key
    onTabChange?.("about", nextTab)
    // Also update internal state immediately so the switch is instant
    setActiveSubsection(nextTab)
    requestAnimationFrame(scrollToCards)
  }

  // Points visitors at the navbar instead of listing every section here.
  // Hovering or clicking "navigation bar" makes the navbar bounce in place;
  // a click also brings it into view if it is off-screen.
  const callNavbarAttention = (scrollToNavbar: boolean) => {
    window.dispatchEvent(new CustomEvent(NAVBAR_ATTENTION_EVENT))
    if (!scrollToNavbar) return
    const nav = document.querySelector("nav[aria-label='Main navigation']")
    const rect = nav?.getBoundingClientRect()
    if (nav && rect && (rect.bottom < 0 || rect.top > window.innerHeight)) {
      nav.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  const intro = (
    <p className="text-gray-300 max-w-2xl mx-auto text-center mb-6">
      I am Ethan Townsend, a Full-Stack Software Engineer with a passion for back-end development.
      <br />
      <br />
      Use the{" "}
      <button
        type="button"
        onMouseEnter={() => callNavbarAttention(false)}
        onFocus={() => callNavbarAttention(false)}
        onClick={() => callNavbarAttention(true)}
        className="inline-flex items-center gap-1 font-medium text-red-500 underline decoration-red-500/40 decoration-2 underline-offset-4 transition-colors duration-200 hover:text-red-400 hover:decoration-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-sm"
      >
        <FaCompass className="text-base" aria-hidden="true" />
        navigation bar
      </button>{" "}
      to explore my certifications, skills, projects, and career.
    </p>
  )

  return (
    <>
      <div className="animate-fadeInScale">
        <SectionHeader
          id="about-page-header"
          title="Welcome to My Portfolio"
          intro={intro}
          description="Quick highlights of my certifications and technical skillset."
          tabs={tabs}
          activeTabId={activeSubsection}
          onTabChange={handleAboutTabChange}
          resultsText={resultsText}
        >
          <SearchFilterBar
            search={filters.search}
            setSearch={filters.setSearch}
            placeholder={`Search ${activeSubsection} by name or tags...`}
            tags={tagOptions}
            selectedTags={filters.selectedTags}
            setSelectedTags={filters.setSelectedTags}
            tagMatchMode={filters.tagMatchMode}
            setTagMatchMode={filters.setTagMatchMode}
            sortOptions={activeSubsection === "certifications" ? DATE_AND_NAME_SORT_OPTIONS : SKILL_SORT_OPTIONS}
            selectedSort={filters.sortBy}
            setSelectedSort={filters.setSortBy}
            showTagsMenu={filters.showTagsMenu}
            setShowTagsMenu={filters.setShowTagsMenu}
            showFilterMenu={filters.showFilterMenu}
            setShowFilterMenu={filters.setShowFilterMenu}
            defaultSort={DEFAULT_SORT[activeSubsection]}
            onFilterInteraction={scrollToCards}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            autoScroll={autoScroll}
            onAutoScrollChange={setAutoScroll}
          />
        </SectionHeader>
      </div>

      <div
        id="about-cards"
        className="mt-0 w-full max-w-full overflow-visible"
        style={{ scrollMarginTop: "calc(var(--navbar-height, 0px) + 1rem)" }}
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
          <div key={`about-loaded-${activeSubsection}-${refreshSignal ?? 0}`} className="animate-skeleton-pop">
            {activeSubsection === "certifications" ? (
              <CardCollection
                items={sortedCertifications}
                getKey={(cert) => `${cert.name}-${cert.year}`}
                viewMode={viewMode}
                autoScroll={autoScroll}
                size="compact"
                label="Certifications"
                renderCard={renderCertificationCard}
              />
            ) : (
              <CardCollection
                items={sortedSkills}
                getKey={(skill) => skill.name}
                viewMode={viewMode}
                autoScroll={autoScroll}
                size="compact"
                label="Skills"
                renderCard={renderSkillCard}
              />
            )}
          </div>
        )}
      </div>

      <MediaModal src={selectedPDF} kind="pdf" alt="Certification" onClose={() => setSelectedPDF(null)} />
    </>
  )
}

export default About
