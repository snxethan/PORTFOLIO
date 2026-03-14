"use client"

import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "./sidebar/Sidebar"
import Navbar from "./Navbar"
import ExperiencePage from "./portfolio/ExperiencePage"
import EducationPage from "./portfolio/EducationPage"
import ProjectsPage from "./portfolio/ProjectsPage"
import ReposPage from "./portfolio/ReposPage"
import Footer from "./Footer"
import About from "./About"

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

export default function HomeClient() {
  const [activeSection, setActiveSection] = useState<SectionKey>("about")
  const [projectsTab, setProjectsTab] = useState<ProjectsTab>("projects")
  const [careerTab, setCareerTab] = useState<CareerTab>("experience")
  const [aboutSubsection, setAboutSubsection] = useState<string | null>(null)
  const [isNavPinned, setIsNavPinned] = useState(true)
  const [projectsRefreshKey, setProjectsRefreshKey] = useState(0)
  const [careerRefreshKey, setCareerRefreshKey] = useState(0)
  const [aboutRefreshKey, setAboutRefreshKey] = useState(0)

  const observerLockSectionRef = useRef<SectionKey | null>(null)
  const observerLockUntilRef = useRef(0)
  const observerLockCleanupRef = useRef<(() => void) | null>(null)
  const observerLockRafRef = useRef<number | null>(null)
  const observerLockTimeoutRef = useRef<number | null>(null)

  const sectionOrder = useMemo<SectionKey[]>(() => ["about", "projects", "career"], [])

  const pathname = usePathname()
  const lastHandledPathRef = useRef<string | null>(null)

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

  const handlePathSegments = useCallback((segments: string[]) => {
    if (segments.length === 0) return false

    const [section, subsection] = segments

    if (section === "about") {
      if (!subsection) {
        handleNavChange("about")
        return true
      }
      if (subsection === "certifications" || subsection === "skills") {
        handleAboutJump("about", subsection)
        return true
      }
      return false
    }

    if (section === "projects") {
      if (!subsection) {
        handleNavChange("projects")
        return true
      }
      if (subsection === "repos" || subsection === "projects") {
        handleAboutJump("projects", subsection)
        return true
      }
      return false
    }

    if (section === "career") {
      if (!subsection) {
        handleNavChange("career")
        return true
      }
      if (subsection === "experience" || subsection === "education") {
        handleAboutJump("career", subsection)
        return true
      }
      return false
    }

    return false
  }, [handleAboutJump, handleNavChange])

  useEffect(() => {
    if (typeof window === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
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
      { rootMargin: "-30% 0px -55% 0px", threshold: 0.1 }
    )

    sectionOrder.forEach((section) => {
      const target = document.getElementById(SECTION_IDS[section])
      if (target) observer.observe(target)
    })

    return () => observer.disconnect()
  }, [sectionOrder])

  useEffect(() => {
    return () => clearCareerRecenter()
  }, [clearCareerRecenter])

  useEffect(() => {
    return () => clearObserverLock()
  }, [clearObserverLock])

  useEffect(() => {
    if (!pathname || pathname === "/") return
    if (lastHandledPathRef.current === pathname) return

    const segments = pathname
      .split("/")
      .filter(Boolean)
      .map((segment) => {
        try {
          return decodeURIComponent(segment).toLowerCase()
        } catch {
          return segment.toLowerCase()
        }
      })

    lastHandledPathRef.current = pathname
    requestAnimationFrame(() => {
      const didHandlePath = handlePathSegments(segments)
      if (!didHandlePath || window.location.pathname === "/") return

      // Keep deep-link entry behavior, then normalize the address bar back to root.
      window.history.replaceState(null, "", "/")
    })
  }, [handlePathSegments, pathname])

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
        <div className="container mx-auto px-4 pt-4 min-w-[360px]">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col gap-6 mb-12 lg:items-center lg:mx-auto lg:w-fit">
              <div
                className="lg:sticky"
                style={
                  isNavPinned
                    ? { top: "calc(var(--navbar-height, 6rem) + 1rem)" }
                    : { top: "1rem" }
                }
              >
                <Sidebar className="" />
              </div>
            </div>

            <section id="page-content-top" className="flex-1 min-w-0 flex flex-col gap-10 pb-32">
              <div className="rounded-xl overflow-hidden">
                <Navbar
                  onTabChange={(page, tab) => {
                    if (tab !== null && tab !== undefined) {
                      // Sub-tab selected from context menu — jump directly
                      handleAboutJump(page, tab)
                    } else {
                      handleNavChange(page)
                    }
                  }}
                  activePage={activeSection}
                  activeTab={null}
                  onPinChange={setIsNavPinned}
                />
              </div>

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
                  <ProjectsPage onTabChange={handleSectionTabChange} activeTab={projectsTab} key={`projects-${projectsRefreshKey}`} />
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
                {careerTab === "experience" ? (
                  <ExperiencePage
                    onTabChange={handleSectionTabChange}
                    activeTab={careerTab}
                    onContentReady={handleExperienceContentReady}
                    key={`experience-${careerRefreshKey}`}
                  />
                ) : (
                  <EducationPage
                    onTabChange={handleSectionTabChange}
                    activeTab={careerTab}
                    onContentReady={handleEducationContentReady}
                    key={`education-${careerRefreshKey}`}
                  />
                )}
              </section>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
