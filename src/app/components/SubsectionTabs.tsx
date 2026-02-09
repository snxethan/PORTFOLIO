"use client"

import { useState } from "react"

interface SubsectionTab {
  id: string
  label: string
}

interface SubsectionTabsProps {
  tabs: SubsectionTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

const SubsectionTabs: React.FC<SubsectionTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  return (
    <div className={`flex gap-2 mb-8 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-red-600 to-red-500 text-white"
              : "bg-[#1e1e1e] text-gray-300 border border-[#333333] hover:border-red-600/50 hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default SubsectionTabs
