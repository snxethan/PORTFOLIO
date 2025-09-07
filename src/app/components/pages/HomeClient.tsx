"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Sidebar from "./sidebar/Sidebar"
import Navbar from "./Navbar"
import About from "./About"
import Resume from "./Resume"
import Portfolio from "./Portfolio"
import Footer from "./Footer"
import { useExternalLink } from "../ExternalLinkHandler"
import TooltipWrapper from "../ToolTipWrapper"

export default function HomeClient() {
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const { handleExternalClick } = useExternalLink()
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

  const handlePortfoliYouClick = () => {
    handleExternalClick("/portfoli-you", true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#121212] to-[#0d0d0d] text-white font-sans min-w-[360px]">
      {/* Main Page Content */}
      <main className="flex-grow pt-20 xl:pt-0">
        <div className="container mx-auto px-4 pt-15 xl:pt-12 min-w-[360px]">
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="flex flex-col gap-6 xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] mb-12 xl:items-center xl:mx-auto xl:w-fit">
              <Sidebar className="md:mt-20 xl:mt-0"/>
              
              {/* Portfoli-You Widget */}
              <div className="w-full xl:w-80 bg-[#222222] border border-[#333333] hover:border-red-600/50 rounded-xl p-6 shadow-lg text-white text-center transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-95">
                <div className="flex flex-col items-center mb-4">
                  <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-red-500 text-transparent bg-clip-text">
                    Portfoli-YOU
                  </h2>
                  <div className="w-20 h-[2px] mt-2 bg-gradient-to-r from-red-600 to-red-500 rounded-full" />
                </div>

                <p className="text-gray-400 text-sm mb-4 italic">
                  A portfolio for you, by you.
                </p>

                <div className="flex flex-col items-center gap-3">
                  <TooltipWrapper label="/portfoli-you">
                    <button
                      onClick={handlePortfoliYouClick}
                      className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                    >
                      Coming soon...
                    </button>
                  </TooltipWrapper>
                </div>
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
