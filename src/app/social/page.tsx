"use client"

import Image from "next/image"
import Sidebar from "@/app/components/pages/sidebar/Sidebar"
import Footer from "../components/pages/Footer"
import TooltipWrapper from "../components/ToolTipWrapper"
import { useState, useEffect } from "react"

export default function SocialPage() {
  const [loading, setLoading] = useState(true)

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
              {[...Array(4)].map((_, i) => (
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
                  <Image
                    src="/images/avatar/snex.png"
                    alt="Snex Logo"
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-sm"
                  />
                  My Portfolio
                </a>
              </TooltipWrapper>
            <div className="mt-2 text-gray-400 text-xs text-center">
              My own website under custom domains, holding all my projects, experience, and information about myself.
            </div>

            {/* Navigation buttons to sections */}
            <div className="mt-4 flex justify-center space-x-3">
              <TooltipWrapper label="https://snex.dev/?tab=about" url="https://snex.dev/?tab=about">
              <a
                href="https://snex.dev/?tab=about" 
                className="px-3 py-1 bg-[#333333] hover:bg-red-600 text-gray-200 hover:text-white rounded-md text-xs transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                About
              </a>
              </TooltipWrapper>
              <TooltipWrapper label="https://snex.dev/?tab=resume" url="https://snex.dev/?tab=resume">
              <a
                href="https://snex.dev/?tab=resume" 
                className="px-3 py-1 bg-[#333333] hover:bg-red-600 text-gray-200 hover:text-white rounded-md text-xs transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Resume
              </a>
              </TooltipWrapper>
              <TooltipWrapper label="https://snex.dev/?tab=portfolio" url="https://snex.dev/?tab=portfolio">
              <a
                href="https://snex.dev/?tab=portfolio" 
                className="px-3 py-1 bg-[#333333] hover:bg-red-600 text-gray-200 hover:text-white rounded-md text-xs transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Projects
              </a>
              </TooltipWrapper>
            </div>
          </div>

          {/* Portfoli-You Widget */}
          <div className="bg-[#222222] rounded-xl border border-[#333333] hover:border-red-600/50 shadow-lg p-6 flex flex-col items-center transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-95">
              <TooltipWrapper label="https://portfoliyou.snxethan.dev/">
                <a
                  href="https://portfoliyou.snxethan.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg shadow text-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <Image
                    src="https://portfoliyou.snxethan.dev/images/icon/portfoliyou.png"
                    alt="Portfoli-YOU Logo"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                    style={{ borderRadius: "4px" }}
                  />
                  Portfoli-YOU
                </a>
              </TooltipWrapper>
            <div className="mt-2 text-gray-400 text-xs text-center">
              My college capstone project, a personal website builder for users to create and customize their own digital portfolios, with no coding experience required.
              <br />
              <br />
                <p className="text-gray-300 text-sm italic">
                            A Portfolio for you, by you
              </p>            
              </div>

            {/* Nav */}
            <div className="mt-4 flex justify-center space-x-3">
              <TooltipWrapper label="https://portfoliyou.snxethan.dev/use" url="https://portfoliyou.snxethan.dev/use">
              <a
                href="https://portfoliyou.snxethan.dev/use" 
                className="px-3 py-1 bg-[#333333] hover:bg-red-600 text-gray-200 hover:text-white rounded-md text-xs transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Use
              </a>
              </TooltipWrapper>
                  <TooltipWrapper label="https://portfoliyou.snxethan.dev" url="https://portfoliyou.snxethan.dev">
              <a
                href="https://portfoliyou.snxethan.dev/"
                className="px-3 py-1 bg-[#333333] hover:bg-red-600 text-gray-200 hover:text-white rounded-md text-xs transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Portfoli-YOU
              </a>
              </TooltipWrapper>
              <TooltipWrapper label="https://portfoliyou.snxethan.dev/faqs" url="https://portfoliyou.snxethan.dev/faqs">
              <a
                href="https://portfoliyou.snxethan.dev/faqs"
                className="px-3 py-1 bg-[#333333] hover:bg-red-600 text-gray-200 hover:text-white rounded-md text-xs transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                FAQs
              </a>
              </TooltipWrapper>
            </div>
          </div>

          {/* ScheduleIt Widget */}
          <div className="bg-[#222222] rounded-xl border border-[#333333] hover:border-red-600/50 shadow-lg p-6 flex flex-col items-center transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-95">
              <TooltipWrapper label="https://scheduleit.snxethan.dev/">
                <a
                  href="https://scheduleit.snxethan.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg shadow text-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <Image
                    src="https://scheduleit.snxethan.dev/scheduleitlogo.png"
                    alt="ScheduleIt Logo"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                    style={{ borderRadius: "4px" }}
                  />
                  ScheduleIt
                </a>
              </TooltipWrapper>
            <div className="mt-2 text-gray-400 text-xs text-center">
              A modern scheduling application tailored for employees and employers, built by Diego Perez Benitez. Features comprehensive business management, shift scheduling, time-off requests, and real-time communication.
              <br />
              <br />
                <p className="text-gray-300 text-sm italic">
                  Schedule it your way!
              </p>            
              </div>

            {/* Nav */}
            <div className="mt-4 flex justify-center space-x-3">
              <TooltipWrapper label="https://scheduleit.snxethan.dev" url="https://scheduleit.snxethan.dev">
              <a
                href="https://scheduleit.snxethan.dev" 
                className="px-3 py-1 bg-[#333333] hover:bg-red-600 text-gray-200 hover:text-white rounded-md text-xs transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Website
              </a>
              </TooltipWrapper>
              <TooltipWrapper label="https://scheduleit.snxethan.dev/about" url="https://scheduleit.snxethan.dev/about">
              <a
                href="https://scheduleit.snxethan.dev/about"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-[#333333] hover:bg-red-600 text-gray-200 hover:text-white rounded-md text-xs transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                About
              </a>
              </TooltipWrapper>
            </div>
          </div>
        </div>
      </div>
      
    </main>
    <Footer/>
    </div>
  )
}
