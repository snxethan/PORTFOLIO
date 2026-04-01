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
    <div
      className="inline-flex max-w-full"
      style={{ fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif' }}
    >
      <div className={`flex flex-wrap gap-1 ${justifyClass}`}>
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
              className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
              style={{
                padding: "3px 10px",
                fontSize: "11px",
                fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
                fontWeight: isActive ? "bold" : "normal",
                background: isActive ? "#d4d0c8" : "#c0bdb4",
                color: "#000000",
                borderTopColor: isActive ? "#ffffff" : "#c8c5bc",
                borderLeftColor: isActive ? "#ffffff" : "#c8c5bc",
                borderRightColor: isActive ? "#404040" : "#808080",
                borderBottomColor: isActive ? (isActive ? "transparent" : "#404040") : "#808080",
                borderStyle: "solid",
                borderWidth: "1px",
                cursor: isActive ? "default" : "pointer",
                marginBottom: isActive ? "-1px" : "0",
                position: "relative",
                zIndex: isActive ? 1 : 0,
              }}
            >
              {tab.icon && <span style={{ fontSize: "11px" }}>{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PageTabs
