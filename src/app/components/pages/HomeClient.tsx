"use client"

import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "./sidebar/Sidebar"
import Navbar from "./Navbar"
import CareerPage from "./portfolio/CareerPage"
import ProjectsPage from "./portfolio/ProjectsPage"
import ReposPage from "./portfolio/ReposPage"
import Footer from "./Footer"
import About from "./About"
import ProjectDetailModal from "../projects/ProjectDetailModal"
import { findProjectBySlug } from "../../data/projectsTimelineData"

const SECTION_IDS = {
  about: "section-about",
  projects: "section-projects",
  career: "section-career",
} as const

const CONTENT_IDS = {
  about: "about-cards",
  projects: {
    projects: "projects-cards",
    repos: "repositories-cards",
  },
  career: {
    experience: "experience-cards",
    education: "education-cards",
  },
} as const

type SectionKey = keyof typeof SECTION_IDS

type ProjectsTab = "projects" | "repos"

type CareerTab = "experience" | "education"

const parsePathSegments = (path: string) =>
  path
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment).toLowerCase()
      } catch {
        return segment.toLowerCase()
      }
    })

/** `/projects/<slug>` for a real project: that project's detail popup is open. */
const getProjectSlugFromPath = (path: string | null) => {
  if (!path) return null
  const [section, subsection] = parsePathSegments(path)
  return section === "projects" && findProjectBySlug(subsection) ? subsection : null
}

