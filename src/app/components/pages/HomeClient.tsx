"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import Sidebar from "./sidebar/Sidebar"
import Navbar from "./Navbar"
import SkillsPage from "./portfolio/SkillsPage"
import CertificationsPage from "./portfolio/CertificationsPage"
import EducationPage from "./portfolio/EducationPage"
import ExperiencePage from "./portfolio/ExperiencePage"
import ProjectsPage from "./portfolio/ProjectsPage"
import ReposPage from "./portfolio/ReposPage"
import PortfolioLandingPage from "./portfolio/PortfolioLandingPage"
import Footer from "./Footer"
import { getTimedItem, setTimedItem, removeTimedItem } from "../../utils/timedStorage"

export default function HomeClient() {
  const [activePage, setActivePage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [isNavPinned, setIsNavPinned] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()

  const VALID_PAGES = useMemo(() => ["about", "career", "projects"], [])
  const DEFAULT_TABS = useMemo<Record<string, string | null>>(() => ({
    about: null,
    career: "experience",
    projects: "projects",
  }), [])
  const VALID_TABS = useMemo<Record<string, Array<string | null>>>(() => ({
    about: [null, "certifications", "skills"],
    career: ["experience", "education"],
    projects: ["projects", "repos"],
  }), [])

  useEffect(() => {
    const pageParam = searchParams.get("page")
    const storedPage = localStorage.getItem("activePage")
    const storedTab = getTimedItem<string>("activeSubTab")
    const fallbackPage = "about"
    const fallbackTab = DEFAULT_TABS.about

    const resolveFromUrl = () => {
      const parts = pageParam?.split("/")
      const mainPage = parts?.[0]
      const subTab = parts?.[1] || null

      if (!mainPage || !VALID_PAGES.includes(mainPage)) {
        toast.error("Page not found. Redirected to About.")
        router.push(`?page=${fallbackPage}`, { scroll: false })
        return null
      }

      const defaultTab = DEFAULT_TABS[mainPage as keyof typeof DEFAULT_TABS]
      const resolvedTab = subTab ?? defaultTab
      const validTabs = VALID_TABS[mainPage as keyof typeof VALID_TABS]
      const isValidTab = validTabs.includes(resolvedTab)

      if (!isValidTab) {
        const target = defaultTab ? `?page=${mainPage}/${defaultTab}` : `?page=${mainPage}`
        toast.error("Page not found. Redirected to About.")
        router.push(target, { scroll: false })
        return null
      }

      return { page: mainPage, tab: resolvedTab }
    }

    let resolvedPage = fallbackPage
    let resolvedTab = fallbackTab

    if (pageParam) {
      const resolved = resolveFromUrl()
      if (!resolved) return
      resolvedPage = resolved.page
      resolvedTab = resolved.tab
    } else {
      const candidatePage = storedPage && VALID_PAGES.includes(storedPage)
        ? storedPage
        : fallbackPage
      const defaultTab = DEFAULT_TABS[candidatePage as keyof typeof DEFAULT_TABS]
      const validTabs = VALID_TABS[candidatePage as keyof typeof VALID_TABS]
      let candidateTab = storedTab ?? defaultTab

      if (candidateTab === null && candidatePage !== "about") {
        candidateTab = defaultTab
      }
      if (candidateTab !== null && !validTabs.includes(candidateTab)) {
        candidateTab = defaultTab
      }

      resolvedPage = candidatePage
      resolvedTab = candidateTab
    }

    setActivePage(resolvedPage)
    setActiveTab(resolvedTab)
    localStorage.setItem("activePage", resolvedPage)
    if (resolvedTab) {
      setTimedItem("activeSubTab", resolvedTab, 10 * 60 * 1000)
    } else {
      removeTimedItem("activeSubTab")
    }
  }, [searchParams, router, VALID_PAGES, VALID_TABS, DEFAULT_TABS])

  const handleTabChange = (page: string, tab: string | null) => {
    setActivePage(page)
    setActiveTab(tab)
    localStorage.setItem("activePage", page)
    if (tab) {
      setTimedItem("activeSubTab", tab, 10 * 60 * 1000)
    } else {
      removeTimedItem("activeSubTab")
    }

    // Scroll to the very top when changing tabs
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    })

    // Update URL with the new page namespace
    if (tab) {
      router.push(`?page=${page}/${tab}`, { scroll: false })
    } else {
      router.push(`?page=${page}`, { scroll: false })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#121212] to-[#0d0d0d] text-white font-sans min-w-[360px]">
      {/* Main Page Content - Dynamic padding based on pin state AND layout state */}
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
                <Sidebar className=""/>
              </div>
            
            </div>
            <section className="flex-1 flex flex-col gap-6 pb-20">
              <div className="rounded-xl overflow-hidden">
               {activePage == null ? (
                // Skeleton navbar - only show when page is not initialized
                <div className="w-full flex justify-center py-4 animate-pulse space-x-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-24 h-9 bg-[#333333] rounded-lg" />
                  ))}
                </div>
              ) : (
                <Navbar 
                  onTabChange={handleTabChange} 
                  activePage={activePage} 
                  activeTab={activeTab}
                  onPinChange={setIsNavPinned}
                />
              )}
              </div>
                <div
                  key={`${activePage}/${activeTab}`}
                  className="flex-1 transition-all duration-500 ease-in-out"
                >
                 {activePage == null ? (
                    // Skeleton content - only show when page is not initialized
                    <div className="w-full h-full space-y-4 animate-pulse">
                      <div className="h-6 w-1/2 bg-[#333333] rounded" />
                      <div className="h-4 w-full bg-[#333333] rounded" />
                      <div className="h-4 w-5/6 bg-[#333333] rounded" />
                      <div className="h-4 w-2/3 bg-[#333333] rounded" />
                    </div>
                  ) : (
                    <>
                      {activePage === "about" && activeTab === null && (
                        <PortfolioLandingPage onTabChange={handleTabChange} activeTab={activeTab} />
                      )}
                      {activePage === "about" && activeTab === "certifications" && (
                        <CertificationsPage onTabChange={handleTabChange} activeTab={activeTab} />
                      )}
                      {activePage === "about" && activeTab === "skills" && (
                        <SkillsPage onTabChange={handleTabChange} activeTab={activeTab} />
                      )}
                      {activePage === "career" && activeTab === "experience" && (
                        <ExperiencePage onTabChange={handleTabChange} activeTab={activeTab} />
                      )}
                      {activePage === "career" && activeTab === "education" && (
                        <EducationPage onTabChange={handleTabChange} activeTab={activeTab} />
                      )}
                      {activePage === "projects" && activeTab === "projects" && (
                        <ProjectsPage onTabChange={handleTabChange} activeTab={activeTab} />
                      )}
                      {activePage === "projects" && activeTab === "repos" && (
                        <ReposPage onTabChange={handleTabChange} activeTab={activeTab} />
                      )}
                    </>
                  )}

                </div>

            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
