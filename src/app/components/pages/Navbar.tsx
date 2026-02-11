"use client"

import { useState } from "react"
import { FaInfoCircle } from "react-icons/fa"

interface NavbarProps {
  onTabChange: (page: string, tab: string) => void
  activePage: string | null
  activeTab: string | null
}

const Navbar = ({ onTabChange, activePage, activeTab }: NavbarProps) => {
  const isLoading = !activePage || !activeTab
  const [clickedTab, setClickedTab] = useState<string | null>(null)

  // Define tab groups with their respective sections
  const tabGroups = [
    {
      name: "About",
      tabs: [
        { id: "certifications", label: "Certifications", page: "about" },
        { id: "skills", label: "Skills", page: "about" }
      ]
    },
    {
      name: "Resume",
      tabs: [
        { id: "experience", label: "Experience", page: "resume" },
        { id: "education", label: "Education", page: "resume" }
      ]
    },
    {
      name: "Portfolio",
      tabs: [
        { id: "projects", label: "Projects", page: "portfolio" },
        { id: "repository", label: "Repository", page: "portfolio" }
      ]
    }
  ]

  const handleClick = (page: string, tab: string) => {
    const currentKey = `${activePage}/${activeTab}`
    const newKey = `${page}/${tab}`
    
    if (currentKey === newKey) return // prevent redundant clicks

    setClickedTab(newKey)
    onTabChange(page, tab)

    // Remove animation class after it finishes (~300ms)
    setTimeout(() => setClickedTab(null), 300)
  }

  const handleInfoClick = () => {
    onTabChange("portfolio", "")
  }

  return (
    <nav className="w-full bg-[#222222] py-4 fixed top-0 left-0 z-50 md:static animate-elastic-in border-b border-[#333333] md:border-0">
      <div className="container mx-auto">
        {/* Title - shown on mobile and desktop */}
        <h1 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          My Portfolio
        </h1>
        
        {/* Navigation subsections - 3 separate subsections + Information */}
        <div className="flex flex-row flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {isLoading ? (
            <div className="flex space-x-4 animate-pulse justify-center">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-20 h-8 bg-[#333333] rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              {/* Information Button - Separate */}
              <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-6">
                <div className="flex items-center justify-center">
                  <button
                    onClick={handleInfoClick}
                    className={`px-5 py-3 rounded-lg text-sm font-medium transition-transform duration-200 ease-out hover:scale-105 ${
                      activePage === "portfolio" && !activeTab
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-md shadow-red-500/10 cursor-default"
                        : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-red-400 cursor-pointer"
                    }`}
                    title="Portfolio Information"
                  >
                    <FaInfoCircle className="inline mr-2" />
                    Information
                  </button>
                </div>
              </div>

              {/* Subsection 1: Certifications & Skills */}
              <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-6">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {tabGroups[0].tabs.map((tab) => {
                    const tabKey = `${tab.page}/${tab.id}`
                    const isActive = activePage === tab.page && activeTab === tab.id
                    
                    return (
                      <button
                        key={tabKey}
                        onClick={() => handleClick(tab.page, tab.id)}
                        disabled={isActive}
                        className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                          clickedTab === tabKey ? "animate-elastic-in" : ""
                        } ${
                          isActive
                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-md shadow-red-500/10 cursor-default"
                            : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-red-400 cursor-pointer"
                        }`}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Subsection 2: Experience & Education */}
              <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-6">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {tabGroups[1].tabs.map((tab) => {
                    const tabKey = `${tab.page}/${tab.id}`
                    const isActive = activePage === tab.page && activeTab === tab.id
                    
                    return (
                      <button
                        key={tabKey}
                        onClick={() => handleClick(tab.page, tab.id)}
                        disabled={isActive}
                        className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                          clickedTab === tabKey ? "animate-elastic-in" : ""
                        } ${
                          isActive
                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-md shadow-red-500/10 cursor-default"
                            : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-red-400 cursor-pointer"
                        }`}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Subsection 3: Projects & Repositories */}
              <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-6">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {tabGroups[2].tabs.map((tab) => {
                    const tabKey = `${tab.page}/${tab.id}`
                    const isActive = activePage === tab.page && activeTab === tab.id
                    
                    return (
                      <button
                        key={tabKey}
                        onClick={() => handleClick(tab.page, tab.id)}
                        disabled={isActive}
                        className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                          clickedTab === tabKey ? "animate-elastic-in" : ""
                        } ${
                          isActive
                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-md shadow-red-500/10 cursor-default"
                            : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-red-400 cursor-pointer"
                        }`}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
