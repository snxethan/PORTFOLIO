"use client"

import { useEffect, useState } from "react"
import { FaDownload } from "react-icons/fa"
import TooltipWrapper from "../ToolTipWrapper"
import PDFModalViewer from "../PDFModalViewer"
import { timelineData } from "../../data/timelineData"

const Resume = () => {
  const [loading, setLoading] = useState(true)
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null)
  const resumePDF = "/resume/EthanTownsend_Resume_v2.1.pdf"

  useEffect(() => {
    setLoading(false)

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPDF(null)
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  const sortedTimeline = [...timelineData].sort((a, b) =>
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )

  const renderTimeline = (type: "experience" | "education") => (
    <div className="relative mb-16 w-full max-w-4xl mx-auto px-4">
      <div className="flex flex-col items-center relative mb-8 text-center">
        <h2 className="text-3xl font-bold text-white z-10">
          {type === "experience" ? "Experience" : "Education"}
        </h2>
        <span className="w-64 h-1 mt-2 bg-gradient-to-r from-red-600 to-red-500"></span>
      </div>

      <div className="absolute left-1/2 -ml-[2px] w-[2px] bg-gray-700 h-full hidden md:block"></div>

      <div className="flex flex-col gap-12">
        {sortedTimeline
          .filter((item) => item.type === type)
          .map((item, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center relative">
              <div className="md:w-1/2 text-center md:text-center md:pr-8">
                <h3 className="text-xl font-semibold text-white">
                  {item.institution}
                </h3>
                <p className="text-gray-400">
                  {item.startDate} to {item.endDate}
                </p>
                <p className="text-gray-500 text-sm italic">
                  {item.location}
                </p>
                <ul className="list-disc list-inside mt-2 text-sm text-gray-300 text-left md:text-center mx-auto md:mx-auto max-w-xs">
                  {item.highlights.map((hl, i) => (
                    <li key={i}>{hl}</li>
                  ))}
                </ul>
              </div>
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-red-600"></div>
              </div>
              <div className="md:w-1/2 md:pl-4 mt-4 md:mt-0">
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-[#333333] hover:border-red-600/50 transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-95">
                  <p>{item.summary}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )

  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-6 relative text-center">
        Experience & Education Timeline
        <span className="absolute bottom-[-8px] left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-500"></span>
      </h2>

      <div className="bg-[#121212] text-white py-20">
        <div className="container mx-auto px-4">
          <header className="text-center mb-16">
            <h1 className="text-4xl mb-2">Ethan Townsend</h1>
            <p className="text-gray-300">Software Engineer</p>
            <p className="text-gray-400">Salt Lake City, UT</p>
            <p className="text-gray-400">snxethan@gmail.com</p>
          </header>

          <div className="flex justify-center gap-4 mb-8">
            <TooltipWrapper label="View Resume" url={resumePDF}>
              <button
                onClick={() => setSelectedPDF(resumePDF)}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
              >
                <FaDownload /> View Resume
              </button>
            </TooltipWrapper>
          </div>

          {renderTimeline("experience")}
          {renderTimeline("education")}
        </div>
      </div>

      <PDFModalViewer pdfUrl={selectedPDF} onClose={() => setSelectedPDF(null)} />
    </div>
  )
}

export default Resume