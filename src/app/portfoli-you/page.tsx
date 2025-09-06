"use client"

import { useState, useEffect } from "react"
import { FaGithub, FaExclamationTriangle } from "react-icons/fa"
import Footer from "../components/pages/Footer"

export default function PortfoliYouPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow w-full flex items-center justify-center p-6 bg-gradient-to-b from-[#1a1a1a] via-[#121212] to-[#0d0d0d] text-white font-sans">
          <div className="w-full max-w-2xl mx-auto text-center animate-pulse">
            <div className="w-32 h-32 mx-auto rounded-full bg-[#333333] mb-8 flex items-center justify-center">
              <div className="w-20 h-20 bg-[#444444] rounded"></div>
            </div>
            <div className="h-12 w-80 bg-[#333333] mx-auto rounded mb-6" />
            <div className="h-6 w-96 bg-[#333333] mx-auto rounded mb-4" />
            <div className="h-6 w-72 bg-[#333333] mx-auto rounded" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Disclaimer */}
      <div className="absolute top-4 left-4 z-10 bg-orange-600/20 border border-orange-600/50 backdrop-blur-sm rounded-lg p-3 max-w-sm">
        <div className="flex items-start gap-2">
          <FaExclamationTriangle className="text-orange-500 mt-0.5 flex-shrink-0" />
          <p className="text-orange-200 text-xs leading-relaxed">
            <strong>Notice:</strong> The official Portfoli-YOU platform will be moving to <strong>portfoli-you.snxethan.com</strong> soon. Stay tuned for updates!
          </p>
        </div>
      </div>

      <main className="flex-grow w-full flex items-center justify-center p-6 pt-16 bg-gradient-to-b from-[#1a1a1a] via-[#121212] to-[#0d0d0d] text-white font-sans">
        <div className="w-full max-w-4xl mx-auto text-center h-full flex flex-col justify-center">
          {/* Coming Soon Animation with extra spacing */}
          <div className="mb-6 relative">
            <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto rounded-full overflow-hidden animate-pulse">
              <img 
                src="https://github.com/user-attachments/assets/bc0b40b7-52c3-460c-9519-4996e7213ab7" 
                alt="Portfoli-YOU Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 w-24 h-24 lg:w-32 lg:h-32 mx-auto rounded-full border-4 border-red-500 opacity-50 animate-ping"></div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 lg:mb-6 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Portfoli-YOU
          </h1>
          
          <div className="mb-6 lg:mb-8 space-y-2 lg:space-y-4">
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed italic">
              A Portfolio for you, by you.
            </p>
            <p className="text-sm md:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Build stunning, personalized portfolios that showcase your unique talents and achievements. No coding experience required.
            </p>
          </div>

          <div className="mb-6 lg:mb-8">
            <div className="inline-block bg-[#222222] rounded-xl border border-red-600/50 px-4 lg:px-8 py-3 lg:py-4 shadow-lg">
              <p className="text-xl lg:text-2xl font-semibold text-red-500 mb-1 lg:mb-2">Coming Soon</p>
              <p className="text-gray-400 text-sm lg:text-base">I&rsquo;m working hard to bring you something amazing!</p>
            </div>
          </div>

          {/* GitHub Repository Buttons */}
          <div className="mb-6 lg:mb-8 flex justify-center gap-4">
            <a
              href="https://github.com/snxethan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-[#333333] hover:bg-[#404040] text-gray-200 hover:text-white rounded-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95 text-sm lg:text-base"
            >
              <FaGithub />
              Portfoli-YOU Repo
            </a>
            <button
              disabled
              className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-[#333333]/50 text-gray-500 rounded-lg text-sm lg:text-base cursor-not-allowed"
              title="Coming soon"
            >
              <FaGithub />
              Website Repo
            </button>
          </div>

          {/* Features Preview - Scaled down and condensed */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-[#222222] rounded-xl border border-[#333333] hover:border-red-600/50 p-4 lg:p-6 transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-95">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-lg mx-auto mb-3 lg:mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg lg:text-xl">🎨</span>
              </div>
              <h3 className="text-base lg:text-lg font-semibold text-white mb-2">Customizable Designs</h3>
              <p className="text-gray-400 text-xs lg:text-sm">Choose from carefully crafted widgets and modules</p>
            </div>

            <div className="bg-[#222222] rounded-xl border border-[#333333] hover:border-red-600/50 p-4 lg:p-6 transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-95">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-lg mx-auto mb-3 lg:mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg lg:text-xl">⚡</span>
              </div>
              <h3 className="text-base lg:text-lg font-semibold text-white mb-2">Easy to Use</h3>
              <p className="text-gray-400 text-xs lg:text-sm">Design your digital portfolio in minutes, not hours</p>
            </div>

            <div className="bg-[#222222] rounded-xl border border-[#333333] hover:border-red-600/50 p-4 lg:p-6 transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-95">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-lg mx-auto mb-3 lg:mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg lg:text-xl">🚀</span>
              </div>
              <h3 className="text-base lg:text-lg font-semibold text-white mb-2">Share Anywhere</h3>
              <p className="text-gray-400 text-xs lg:text-sm">Deploy and share your portfolio anywhere with one click</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
