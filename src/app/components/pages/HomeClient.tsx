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
    const queryTab = searchParams.get("tab")
    const storedTab = localStorage.getItem("activeTab")
    const fallbackTab = "about"

    const resolvedTab = queryTab || storedTab || fallbackTab
    setActiveTab(resolvedTab)
    localStorage.setItem("activeTab", resolvedTab)

    if (queryTab) router.replace("/", { scroll: false })
  }, [searchParams, router])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    localStorage.setItem("activeTab", tab)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#121212] to-[#0d0d0d] text-white font-sans">
      {/* Main Page Content */}
      <main className="flex-grow pt-20 md:pt-0">
        <div className="container mx-auto px-4 pt-15 lg:pt-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <Sidebar />
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
              <div className="bg-[#222222] rounded-xl border border-[#333333] shadow-lg p-6 md:p-8 min-h-[600px]">
                {activeTab === "about" && <About />}
                {activeTab === "resume" && <Resume />}
                {activeTab === "portfolio" && <Portfolio />}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Always pinned to bottom */}
      <Footer />
    </div>
  )
}
