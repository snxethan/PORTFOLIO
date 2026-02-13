"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "./sidebar/Sidebar"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function LandingPage() {
  const router = useRouter()
  const [isNavPinned, setIsNavPinned] = useState(true)
  const [isNavExpanded, setIsNavExpanded] = useState(false)

  const handleTabChange = (page: string, tab: string) => {
    // Navigate to the selected page/tab
    router.push(`/?page=${page}/${tab}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#121212] to-[#0d0d0d] text-white font-sans min-w-[360px]">
      {/* Main Page Content - Dynamic padding based on pin state */}
      <main className={`flex-grow ${
        isNavPinned 
          ? (isNavExpanded ? 'pt-48' : 'pt-32')
          : 'pt-4'
      }`}>
        <div className="container mx-auto px-4 pt-4 min-w-[360px]">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="flex flex-col gap-6 mb-12 lg:items-center lg:mx-auto lg:w-fit">
              <div className={`lg:sticky ${
                isNavPinned 
                  ? (isNavExpanded ? 'lg:top-52' : 'lg:top-36')
                  : 'lg:top-4'
              }`}>
                <Sidebar className=""/>
              </div>
            </div>

            {/* Main Content */}
            <section className="flex-1 flex flex-col gap-6 pb-20">
              {/* Navbar Container */}
              <div className="bg-[#1e1e1e] rounded-xl border border-[#333333] shadow-lg overflow-hidden">
                <Navbar 
                  onTabChange={handleTabChange} 
                  activePage={null}
                  activeTab={null}
                  onPinChange={setIsNavPinned}
                  onLayoutChange={setIsNavExpanded}
                />
              </div>

              {/* Header Section - matches About page style */}
              <div className="bg-[#222222] rounded-xl border border-[#333333] p-6 animate-fadeInScale">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent transition-transform duration-200 ease-out hover:scale-110">
                    Welcome
                  </h2>
                  <p className="text-center text-gray-300 mb-4 max-w-3xl mx-auto">
                    Backend & Full-Stack Software Engineer
                  </p>
                  <p className="text-center text-gray-400 max-w-3xl mx-auto">
                    I'm Ethan Townsend. A Backend & Full-Stack Software Engineer, I am interested in all things tech. Experienced in Java, C#, Node.js, and cloud platforms. Passionate about clean code, performance optimization, and staying current with industry best practices.
                  </p>
                </div>

                {/* CTA Section */}
                <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl py-6 px-4">
                  <p className="text-center text-gray-400 max-w-2xl mx-auto">
                    Explore my <span className="text-red-500 font-semibold">certifications</span>, <span className="text-red-500 font-semibold">skills</span>, <span className="text-red-500 font-semibold">experience</span>, and <span className="text-red-500 font-semibold">projects</span> using the navigation above.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
