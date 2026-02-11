"use client"

import { useState, useEffect } from "react"
import { FaThumbtack } from "react-icons/fa"

interface NavbarProps {
  onTabChange: (page: string, tab: string) => void
  activePage: string | null
  activeTab: string | null
}

const Navbar = ({ onTabChange, activePage, activeTab }: NavbarProps) => {
  const isLoading = !activePage || !activeTab
  const [clickedTab, setClickedTab] = useState<string | null>(null)
  const [isNavPinned, setIsNavPinned] = useState(true)
  const [isMobileView, setIsMobileView] = useState(false)

  // Detect if we're on mobile/tablet viewport (below 1024px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
        { id: "repositories", label: "Repositories", page: "portfolio" }
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

  return (
    <nav className={`w-full bg-[#222222] py-4 ${isMobileView && isNavPinned ? 'fixed' : 'relative'} top-0 left-0 z-50 animate-elastic-in border-b border-[#333333] md:border-0`}>
      <div className="container mx-auto">
        {/* Title and Pin button container */}
        <div className="flex items-center justify-center mb-3 relative">
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            My Portfolio
          </h1>
          
          {/* Pin/Unpin toggle button - only visible on mobile/tablet (< 1024px), positioned to the right of title */}
          {isMobileView && (
            <button
              onClick={() => setIsNavPinned(!isNavPinned)}
              className={`absolute right-4 p-2 rounded-lg bg-[#1e1e1e] border transition-all duration-200 hover:scale-110 ${
                isNavPinned 
                  ? "border-red-600 text-red-600 shadow-md shadow-red-500/20" 
                  : "border-[#333333] text-gray-400 hover:text-red-600 hover:border-red-600"
              }`}
              aria-label={isNavPinned ? "Unpin navigation (navbar will not follow scroll)" : "Pin navigation (navbar will follow scroll)"}
              title={isNavPinned ? "Click to unpin" : "Click to pin"}
            >
              <FaThumbtack size={18} className={`transition-transform duration-200 ${isNavPinned ? "rotate-0" : "rotate-45"}`} />
            </button>
          )}
        </div>
        
        {/* Navigation subsections - horizontal scroll on mobile */}
        <div 
          className="flex flex-row gap-3 max-w-5xl mx-auto md:flex-wrap md:justify-center overflow-x-auto md:overflow-x-visible pb-2 navbar-scroll"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#dc2626 transparent',
          }}
        >
          {isLoading ? (
            <div className="flex space-x-4 animate-pulse justify-center">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-20 h-8 bg-[#333333] rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              {/* Subsection 1: Certifications & Skills */}
              <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-6 flex-shrink-0">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {tabGroups[0].tabs.map((tab) => {
                    const tabKey = `${tab.page}/${tab.id}`
                    const isActive = activePage === tab.page && activeTab === tab.id
                    
                    return (
                      <button
                        key={tabKey}
                        onClick={() => handleClick(tab.page, tab.id)}
                        disabled={isActive}
                        className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 border ${
                          clickedTab === tabKey ? "animate-elastic-in" : ""
                        } ${
                          isActive
                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-md shadow-red-500/10 cursor-default border-transparent"
                            : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-[#dc2626] hover:border-red-600 cursor-pointer border-transparent"
                        }`}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Subsection 2: Experience & Education */}
              <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-6 flex-shrink-0">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {tabGroups[1].tabs.map((tab) => {
                    const tabKey = `${tab.page}/${tab.id}`
                    const isActive = activePage === tab.page && activeTab === tab.id
                    
                    return (
                      <button
                        key={tabKey}
                        onClick={() => handleClick(tab.page, tab.id)}
                        disabled={isActive}
                        className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 border ${
                          clickedTab === tabKey ? "animate-elastic-in" : ""
                        } ${
                          isActive
                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-md shadow-red-500/10 cursor-default border-transparent"
                            : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-[#dc2626] hover:border-red-600 cursor-pointer border-transparent"
                        }`}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Subsection 3: Projects & Repositories */}
              <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-6 flex-shrink-0">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {tabGroups[2].tabs.map((tab) => {
                    const tabKey = `${tab.page}/${tab.id}`
                    const isActive = activePage === tab.page && activeTab === tab.id
                    
                    return (
                      <button
                        key={tabKey}
                        onClick={() => handleClick(tab.page, tab.id)}
                        disabled={isActive}
                        className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 border ${
                          clickedTab === tabKey ? "animate-elastic-in" : ""
                        } ${
                          isActive
                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-md shadow-red-500/10 cursor-default border-transparent"
                            : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-[#dc2626] hover:border-red-600 cursor-pointer border-transparent"
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
