"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Sidebar from "./sidebar/Sidebar"
import Navbar from "./Navbar"
import About from "./About"
import Resume from "./Resume"
import Portfolio from "./Portfolio"
import Footer from "./Footer"

export default function HomeClient() {
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const pageParam = searchParams.get("page")
    const tabParam = searchParams.get("tab")
    const storedTab = localStorage.getItem("activeTab")
    const fallbackTab = "about"

    // Parse new URL format: ?page=about/certifications
    const parts = pageParam?.split("/")
    const mainPage = parts?.[0] || pageParam
    
    // Priority: main page from URL > tab param > stored tab > fallback
    const resolvedTab = mainPage || tabParam || storedTab || fallbackTab
    setActiveTab(resolvedTab)
    localStorage.setItem("activeTab", resolvedTab)

    // Don't clear URL params anymore - let child components manage their own tab params
  }, [searchParams])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    localStorage.setItem("activeTab", tab)
    
    // Update URL with new format: ?page=about (child components will add /subtab if needed)
    router.push(`?page=${tab}`, { scroll: false })
  }

 

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#121212] to-[#0d0d0d] text-white font-sans min-w-[360px]">
      {/* Main Page Content */}
      <main className="flex-grow pt-20 md:pt-0">
        <div className="container mx-auto px-4 pt-15 lg:pt-12 min-w-[360px]">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col gap-6 mb-12 lg:items-center lg:mx-auto lg:w-fit">
              <div className="lg:sticky lg:top-24">
                <Sidebar className="md:mt-20 lg:mt-0"/>
              </div>
            
            </div>
            <section className="flex-1 flex flex-col gap-6 pb-20">
              <div className="bg-[#222222] rounded-xl border border-[#333333] shadow-lg overflow-hidden">
               {!activeTab ? (
                // Skeleton navbar
                <div className="w-full flex justify-center py-4 animate-pulse space-x-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-20 h-8 bg-[#333333] rounded-lg" />
                  ))}
                </div>
              ) : (
                <Navbar onTabChange={handleTabChange} activeTab={activeTab} />
              )}
              </div>
                <div
                  key={activeTab}
                  className="bg-[#222222] rounded-xl border border-[#333333] shadow-lg p-6 md:p-8 min-h-[600px] animate-elastic-light"
                >
                 {!activeTab ? (
                    <div className="w-full h-full space-y-4 animate-pulse">
                      <div className="h-6 w-1/2 bg-[#333333] rounded" />
                      <div className="h-4 w-full bg-[#333333] rounded" />
                      <div className="h-4 w-5/6 bg-[#333333] rounded" />
                      <div className="h-4 w-2/3 bg-[#333333] rounded" />
                    </div>
                  ) : (
                    <>
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
      <Footer />
    </div>
  )
}
