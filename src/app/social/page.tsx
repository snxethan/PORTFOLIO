"use client"

import Sidebar from "@/app/components/pages/sidebar/Sidebar"
import { FaPerson, FaPalette } from "react-icons/fa6"
import Footer from "../components/pages/Footer"
import { useExternalLink } from "../components/ExternalLinkHandler"
import TooltipWrapper from "../components/ToolTipWrapper"
import { useState, useEffect } from "react"

export default function SocialPage() {
  const [loading, setLoading] = useState(true)
  const { handleExternalClick } = useExternalLink()

    useEffect(() => {
      setLoading(false) // Set loading to false after 1 second
    }, [])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow w-full flex items-center justify-center p-6 bg-gradient-to-b from-[#1a1a1a] via-[#121212] to-[#0d0d0d] text-white font-sans">
          <div className="flex flex-col md:flex-row items-start justify-center gap-10 w-full max-w-4xl">
            {/* Sidebar Skeleton */}
            <div className="w-full md:max-w-md lg:w-80 bg-[#222222] rounded-xl border border-[#333333] shadow-lg p-6 animate-pulse">
              <div className="w-32 h-32 mx-auto rounded-full bg-[#333333]" />
              <div className="mt-4 text-center space-y-2">
                <div className="h-6 w-40 bg-[#333333] mx-auto rounded" />
                <div className="h-4 w-24 bg-[#333333] mx-auto rounded" />
              </div>
              <div className="mt-6 h-[200px] bg-[#333333] rounded" />
            </div>

            {/* Main Content Skeleton */}
            <div className="mt-2 md:mt-5 w-full md:max-w-sm space-y-6">
              {/* Project Card Skeletons */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#222222] rounded-xl border border-[#333333] shadow-lg p-6 animate-pulse">
                  {/* Project Title Button Skeleton */}
                  <div className="h-8 w-32 bg-[#333333] rounded-lg mx-auto" />
                  {/* Project Description Skeleton */}
                  <div className="mt-4 h-12 bg-[#333333] rounded" />
                  {/* Navigation Buttons Skeleton */}
                  <div className="mt-6 flex justify-center space-x-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-6 w-16 bg-[#333333] rounded" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full flex items-center justify-center p-6 bg-gradient-to-b from-[#1a1a1a] via-[#121212] to-[#0d0d0d] text-white font-sans">
        <div className="flex flex-col md:flex-row items-start justify-center gap-10 w-full max-w-4xl">
          <Sidebar />

          <div className="mt-2 md:mt-5 w-full md:max-w-sm space-y-6">
            {/* My Portfolio Widget */}
            <div className="bg-[#222222] rounded-xl border border-[#333333] hover:border-red-600/50 shadow-lg p-6 flex flex-col items-center transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-95">
              <TooltipWrapper label="https://snex.dev/">
                <a
                  href="https://snex.dev/"
                  className="flex items-center justify-center gap-2 px-4 py-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg shadow text-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <FaPerson />
                  My Portfolio
                </a>
              </TooltipWrapper>
            <div className="mt-2 text-gray-400 text-xs text-center">
              My own website under custom domains, holding all my projects, experience, and information about myself.
            </div>

            {/* Navigation buttons to sections */}
            <div className="mt-4 flex justify-center space-x-3">
              <a
                href="https://snex.dev/?tab=about" // Assuming your main page handles /?tab=about
                className="px-3 py-1 bg-[#333333] hover:bg-red-600 text-gray-200 hover:text-white rounded-md text-xs transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                About
              </a>
              <a
                href="https://snex.dev/?tab=resume" // Assuming your main page handles /?tab=resume
                className="px-3 py-1 bg-[#333333] hover:bg-red-600 text-gray-200 hover:text-white rounded-md text-xs transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Resume
              </a>
              <a
                href="https://snex.dev/?tab=portfolio" // Assuming your main page handles /?tab=portfolio
                className="px-3 py-1 bg-[#333333] hover:bg-red-600 text-gray-200 hover:text-white rounded-md text-xs transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Projects
              </a>
            </div>
          </div>

          {/* Portfoli-You Widget */}
          <div className="bg-[#222222] rounded-xl border border-[#333333] hover:border-red-600/50 shadow-lg p-6 flex flex-col items-center transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-95">
            <TooltipWrapper label="/portfoli-you">
              <button
                onClick={() => handleExternalClick("/portfoli-you", true)}
                className="flex items-center justify-center gap-2 px-4 py-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg shadow text-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <FaPalette />
                Portfoli-YOU
              </button>
            </TooltipWrapper>
            <div className="mt-2 text-gray-400 text-xs text-center">
              A local-first desktop application with drag-and-drop editor, modular templates, and optional cloud sync that empowers anyone to design and deploy their portfolio website.
            </div>

            {/* Tagline */}
            <div className="mt-4 flex justify-center">
              <p className="text-gray-300 text-sm italic">
                A portfolio for you, by you
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </main>
    <Footer/>
    </div>
  )
}