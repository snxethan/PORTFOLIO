"use client"

import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import About from "./components/About"
import Resume from "./components/Resume"
import Portfolio from "./components/Portfolio"
import ClickSoundWrapper from "./components/ClickSoundWrapper"


export default function Home() {
  const [activeTab, setActiveTab] = useState("about")
  const [githubProjects, setGithubProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProjects() {
      setLoading(true)
      try {
        const res = await fetch("/api/github-projects")
        const data = await res.json()
        setGithubProjects(data)
      } catch (error) {
        console.error("Failed to fetch projects:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  return (
    <ClickSoundWrapper>
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 flex flex-col gap-6">
            <div className="bg-[#222222] rounded-xl border border-[#333333] shadow-lg overflow-hidden">
              <Navbar onTabChange={setActiveTab} activeTab={activeTab} />
            </div>

            <div className="bg-[#222222] rounded-xl border border-[#333333] shadow-lg p-6 md:p-8 min-h-[600px] transition-all duration-300 ease-in-out">
              {activeTab === "about" && <About />}
              {activeTab === "resume" && <Resume />}
              {activeTab === "portfolio" && <Portfolio />}
            </div>
          </main>
        </div>
      </div>
    </div>
    </ClickSoundWrapper>
  )
}
