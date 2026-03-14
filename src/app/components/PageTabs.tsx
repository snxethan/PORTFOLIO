"use client"

import React, { ReactNode } from "react"

export interface PageTabDefinition {
  id: string
  label: string
  tabValue?: string | null
  icon?: ReactNode
}

interface PageTabsProps {
  tabs: PageTabDefinition[]
  activeId: string
  onChange: (tabValue: string | null) => void
  align?: "left" | "right" | "center"
}

const PageTabs = ({ tabs, activeId, onChange, align = "center" }: PageTabsProps) => {
  const justifyClass =
    align === "right"
      ? "justify-end"
      : align === "center"
      ? "justify-center"
      : "justify-start"

  return (
    <div className="inline-flex max-w-full bg-[#1e1e1e] border border-[#333333] rounded-xl py-3 px-4">
      <div className={`flex flex-wrap gap-3 ${justifyClass}`}>
        {tabs.map((tab) => {
          const isActive = activeId === tab.id
          const nextValue = tab.tabValue === undefined ? tab.id : tab.tabValue

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(nextValue)}
              aria-pressed={isActive}
              aria-label={tab.label}
              className={`group inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 border text-sm font-medium whitespace-nowrap ${
                isActive
                  ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/40 cursor-pointer border-transparent"
                  : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-[#dc2626] hover:border-red-600 hover:shadow-lg hover:shadow-red-600/30 hover:scale-105 cursor-pointer border-transparent"
              }`}
            >
              {tab.icon && <span className="text-lg">{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PageTabs
