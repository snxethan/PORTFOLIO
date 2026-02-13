"use client"

import Navbar from "./Navbar"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()
  const [isNavPinned, setIsNavPinned] = useState(true)

  const handleTabChange = (page: string, tab: string) => {
    // Navigate to the selected page/tab
    router.push(`/?page=${page}/${tab}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      {/* Navbar */}
      <Navbar
        onTabChange={handleTabChange}
        activePage={null}
        activeTab={null}
        onPinChange={setIsNavPinned}
      />

      {/* Add padding to prevent content from being covered when navbar is pinned */}
      {isNavPinned && <div className="h-24" />}

      {/* Main Content */}
      <main className="flex-grow w-full flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          {/* Description Card - similar to About page but simplified */}
          <div className="bg-[#1a1a1a] rounded-xl border border-[#333333] shadow-lg p-8">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent animate-elastic-in">
              Ethan Townsend
            </h1>

            {/* Subtitle */}
            <h2 className="text-xl md:text-2xl text-center text-gray-300 mb-8">
              Backend & Full-Stack Software Engineer
            </h2>

            {/* Description */}
            <div className="text-gray-400 text-center space-y-4 max-w-2xl mx-auto">
              <p className="text-lg">
                I'm Ethan Townsend. A Backend & Full-Stack Software Engineer, I am interested in all things tech.
              </p>
              <p className="text-base">
                Experienced in Java, C#, Node.js, and cloud platforms. Passionate about clean code, performance optimization, and staying current with industry best practices.
              </p>
              <p className="text-base text-gray-500 italic mt-6">
                Learn more about me by exploring the navigation above!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