export default function HomeClient() {
  const [activeSection, setActiveSection] = useState<SectionKey>("about")
  const [projectsTab, setProjectsTab] = useState<ProjectsTab>("projects")
  const [careerTab, setCareerTab] = useState<CareerTab>("experience")
  const [aboutSubsection, setAboutSubsection] = useState<string | null>(null)
  const [isNavPinned, setIsNavPinned] = useState(true)
  const [projectsRefreshKey, setProjectsRefreshKey] = useState(0)
  const [careerRefreshKey, setCareerRefreshKey] = useState(0)
  const [aboutRefreshKey, setAboutRefreshKey] = useState(0)
  const [hasScrolledOnce, setHasScrolledOnce] = useState(false)
  const leftColumnRef = useRef<HTMLDivElement>(null)

  const observerLockSectionRef = useRef<SectionKey | null>(null)
  const observerLockUntilRef = useRef(0)
  const observerLockCleanupRef = useRef<(() => void) | null>(null)
  const observerLockRafRef = useRef<number | null>(null)
  const observerLockTimeoutRef = useRef<number | null>(null)
  const userNavigatedToCareerRef = useRef(false)

  const sectionOrder = useMemo<SectionKey[]>(() => ["about", "projects", "career"], [])

  const pathname = usePathname()
  const lastHandledPathRef = useRef<string | null>(null)
  const openedProjectWithPushRef = useRef(false)
  const openProjectSlug = getProjectSlugFromPath(pathname)

  const getSectionTop = useCallback((section: SectionKey) => {
    if (typeof window === "undefined") return null
    const target = document.getElementById(SECTION_IDS[section])
    if (!target) return null

    const navbarHeightVar = getComputedStyle(document.documentElement)
      .getPropertyValue("--navbar-height")
      .trim()
    const navbarHeight = navbarHeightVar.endsWith("rem")
      ? parseFloat(navbarHeightVar) * 16
      : parseFloat(navbarHeightVar)
    const navOffset = isNavPinned && Number.isFinite(navbarHeight) && navbarHeight > 0
      ? navbarHeight + 16
      : 16

    const rawTop = target.getBoundingClientRect().top + window.scrollY
    return Math.max(0, rawTop - navOffset)
  }, [isNavPinned])

  const clearObserverLock = useCallback(() => {
    observerLockUntilRef.current = 0
    observerLockSectionRef.current = null

    if (observerLockRafRef.current) {
      cancelAnimationFrame(observerLockRafRef.current)
      observerLockRafRef.current = null
    }
    if (observerLockTimeoutRef.current) {
      window.clearTimeout(observerLockTimeoutRef.current)
      observerLockTimeoutRef.current = null
    }

    if (observerLockCleanupRef.current) {
      observerLockCleanupRef.current()
      observerLockCleanupRef.current = null
    }
  }, [])

  const lockObserverToSection = useCallback((section: SectionKey) => {
    if (typeof window === "undefined") return

    clearObserverLock()
    observerLockSectionRef.current = section
    observerLockUntilRef.current = Date.now() + 1800
    setActiveSection(section)

    const unlockOnManualScroll = () => {
      clearObserverLock()
    }

    const unlockOnKeydown = (event: KeyboardEvent) => {
      const cancelKeys = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "])
      if (cancelKeys.has(event.key)) {
        clearObserverLock()
      }
    }

    window.addEventListener("wheel", unlockOnManualScroll, { passive: true })
    window.addEventListener("touchmove", unlockOnManualScroll, { passive: true })
    window.addEventListener("pointerdown", unlockOnManualScroll, { passive: true })
    window.addEventListener("keydown", unlockOnKeydown)

    observerLockCleanupRef.current = () => {
      window.removeEventListener("wheel", unlockOnManualScroll)
      window.removeEventListener("touchmove", unlockOnManualScroll)
      window.removeEventListener("pointerdown", unlockOnManualScroll)
      window.removeEventListener("keydown", unlockOnKeydown)
    }

    const tick = () => {
      const expiresAt = observerLockUntilRef.current
      const targetSection = observerLockSectionRef.current
      if (!targetSection || !expiresAt) return

      if (Date.now() > expiresAt) {
        clearObserverLock()
        return
      }

      const targetTop = getSectionTop(targetSection)
      if (targetTop !== null && Math.abs(window.scrollY - targetTop) < 24) {
        clearObserverLock()
        return
      }

      observerLockRafRef.current = requestAnimationFrame(tick)
    }

    observerLockRafRef.current = requestAnimationFrame(tick)
    observerLockTimeoutRef.current = window.setTimeout(clearObserverLock, 1850)
  }, [clearObserverLock, getSectionTop])

  const scrollToSection = useCallback((section: SectionKey) => {
    if (typeof window === "undefined") return
    const top = getSectionTop(section)
    if (top === null) return

    window.scrollTo({ top, behavior: "smooth" })
  }, [getSectionTop])

  const getContentTop = useCallback((targetId: string, align: "top" | "center" = "top") => {
    const target = document.getElementById(targetId)
    if (!target) return null

    const navbarHeightVar = getComputedStyle(document.documentElement)
      .getPropertyValue("--navbar-height")
      .trim()
    const navbarHeight = navbarHeightVar.endsWith("rem")
      ? parseFloat(navbarHeightVar) * 16
      : parseFloat(navbarHeightVar)
    const navOffset = isNavPinned && Number.isFinite(navbarHeight) && navbarHeight > 0
      ? navbarHeight + 16
      : 16

    const targetRect = target.getBoundingClientRect()
    const rawTop = targetRect.top + window.scrollY
    const computedTop = align === "center"
      ? rawTop - Math.max(navOffset, (window.innerHeight - targetRect.height) / 2)
      : rawTop - navOffset

    return Math.max(0, computedTop)
  }, [isNavPinned])

  const scrollToContentId = useCallback((
    targetId: string,
    align: "top" | "center" = "top",
    behavior: ScrollBehavior = "smooth"
  ) => {
    if (typeof window === "undefined") return

    const tryScroll = (attempt: number) => {
      const top = getContentTop(targetId, align)
      if (top === null) {
        if (attempt < 8) {
          requestAnimationFrame(() => tryScroll(attempt + 1))
        }
        return
      }

      window.scrollTo({ top, behavior })
    }

    requestAnimationFrame(() => tryScroll(0))
  }, [getContentTop])

  const continueScrollToContentCenter = useCallback((targetId: string) => {
    if (typeof window === "undefined") return

    const targetTop = getContentTop(targetId, "center")
    if (targetTop === null) return

    const behavior: ScrollBehavior = targetTop > window.scrollY + 2 ? "smooth" : "auto"
    window.scrollTo({ top: targetTop, behavior })
  }, [getContentTop])

  const careerRecenterCleanupRef = useRef<(() => void) | null>(null)

  const clearCareerRecenter = useCallback(() => {
    if (careerRecenterCleanupRef.current) {
      careerRecenterCleanupRef.current()
      careerRecenterCleanupRef.current = null
    }
  }, [])

  const scheduleCareerRecenter = useCallback((targetId: string) => {
    if (typeof window === "undefined") return
    clearCareerRecenter()

    let rafId = 0
    let timeoutId = 0
    let secondTimeoutId = 0
    let resizeObserver: ResizeObserver | null = null
    let isCancelled = false
    const startTime = Date.now()
    const minRunMs = 900

    const cancelOnKey = (event: KeyboardEvent) => {
      const cancelKeys = new Set([
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
      ])
      if (!cancelKeys.has(event.key)) return
      cleanup()
    }

    const cancelOnUserIntent = () => {
      cleanup()
    }

    const cleanup = () => {
      if (isCancelled) return
      isCancelled = true

      if (rafId) cancelAnimationFrame(rafId)
      if (timeoutId) window.clearTimeout(timeoutId)
      if (secondTimeoutId) window.clearTimeout(secondTimeoutId)
      resizeObserver?.disconnect()
      resizeObserver = null

      window.removeEventListener("wheel", cancelOnUserIntent)
      window.removeEventListener("touchmove", cancelOnUserIntent)
      window.removeEventListener("pointerdown", cancelOnUserIntent)
      window.removeEventListener("keydown", cancelOnKey)

      careerRecenterCleanupRef.current = null
    }

    window.addEventListener("wheel", cancelOnUserIntent, { passive: true })
    window.addEventListener("touchmove", cancelOnUserIntent, { passive: true })
    window.addEventListener("pointerdown", cancelOnUserIntent, { passive: true })
    window.addEventListener("keydown", cancelOnKey)

    const recenterNow = () => {
      if (isCancelled) return
      continueScrollToContentCenter(targetId)
    }

    const begin = () => {
      const target = document.getElementById(targetId)
      if (!target) {
        rafId = requestAnimationFrame(begin)
        return
      }

      let lastHeight = target.getBoundingClientRect().height
      let lastDocHeight = document.documentElement.scrollHeight
      let stableFrames = 0

      // Delayed corrections catch skeleton -> content swaps.
      timeoutId = window.setTimeout(recenterNow, 560)
      secondTimeoutId = window.setTimeout(recenterNow, 980)

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          stableFrames = 0
          recenterNow()
        })
        resizeObserver.observe(target)
      }

      const tick = () => {
        if (isCancelled) return

        if (Date.now() - startTime > 1800) {
          cleanup()
          return
        }

        const currentTarget = document.getElementById(targetId)
        if (!currentTarget) {
          rafId = requestAnimationFrame(tick)
          return
        }

        const rect = currentTarget.getBoundingClientRect()
        const currentHeight = rect.height
        const currentDocHeight = document.documentElement.scrollHeight

        const heightChanged = Math.abs(currentHeight - lastHeight) > 1
        const docHeightChanged = currentDocHeight !== lastDocHeight

        if (heightChanged || docHeightChanged) {
          lastHeight = currentHeight
          lastDocHeight = currentDocHeight
          stableFrames = 0
          recenterNow()
        } else {
          stableFrames += 1
        }

        const elapsed = Date.now() - startTime
        if (stableFrames >= 10 && elapsed >= minRunMs) {
          cleanup()
          return
        }

        rafId = requestAnimationFrame(tick)
      }

      rafId = requestAnimationFrame(tick)
    }

    careerRecenterCleanupRef.current = cleanup
    begin()
  }, [clearCareerRecenter, continueScrollToContentCenter])

  const handleCareerContentReady = useCallback((targetId: string) => {
    if (activeSection !== "career") return
    // Only auto-scroll if the user explicitly navigated to career, not from observer-driven updates on load
    if (!userNavigatedToCareerRef.current) return

    continueScrollToContentCenter(targetId)
    scheduleCareerRecenter(targetId)
  }, [activeSection, continueScrollToContentCenter, scheduleCareerRecenter])

  const handleExperienceContentReady = useCallback(() => {
    handleCareerContentReady(CONTENT_IDS.career.experience)
  }, [handleCareerContentReady])

  const handleEducationContentReady = useCallback(() => {
    handleCareerContentReady(CONTENT_IDS.career.education)
  }, [handleCareerContentReady])

  const handleNavChange = useCallback((page: string) => {
    const section = sectionOrder.find((item) => item === page) ?? "about"
    if (section === "career") userNavigatedToCareerRef.current = true
    lockObserverToSection(section)
    requestAnimationFrame(() => scrollToSection(section))
  }, [lockObserverToSection, scrollToSection, sectionOrder])

  const handleSectionTabChange = useCallback((page: string, tab: string | null) => {
    if (page === "projects" && tab) {
      const nextTab = tab === "repos" ? "repos" : "projects"
      setProjectsTab((prev) => {
        if (prev === nextTab) setProjectsRefreshKey((k) => k + 1)
        return nextTab
      })
      setActiveSection("projects")
      scrollToContentId(CONTENT_IDS.projects[nextTab], "top")
      return
    }
    if (page === "career" && tab) {
      const nextTab = tab === "education" ? "education" : "experience"
      userNavigatedToCareerRef.current = true
      setCareerTab((prev) => {
        if (prev === nextTab) setCareerRefreshKey((k) => k + 1)
        return nextTab
      })
      setActiveSection("career")
      scrollToContentId(CONTENT_IDS.career[nextTab], "center")
      scheduleCareerRecenter(CONTENT_IDS.career[nextTab])
      return
    }
    if (page === "about") {
      if (tab === "certifications" || tab === "skills") {
        setAboutSubsection((prev) => {
          if (prev === tab) setAboutRefreshKey((k) => k + 1)
          return tab
        })
      }
      setActiveSection("about")
      scrollToContentId(CONTENT_IDS.about, "top")
    }
  }, [scheduleCareerRecenter, scrollToContentId])

  const handleAboutJump = useCallback((page: string, tab: string | null) => {
    handleSectionTabChange(page, tab)
    const section = page === "projects" ? "projects" : page === "career" ? "career" : "about"
    lockObserverToSection(section)
    requestAnimationFrame(() => scrollToSection(section))
  }, [handleSectionTabChange, lockObserverToSection, scrollToSection])

  const handleNavbarTabChange = useCallback((page: string, tab: string | null) => {
    if (tab !== null && tab !== undefined) {
      const section = page === "projects" ? "projects" : page === "career" ? "career" : "about"
      lockObserverToSection(section)
      handleSectionTabChange(page, tab)
      return
    }

    handleNavChange(page)
  }, [handleNavChange, handleSectionTabChange, lockObserverToSection])

  const handlePathSegments = useCallback((segments: string[]) => {
    if (segments.length === 0) return

    const [section, subsection] = segments

    if (section === "about") {
      if (subsection === "certifications" || subsection === "skills") {
        handleAboutJump("about", subsection)
        return
      }
      handleNavChange("about")
      return
    }

    if (section === "projects") {
      if (subsection === "repos" || subsection === "projects") {
        handleAboutJump("projects", subsection)
        return
      }
      // A project link: show the projects list behind its popup.
      if (findProjectBySlug(subsection)) {
        handleAboutJump("projects", "projects")
        return
      }
      handleNavChange("projects")
      return
    }

    if (section === "career") {
      if (subsection === "experience" || subsection === "education") {
        handleAboutJump("career", subsection)
        return
      }
      handleNavChange("career")
    }
  }, [handleAboutJump, handleNavChange])

  useEffect(() => {
    if (typeof window === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          // Each layout variant renders its own copy of the sections and the
          // inactive one collapses to zero height; ignore it so a hidden
          // section cannot claim the active nav item.
          if (entry.boundingClientRect.height === 0) return
          const section = entry.target.getAttribute("data-section") as SectionKey | null
          if (section) {
            if (observerLockSectionRef.current && Date.now() < observerLockUntilRef.current) {
              setActiveSection(observerLockSectionRef.current)
              return
            }
            setActiveSection(section)
          }
        })
      },
      // threshold must stay 0: rootMargin leaves a band only ~15% of the
      // viewport tall, so a section taller than ~1.5 viewports can never put
      // 10% of itself inside it. On mobile that silently broke the nav for
      // the tallest sections (projects measured a 0.097 ceiling against a
      // 0.1 threshold). Any overlap with the band is the signal we want.
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    )

    sectionOrder.forEach((section) => {
      // Observe every copy rather than getElementById's first match: the ids
      // are duplicated across layout variants, so the first match can be the
      // hidden one, which would never intersect.
      document
        .querySelectorAll(`[data-section="${section}"]`)
        .forEach((target) => observer.observe(target))
    })

    return () => observer.disconnect()
  }, [sectionOrder])

  useEffect(() => {
    return () => clearCareerRecenter()
  }, [clearCareerRecenter])

  useEffect(() => {
    return () => clearObserverLock()
  }, [clearObserverLock])

  // Navbar hover popups only start once the visitor has scrolled a little, so
  // they don't pop open while the pointer rests on the nav at page load.
  useEffect(() => {
    if (typeof window === "undefined" || hasScrolledOnce) return

    const onScroll = () => {
      if (window.scrollY > 48) setHasScrolledOnce(true)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [hasScrolledOnce])

  // The left column (sidebar + unpinned nav) is sticky on desktop. When it is
  // taller than the window, a plain `top` would hide its bottom (the nav)
  // forever, so CSS min() sticks it by its bottom edge instead; that needs
  // the column's height, kept here as a CSS variable.
  useEffect(() => {
    const column = leftColumnRef.current
    if (!column) return

    const update = () => {
      column.style.setProperty("--left-column-height", `${column.offsetHeight}px`)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(column)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!pathname) return
    if (lastHandledPathRef.current === pathname) return

    const previousPath = lastHandledPathRef.current
    lastHandledPathRef.current = pathname

    // Leaving a project popup (close button or browser Back) returns to where
    // the visitor already was; it must not scroll the page anywhere.
    if (getProjectSlugFromPath(previousPath)) return
    if (pathname === "/") return

    const segments = parsePathSegments(pathname)
    requestAnimationFrame(() => handlePathSegments(segments))
  }, [handlePathSegments, pathname])

  // The project popup lives at /projects/<slug> so it can be linked to, but
  // opening it only changes the URL; the page never navigates.
  const openProject = useCallback((slug: string) => {
    const path = `/projects/${slug}`
    lastHandledPathRef.current = path
    openedProjectWithPushRef.current = true
    window.history.pushState(null, "", path)
  }, [])

  const closeProject = useCallback(() => {
    if (openedProjectWithPushRef.current) {
      openedProjectWithPushRef.current = false
      window.history.back()
      return
    }
    // Arrived on the project link directly: there is no page to go back to.
    window.history.replaceState(null, "", "/projects")
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#121212] to-[#0d0d0d] text-white font-sans min-w-[360px]">
      <main
        className="flex-grow"
        style={
          isNavPinned
            ? { paddingTop: "calc(var(--navbar-height, 6rem) + 1rem)" }
            : { paddingTop: "1rem" }
        }
      >
        <div className="container mx-auto px-4 lg:px-3 xl:px-2 pt-4 min-w-[360px]">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile spacing matches the old layout exactly: 7rem from the
                sidebar to the unpinned nav, 2.5rem from the nav to About. */}
            <div className={`flex flex-col lg:items-center lg:mx-auto lg:w-fit ${isNavPinned ? "mb-12" : "mb-2 lg:mb-12"}`}>
              <div
                ref={leftColumnRef}
                className="flex flex-col lg:sticky lg:z-40"
                style={{
                  top: "min(calc(var(--navbar-height, 0px) + 1rem), calc(100vh - var(--left-column-height, 0px) - 1rem))",
                }}
              >
                <Sidebar className="" />
                {/* Pinned, the navbar is position: fixed and this wrapper is
                    empty; unpinned, it is its own box under the sidebar. */}
                <div className={isNavPinned ? "" : "mt-20 lg:mt-6"}>
                  <Navbar
                    onTabChange={handleNavbarTabChange}
                    activePage={activeSection}
                    activeTab={null}
                    onPinChange={setIsNavPinned}
                    enableHoverPopups={hasScrolledOnce}
                  />
                </div>
              </div>
            </div>

            <section
              id="page-content-top"
              className="flex-1 min-w-0 flex flex-col gap-10 pb-32"
            >
              <section
                id={SECTION_IDS.about}
                data-section="about"
                className="flex flex-col gap-6 pb-8"
                style={{
                  scrollMarginTop: isNavPinned
                    ? "calc(var(--navbar-height, 6rem) + 1rem)"
                    : "1rem",
                }}
              >
                <About onTabChange={handleAboutJump} externalSubsection={aboutSubsection} onExternalSubsectionConsumed={() => setAboutSubsection(null)} refreshSignal={aboutRefreshKey} />
              </section>

              <section
                id={SECTION_IDS.projects}
                data-section="projects"
                className="flex flex-col gap-6 pb-8"
                style={{
                  scrollMarginTop: isNavPinned
                    ? "calc(var(--navbar-height, 6rem) + 1rem)"
                    : "1rem",
                }}
              >
                {projectsTab === "projects" ? (
                  <ProjectsPage
                    onTabChange={handleSectionTabChange}
                    activeTab={projectsTab}
                    onOpenProject={openProject}
                    key={`projects-${projectsRefreshKey}`}
                  />
                ) : (
                  <ReposPage onTabChange={handleSectionTabChange} activeTab={projectsTab} key={`repos-${projectsRefreshKey}`} />
                )}
              </section>

              <section
                id={SECTION_IDS.career}
                data-section="career"
                className="flex flex-col gap-6 pb-12"
                style={{
                  scrollMarginTop: isNavPinned
                    ? "calc(var(--navbar-height, 6rem) + 1rem)"
                    : "1rem",
                }}
              >
                <CareerPage
                  kind={careerTab}
                  onTabChange={handleSectionTabChange}
                  onContentReady={careerTab === "experience" ? handleExperienceContentReady : handleEducationContentReady}
                  key={`${careerTab}-${careerRefreshKey}`}
                />
              </section>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <ProjectDetailModal project={findProjectBySlug(openProjectSlug)} onClose={closeProject} />
    </div>
  )
}
