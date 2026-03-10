"use client"

import { FaUser, FaCertificate, FaTools, FaLinkedin, FaFilePdf, FaGithub, FaBriefcase, FaFolderOpen, FaGraduationCap } from "react-icons/fa"
import PageTabs from "../../PageTabs"
import Timeline, { TimelineItem } from "../../Timeline"
import { projectsTimelineData } from "../../../data/projectsTimelineData"
import { socialLinks } from "../../../data/socialLinks"
import { useExternalLink } from "../../ExternalLinkHandler"
import TooltipWrapper from "../../ToolTipWrapper"
import PDFModalViewer from "../../PDFModalViewer"
import { useState, useEffect } from "react"

interface AboutLandingProps {
  onTabChange: (page: string, tab: string | null) => void
  activeTab: string | null
}

export default function PortfolioLandingPage({ onTabChange, activeTab }: AboutLandingProps) {
  const tabs = [
    { id: "about", label: "About", tabValue: null, icon: <FaUser /> },
    { id: "certifications", label: "Certifications", tabValue: "certifications", icon: <FaCertificate /> },
    { id: "skills", label: "Skills", tabValue: "skills", icon: <FaTools /> },
  ]
  const activeId = activeTab ?? "about"

  const parseStartDate = (value: string) => {
    const parsed = Date.parse(value)
    if (!Number.isNaN(parsed)) return new Date(parsed).getTime()
    const yearMonthMatch = value.match(/^\d{4}-\d{2}$/)
    if (yearMonthMatch) return Date.parse(`${value}-01`)
    const monthYearMatch = value.match(/^[A-Za-z]+\s+\d{4}$/)
    if (monthYearMatch) return Date.parse(`${value} 1`)
    return 0
  }

  const latestProject = [...projectsTimelineData]
    .sort((a, b) => parseStartDate(b.startDate) - parseStartDate(a.startDate))[0]

  const latestProjectItems: TimelineItem[] = latestProject ? [latestProject] : []
  const { handleExternalClick } = useExternalLink()
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const linkedinLink = socialLinks.professional.find((link) => link.label === "LinkedIn")
  const githubLink = socialLinks.professional.find((link) => link.label === "GitHub")
  const resumeUrl = "/resume/EthanTownsend_Resume_feb2026.pdf"

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Header section - wrapped in styled container */}
      <div id="page-header" className="bg-[#222222] rounded-xl border border-[#333333] p-6 mb-6 animate-fadeInScale">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Welcome to My Portfolio
          </h2>
          <div className="mt-4 flex justify-center">
            <PageTabs
              tabs={tabs}
              activeId={activeId}
              onChange={(tab) => onTabChange("about", tab)}
            />
          </div>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            I am Ethan Townsend, a Full-Stack Software Engineer with a passion for back-end development.
            <br />
            <br/>
            Jump to my{" "}
            <button
              type="button"
              onClick={() => onTabChange("about", "certifications")}
              className="text-red-500 hover:text-red-300 underline-offset-4 hover:underline decoration-red-400/70 decoration-2 inline-flex items-center gap-1 transition-all duration-200 hover:scale-[1.02]"
            >
              <FaCertificate className="text-base" />
              Certifications
            </button>
            ,{" "}
            <button
              type="button"
              onClick={() => onTabChange("about", "skills")}
              className="text-red-500 hover:text-red-300 underline-offset-4 hover:underline decoration-red-400/70 decoration-2 inline-flex items-center gap-1 transition-all duration-200 hover:scale-[1.02]"
            >
              <FaTools className="text-base" />
              Skills
            </button>
            ,{" "}
            <button
              type="button"
              onClick={() => onTabChange("career", "experience")}
              className="text-red-500 hover:text-red-300 underline-offset-4 hover:underline decoration-red-400/70 decoration-2 inline-flex items-center gap-1 transition-all duration-200 hover:scale-[1.02]"
            >
              <FaBriefcase className="text-base" />
              Experience
            </button>
            ,{" "}
            <button
              type="button"
              onClick={() => onTabChange("career", "education")}
              className="text-red-500 hover:text-red-300 underline-offset-4 hover:underline decoration-red-400/70 decoration-2 inline-flex items-center gap-1 transition-all duration-200 hover:scale-[1.02]"
            >
              <FaGraduationCap className="text-base" />
              Education
            </button>
            , and{" "}
            <button
              type="button"
              onClick={() => onTabChange("projects", "projects")}
              className="text-red-500 hover:text-red-300 underline-offset-4 hover:underline decoration-red-400/70 decoration-2 inline-flex items-center gap-1 transition-all duration-200 hover:scale-[1.02]"
            >
              <FaFolderOpen className="text-base" />
              Projects
            </button>
            ,{" "}
            <button
              type="button"
              onClick={() => onTabChange("projects", "repos")}
              className="text-red-500 hover:text-red-300 underline-offset-4 hover:underline decoration-red-400/70 decoration-2 inline-flex items-center gap-1 transition-all duration-200 hover:scale-[1.02]"
            >
              <FaGithub className="text-base" />
              Repositories
            </button>
            .
          </p>
        </div>
      </div>

      <section className="bg-[#222222] rounded-xl border border-[#333333] px-6 py-3 mb-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">Let's Connect</h3>
        </div>
      </section>

      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {isLoading ? (
            [...Array(3)].map((_, index) => (
              <div
                key={`connect-skeleton-${index}`}
                className="bg-[#1e1e1e] border border-[#333333] rounded-xl p-6 animate-pulse"
              >
                <div className="h-5 bg-[#333333] rounded w-1/2 mb-3" />
                <div className="h-4 bg-[#333333] rounded w-full mb-2" />
                <div className="h-4 bg-[#333333] rounded w-5/6" />
              </div>
            ))
          ) : (
            <>
              {linkedinLink && (
                <TooltipWrapper label={linkedinLink.tooltip ?? "LinkedIn"}>
                  <button
                    type="button"
                    onClick={() => handleExternalClick(linkedinLink.url, true)}
                    className="group bg-[#1e1e1e] hover:bg-[#252525] border border-[#333333] hover:border-red-600/50 rounded-xl p-6 text-center transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 w-full"
                  >
                    <div className="flex items-center gap-4 text-white group-hover:text-red-500 transition-colors duration-200 w-full">
                      <FaLinkedin className="text-xl" />
                      <h4 className="text-lg font-semibold flex-1 text-center">LinkedIn</h4>
                    </div>
                  </button>
                </TooltipWrapper>
              )}

              {githubLink && (
                <TooltipWrapper label={githubLink.tooltip ?? "GitHub"}>
                  <button
                    type="button"
                    onClick={() => handleExternalClick(githubLink.url, true)}
                    className="group bg-[#1e1e1e] hover:bg-[#252525] border border-[#333333] hover:border-red-600/50 rounded-xl p-6 text-center transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 w-full"
                  >
                    <div className="flex items-center gap-4 text-white group-hover:text-red-500 transition-colors duration-200 w-full">
                      <FaGithub className="text-xl" />
                      <h4 className="text-lg font-semibold flex-1 text-center">GitHub</h4>
                    </div>
                  </button>
                </TooltipWrapper>
              )}

              <TooltipWrapper label="View Resume">
                <button
                  type="button"
                  onClick={() => setSelectedPDF(resumeUrl)}
                  className="group bg-[#1e1e1e] hover:bg-[#252525] border border-[#333333] hover:border-red-600/50 rounded-xl p-6 text-center transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 w-full"
                >
                  <div className="flex items-center gap-4  text-white group-hover:text-red-500 transition-colors duration-200 w-full">
                    <FaFilePdf className="text-xl" />
                    <h4 className="text-lg font-semibold flex-1 text-center">Resume</h4>
                  </div>
                </button>
              </TooltipWrapper>
            </>
          )}
        </div>
      </div>

      <section className="bg-[#222222] rounded-xl border border-[#333333] px-6 py-3 mb-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">Latest Project</h3>
        </div>
      </section>

      <div>
        {latestProjectItems.length > 0 && (
          <>
            {isLoading ? (
              <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-[#333333] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[#333333] rounded w-1/2 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-[#333333] rounded w-full" />
                  <div className="h-3 bg-[#333333] rounded w-5/6" />
                  <div className="h-3 bg-[#333333] rounded w-4/6" />
                </div>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => onTabChange("projects", "projects")}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    onTabChange("projects", "projects")
                  }
                }}
                className="cursor-pointer"
              >
                <Timeline items={latestProjectItems} type="project" showLine={false} />
              </div>
            )}
          </>
        )}
      </div>

      <PDFModalViewer pdfUrl={selectedPDF} onClose={() => setSelectedPDF(null)} />
    </>
  )
}
