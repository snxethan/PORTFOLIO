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

export default function HomeClient() {
  const [activePage, setActivePage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [isNavPinned, setIsNavPinned] = useState(true)
  const [isNavExpanded, setIsNavExpanded] = useState(false) // true when navbar is in wrap/expanded mode
  const searchParams = useSearchParams()
  const router = useRouter()

  // Valid portfolio subsections (null is also valid for landing page)
  const VALID_SECTIONS = useMemo(() => [null, 'skills', 'certifications', 'education', 'experience', 'projects', 'repos'], [])

  useEffect(() => {
    const pageParam = searchParams.get("page")
    const storedPage = localStorage.getItem("activePage")
    const storedTab = localStorage.getItem("activeSubTab")
    const fallbackPage = "portfolio"
    const fallbackTab = null // No default tab for portfolio landing

    // Parse URL format: ?page=portfolio or ?page=portfolio/projects
    const parts = pageParam?.split("/")
    const mainPage = parts?.[0]
    const subTab = parts?.[1] || null // Can be null for landing page
    
    // Ensure we're in portfolio namespace
    if (mainPage !== 'portfolio') {
      toast.error('Page not found. Redirected to homepage.')
      router.push(`?page=${fallbackPage}`, { scroll: false })
      return
    }
    
    // If subTab is provided but not valid, go to landing page
    if (subTab !== null && !VALID_SECTIONS.includes(subTab)) {
      toast.error('Page not found. Redirected to homepage.')
      router.push(`?page=${fallbackPage}`, { scroll: false })
      return
    }
    
    // Priority: URL params > stored values > fallbacks
    // When pageParam exists, use its values (mainPage and subTab from URL)
    // Only use stored values when there's no URL param at all
    const resolvedPage = pageParam ? mainPage : (storedPage || fallbackPage)
    const resolvedTab = pageParam ? subTab : (storedTab || fallbackTab)
    
    setActivePage(resolvedPage)
    setActiveTab(resolvedTab)
    localStorage.setItem("activePage", resolvedPage)
    if (resolvedTab) {
      localStorage.setItem("activeSubTab", resolvedTab)
    } else {
      localStorage.removeItem("activeSubTab")
    }

    // Update document title based on the resolved page and tab
    const titleMap: { [key: string]: string } = {
      'skills': 'Skills',
      'certifications': 'Certifications',
      'education': 'Education',
      'experience': 'Experience',
      'projects': 'Projects',
      'repos': 'Repositories'
    }

    let title = 'Ethan Townsend | Software Engineer'
    
    if (resolvedPage === 'portfolio') {
      if (resolvedTab && titleMap[resolvedTab]) {
        title = `${titleMap[resolvedTab]} - Ethan Townsend`
      } else {
        title = 'Portfolio - Ethan Townsend'
      }
    }
    
    if (typeof document !== 'undefined') {
      document.title = title
    }
  }, [searchParams, router, VALID_SECTIONS])

  const handleTabChange = (page: string, tab: string | null) => {
    setActivePage(page)
    setActiveTab(tab)
    localStorage.setItem("activePage", page)
    if (tab) {
      localStorage.setItem("activeSubTab", tab)
    } else {
      localStorage.removeItem("activeSubTab")
    }
    
    // Scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: "smooth" })
    
    // Update URL with portfolio namespace
    if (tab) {
      router.push(`?page=${page}/${tab}`, { scroll: false })
    } else {
      router.push(`?page=${page}`, { scroll: false })
    }
  }

 

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#121212] to-[#0d0d0d] text-white font-sans min-w-[360px]">
      {/* Main Page Content - Dynamic padding based on pin state AND layout state */}
      <main className={`flex-grow ${
        isNavPinned 
          ? (isNavExpanded ? 'pt-48' : 'pt-32')  // Pinned: 192px if expanded, 128px if horizontal
          : 'pt-4'  // Unpinned: minimal padding
      }`}>
        <div className="container mx-auto px-4 pt-4 min-w-[360px]">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col gap-6 mb-12 lg:items-center lg:mx-auto lg:w-fit">
              <div className={`lg:sticky ${
                isNavPinned 
                  ? (isNavExpanded ? 'lg:top-52' : 'lg:top-36')  // Pinned: 208px if expanded, 144px if horizontal
                  : 'lg:top-4'  // Unpinned: minimal top position
              }`}>
                <Sidebar className=""/>
              </div>
            
            </div>
            <section className="flex-1 flex flex-col gap-6 pb-20">
              <div className="bg-[#1e1e1e] rounded-xl border border-[#333333] shadow-lg overflow-hidden">
               {activePage == null ? (
                // Skeleton navbar - only show when page is not initialized
                <div className="w-full flex justify-center py-4 animate-pulse space-x-4">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="w-20 h-8 bg-[#333333] rounded-lg" />
                  ))}
                </div>
              ) : (
                <Navbar 
                  onTabChange={handleTabChange} 
                  activePage={activePage} 
                  activeTab={activeTab}
                  onPinChange={setIsNavPinned}
                  onLayoutChange={setIsNavExpanded}
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
                      {activePage === "portfolio" && activeTab === null && <PortfolioLandingPage />}
                      {activePage === "portfolio" && activeTab === "skills" && <SkillsPage />}
                      {activePage === "portfolio" && activeTab === "certifications" && <CertificationsPage />}
                      {activePage === "portfolio" && activeTab === "education" && <EducationPage />}
                      {activePage === "portfolio" && activeTab === "experience" && <ExperiencePage />}
                      {activePage === "portfolio" && activeTab === "projects" && <ProjectsPage />}
                      {activePage === "portfolio" && activeTab === "repos" && <ReposPage />}
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
