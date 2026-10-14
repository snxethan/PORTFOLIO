"use client"

import React, { ReactNode } from "react"
import PageTabs, { PageTabDefinition } from "./PageTabs"

interface SectionHeaderProps {
  id?: string
  title: string
  description?: ReactNode
  /** Extra content between the title and the description (About's intro). */
  intro?: ReactNode
  tabs: PageTabDefinition[]
  activeTabId: string
  onTabChange: (tabValue: string | null) => void
  /** "Showing 4 Projects" */
  resultsText: string
  /** The section's SearchFilterBar. */
  children: ReactNode
}

/** Title, sub-tabs and search panel shared by every section. */
const SectionHeader = ({
  id,
  title,
  description,
  intro,
  tabs,
  activeTabId,
  onTabChange,
  resultsText,
  children,
}: SectionHeaderProps) => (
  <div id={id} className="bg-[#222222] rounded-xl border border-[#333333] shadow-lg shadow-black/20 p-6 mb-6">
    <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
      {title}
    </h2>
    {intro}
    {description &&
      (typeof description === "string" ? (
        <p className="mx-auto mb-4 max-w-2xl text-center text-sm text-gray-400">{description}</p>
      ) : (
        <div className="mx-auto mb-4 max-w-3xl">{description}</div>
      ))}
    <div className="flex justify-center mb-4">
      <PageTabs tabs={tabs} activeId={activeTabId} onChange={onTabChange} />
    </div>

    <div
      id={id ? `${id}-filters` : undefined}
      className="bg-[#1e1e1e] border border-[#333333] rounded-xl py-4 px-4 shadow-lg shadow-black/20"
      style={{ scrollMarginTop: "calc(var(--navbar-height, 0px) + 1rem)" }}
    >
      <div className="container mx-auto">
        {children}
        <div className="text-sm text-gray-400 mt-2" aria-live="polite">
          {resultsText}
        </div>
      </div>
    </div>
  </div>
)

export default SectionHeader
