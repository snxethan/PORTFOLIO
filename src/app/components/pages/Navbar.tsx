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
    <nav className="w-full bg-[#222222] py-4 fixed top-0 left-0 z-50 xl:static xl:top-auto xl:left-auto xl:z-0 animate-elastic-in">
      <div className="container mx-auto flex items-center justify-center">
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
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-lg shadow-red-500/30"
                      : "text-gray-300 hover:bg-[#333333] hover:text-red-600 hover:scale-105"
                  } ${clickedTab === tab ? "animate-elastic-in" : ""}`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  )
}

export default Navbar
