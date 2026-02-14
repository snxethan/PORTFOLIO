"use client"
import React, { useEffect, useState } from "react"
import { FaFilePdf } from "react-icons/fa"
import { useExternalLink } from "../../ExternalLinkHandler"
import TooltipWrapper from "../../ToolTipWrapper"
import PDFModalViewer from "../../PDFModalViewer"
import { certifications, Certification } from "../../../data/aboutData"
import SearchFilterBar from "../../SearchFilterBar"
import { getTimedItem, setTimedItem, removeTimedItem } from "../../../utils/timedStorage"

const CertificationsPage = () => {
  const [loading, setLoading] = useState(true)
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null)
  const [search, setSearch] = useState(() => {
    if (typeof window !== 'undefined') {
      return getTimedItem<string>('certificationsSearch') || ""
    }
    return ""
  })
  const [sortBy, setSortBy] = useState(() => {
    if (typeof window !== 'undefined') {
      return getTimedItem<string>('certificationsSortBy') || "newest"
    }
    return "newest"
  })
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showTagsMenu, setShowTagsMenu] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = getTimedItem<string>('certificationsSelectedTag')
      return saved !== null ? saved : "Computer Science"
    }
    return "Computer Science"
  })
  const { handleExternalClick } = useExternalLink()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimedItem('certificationsSearch', search)
    }
  }, [search])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimedItem('certificationsSortBy', sortBy)
    }
  }, [sortBy])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedTag !== null) {
        setTimedItem('certificationsSelectedTag', selectedTag)
      } else {
        removeTimedItem('certificationsSelectedTag')
      }
    }
  }, [selectedTag])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPDF(null)
        setShowFilterMenu(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    
    return () => {
      clearTimeout(timer)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])
  
  const handleFilterChange = (value: string) => {
    setSortBy(value)
    setTimedItem('certificationsSortBy', value)
    setShowFilterMenu(false)
  }

  const renderCertGrid = (items: Certification[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => { 
          const { name, icon: Icon, highlight, url, year } = item
          const Card = (
            <div
              className={`group relative flex flex-col bg-[#1a1a1a] hover:bg-[#252525] p-6 rounded-xl shadow-lg border border-[#333333] hover:border-red-600/50 transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 min-h-[140px]`} 
            >
              <div className="flex items-start gap-4 mb-3">
                <div
                  className={`flex-shrink-0 p-3 rounded-lg shadow-lg ${
                    highlight ? "bg-gradient-to-br from-red-500/80 to-red-700/80" : "bg-red-600/40 group-hover:bg-red-600/50"
                  }`} 
                >
                  <Icon className="text-white text-2xl" /> 
                </div>
                <div className="flex-1 min-w-0">
                  <TooltipWrapper label={name}>
                    <h3 className="text-white font-semibold text-base mb-1 truncate group-hover:text-[#dc2626] transition-colors duration-300">{name}</h3>
                  </TooltipWrapper>
                  {year && (
                    <span className="text-gray-400 text-sm">{year}</span>
                  )} 
                </div>
              </div>
              
              {url?.endsWith(".pdf") && (
                <div className="absolute bottom-4 right-4 text-gray-400 group-hover:text-[#dc2626] transition-colors duration-300"> 
                  <FaFilePdf size={16} aria-label="View Certification" />
                </div>
              )}
            </div>
          )

          if (url?.endsWith(".pdf")) {
            return (
              <TooltipWrapper key={name} label="View Certification" url={url}>
                <div onClick={() => setSelectedPDF(url)} className="cursor-pointer">
                  {Card}
                </div>
              </TooltipWrapper>
            )
          }

          return url ? (
            <TooltipWrapper key={name} label={url}>
              <div onClick={() => handleExternalClick(url, true)} className="cursor-pointer">
                {Card}
              </div>
            </TooltipWrapper>
          ) : (
            <div key={name} className="cursor-pointer">
              {Card}
            </div>
          )
        })}
      </div>
    )
  }

  const renderSkeletonGrid = (count: number) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-[#1a1a1a] border border-[#333333] p-6 rounded-xl animate-pulse flex flex-col gap-4 min-h-[140px]">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#333333] rounded mb-1.5 sm:mb-2" /> 
          <div className="h-2.5 sm:h-3 bg-[#333333] rounded w-16 sm:w-20" />
        </div>
      ))}
    </div>
  )

  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>()
    certifications.forEach(item => {
      item.tags?.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [])
  
  const sortedTags = React.useMemo(() => {
    if (!allTags.length) return []
    return allTags.slice().sort((a, b) => a.localeCompare(b))
  }, [allTags])

  const filteredCertifications = certifications.filter((cert) => {
    const matchesSearch = cert.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = sortBy !== "cs-only" || cert.tags?.includes("Computer Science")
    const matchesTag = !selectedTag || cert.tags?.includes(selectedTag)
    return matchesSearch && matchesFilter && matchesTag
  })

  const sortedCertifications = [...filteredCertifications].sort((a, b) => {
    if (sortBy === "cs-only") return b.year - a.year
    if (sortBy === "name-asc") return a.name.localeCompare(b.name)
    if (sortBy === "name-desc") return b.name.localeCompare(a.name)
    if (sortBy === "oldest") return a.year - b.year
    if (sortBy === "newest") return b.year - a.year
    if (a.highlight === b.highlight) {
      return a.name.localeCompare(b.name)
    }
    return a.highlight ? -1 : 1
  })

  const filterOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "name-desc", label: "Name (Z–A)" },
  ]

  const resultsCount = `Showing ${sortedCertifications.length} Certification${sortedCertifications.length !== 1 ? 's' : ''}`

  return (
    <>
      <div className="bg-[#222222] rounded-xl border border-[#333333] p-6 mb-6 animate-fadeInScale">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Professional Certifications
          </h2>
          <p className="text-center text-gray-300 mb-4 max-w-3xl mx-auto">
            Industry-recognized credentials and technical certifications
          </p>
          <p className="text-center text-gray-400 max-w-3xl mx-auto">
            Validated expertise across cloud platforms, cybersecurity, and computer science fundamentals.
          </p>
        </div>
      
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl py-4 px-4">
          <div className="container mx-auto">
            <SearchFilterBar
              search={search}
              setSearch={setSearch}
              placeholder="Search by name, keyword, or tags..."
              tags={sortedTags}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              sortOptions={filterOptions}
              selectedSort={sortBy}
              setSelectedSort={handleFilterChange}
              showTagsMenu={showTagsMenu}
              setShowTagsMenu={setShowTagsMenu}
              showFilterMenu={showFilterMenu}
              setShowFilterMenu={setShowFilterMenu}
              defaultSort="newest"
            />

            {resultsCount && (
              <div className="text-sm text-gray-400 mb-3">{resultsCount}</div>
            )}
          </div>
        </div>
      </div>
      
      <section id="certifications" className="text-white">
        <div className="transition-opacity duration-150 opacity-100 animate-fade-in-up">
          {loading ? renderSkeletonGrid(6) : renderCertGrid(sortedCertifications)}
        </div>
      </section>

      <PDFModalViewer pdfUrl={selectedPDF} onClose={() => setSelectedPDF(null)} />
    </>
  )
}

export default CertificationsPage
