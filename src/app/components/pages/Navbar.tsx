"use client"

import { useState } from "react"

interface NavbarProps {
  onTabChange: (tab: string) => void
  activeTab: string | null
}



const Navbar = ({ onTabChange, activeTab }: NavbarProps) => {
  const tabs = ["about", "resume", "portfolio"]
  const isLoading = !activeTab
  const [clickedTab, setClickedTab] = useState<string | null>(null)


  
const handleClick = (tab: string) => {
  if (tab === activeTab) return; // prevent redundant clicks

  setClickedTab(tab);
  onTabChange(tab);

  // Remove animation class after it finishes (~300ms)
  setTimeout(() => setClickedTab(null), 300);
};


  return (
    <nav className="w-full bg-[#222222] py-4 fixed top-0 left-0 z-50 md:static animate-elastic-in border-b border-[#333333] md:border-0">
      <div className="container mx-auto">
        {/* Title - shown on mobile and desktop */}
        <h1 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          My Portfolio
        </h1>
        
        {/* Navigation subsection - matching tab nav style */}
        <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-6">
          <div className="flex items-center justify-center">
            {isLoading ? (
              <ul className="flex space-x-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <li key={i}>
                    <div className="w-20 h-8 bg-[#333333] rounded-lg" />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="flex space-x-4">
                {tabs.map((tab) => (
                  <li key={tab}>
                    <button
                      onClick={() => handleClick(tab)}
                      className={`capitalize px-4 py-2 rounded-lg text-sm font-medium transition-transform duration-200 ease-out ${
                        activeTab === tab
                          ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-md shadow-red-500/10"
                          : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-red-600 hover:scale-105"
                      } ${clickedTab === tab ? "animate-elastic-in" : ""}`}
                    >
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
