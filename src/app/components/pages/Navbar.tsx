"use client"

import { useState } from "react"

/**
 * Props interface for the Navbar component
 * Defines the callback function and current active tab state
 */
interface NavbarProps {
  onTabChange: (tab: string) => void
  activeTab: string | null
}

/**
 * Navigation component that displays tabs for About, Resume, and Portfolio
 * Features:
 * - Responsive design with fixed positioning on mobile, static on desktop
 * - Smooth animations for tab switching and hover effects
 * - Loading skeleton while activeTab is being resolved
 * - Gradient styling for active tab with red theme
 * - Click animation feedback for better UX
 */
const Navbar = ({ onTabChange, activeTab }: NavbarProps) => {
  const tabs = ["about", "resume", "portfolio"]
  const isLoading = !activeTab
  const [clickedTab, setClickedTab] = useState<string | null>(null)

  /**
   * Handles tab click events with animation and prevents redundant clicks
   * Provides visual feedback through temporary animation state
   */
  const handleClick = (tab: string) => {
    if (tab === activeTab) return; // Prevent redundant clicks on active tab

    setClickedTab(tab);
    onTabChange(tab);

    // Remove click animation after it completes
    setTimeout(() => setClickedTab(null), 300);
  };

  return (
    <nav className="w-full bg-[#222222] py-4 fixed top-0 left-0 z-50 lg:static lg:top-auto lg:left-auto lg:z-0 animate-elastic-in">
      <div className="container mx-auto flex items-center justify-center">
        {isLoading ? (
          // Loading skeleton while tab state is being resolved
          <ul className="flex space-x-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <li key={i}>
                <div className="w-20 h-8 bg-[#333333] rounded-lg" />
              </li>
            ))}
          </ul>
        ) : (
          // Actual navigation tabs
          <ul className="flex space-x-4">
            {tabs.map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => handleClick(tab)}
                  className={`capitalize px-4 py-2 rounded-lg text-sm font-medium transition-transform duration-200 ease-out ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-lg shadow-red-500/30"
                      : "text-gray-300 hover:bg-[#333333] hover:text-white hover:scale-105"
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
