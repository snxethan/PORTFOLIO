"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Sidebar from "./sidebar/Sidebar"
import Navbar from "./Navbar"
import About from "./About"
import Resume from "./Resume"
import Portfolio from "./Portfolio"
import Footer from "./Footer"

/**
 * Main client-side component for the portfolio homepage
 * Manages tab navigation state and handles URL-based navigation
 * Renders the main layout with sidebar and dynamic content area
 */
export default function HomeClient() {
  // State to track the currently active tab (about, resume, portfolio)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Effect to handle tab initialization and URL parameter management
  useEffect(() => {
    const queryTab = searchParams.get("tab")
    const storedTab = localStorage.getItem("activeTab")
    const fallbackTab = "about"

    // Priority: URL query param > localStorage > default tab
    const resolvedTab = queryTab || storedTab || fallbackTab
    setActiveTab(resolvedTab)
    localStorage.setItem("activeTab", resolvedTab)

    // Clean up URL by removing tab parameter after processing
    if (queryTab) router.replace("/", { scroll: false })
  }, [searchParams, router])

  /**
   * Handles tab changes from navigation clicks
   * Updates both local state and localStorage for persistence
   */
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    localStorage.setItem("activeTab", tab)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#121212] to-[#0d0d0d] text-white font-sans">
      {/* Main content area with responsive padding */}
      <main className="flex-grow pt-20 md:pt-0">
        <div className="container mx-auto px-4 pt-15 lg:pt-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar with avatar, social links, and widgets */}
            <Sidebar className="md:mt-20 lg:mt-0"/>
            
            {/* Main content section with navigation and dynamic content */}
            <section className="flex-1 flex flex-col gap-6 pb-20">
              {/* Navigation bar container */}
              <div className="bg-[#222222] rounded-xl border border-[#333333] shadow-lg overflow-hidden">
               {!activeTab ? (
                // Loading skeleton for navigation while tab state is being resolved
                <div className="w-full flex justify-center py-4 animate-pulse space-x-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-20 h-8 bg-[#333333] rounded-lg" />
                  ))}
                </div>
              ) : (
                <Navbar onTabChange={handleTabChange} activeTab={activeTab} />
              )}
              </div>
              
              {/* Dynamic content area that changes based on active tab */}
              <div
                key={activeTab}
                className="bg-[#222222] rounded-xl border border-[#333333] shadow-lg p-6 md:p-8 min-h-[600px] animate-elastic-light"
              >
                 {!activeTab ? (
                    // Loading skeleton for content while tab state is being resolved
                    <div className="w-full h-full space-y-4 animate-pulse">
                      <div className="h-6 w-1/2 bg-[#333333] rounded" />
                      <div className="h-4 w-full bg-[#333333] rounded" />
                      <div className="h-4 w-5/6 bg-[#333333] rounded" />
                      <div className="h-4 w-2/3 bg-[#333333] rounded" />
                    </div>
                  ) : (
                    <>
                      {/* Conditional rendering based on active tab */}
                      {activeTab === "about" && <About />}
                      {activeTab === "resume" && <Resume />}
                      {activeTab === "portfolio" && <Portfolio />}
                    </>
                  )}
                </div>
            </section>
          </div>
        </div>
      </main>
      
      {/* Footer component at the bottom of the page */}
      <Footer />
    </div>
  )
}
