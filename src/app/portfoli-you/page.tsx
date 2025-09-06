"use client"

import { useState, useEffect } from "react"
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
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full flex items-center justify-center p-6 bg-gradient-to-b from-[#1a1a1a] via-[#121212] to-[#0d0d0d] text-white font-sans">
        <div className="w-full max-w-2xl mx-auto text-center">
          {/* Coming Soon Animation */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden animate-pulse">
              <img 
                src="https://github.com/user-attachments/assets/bc0b40b7-52c3-460c-9519-4996e7213ab7" 
                alt="Portfoli-You Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-red-500 opacity-50 animate-ping"></div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Portfoli-You
          </h1>
          
          <div className="mb-8 space-y-4">
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              A revolutionary portfolio creation platform
            </p>
            <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
              Build stunning, personalized portfolios that showcase your unique talents and achievements.
            </p>
          </div>

          <div className="mb-12">
            <div className="inline-block bg-[#222222] rounded-xl border border-red-600/50 px-8 py-4 shadow-lg">
              <p className="text-2xl font-semibold text-red-500 mb-2">Coming Soon</p>
              <p className="text-gray-400">We&rsquo;re working hard to bring you something amazing!</p>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#222222] rounded-xl border border-[#333333] hover:border-red-600/50 p-6 transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-95">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold">🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Beautiful Designs</h3>
              <p className="text-gray-400 text-sm">Choose from stunning, professionally crafted templates</p>
            </div>

            <div className="bg-[#222222] rounded-xl border border-[#333333] hover:border-red-600/50 p-6 transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-95">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Easy to Use</h3>
              <p className="text-gray-400 text-sm">Create your portfolio in minutes, not hours</p>
            </div>

            <div className="bg-[#222222] rounded-xl border border-[#333333] hover:border-red-600/50 p-6 transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-95">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Share Anywhere</h3>
              <p className="text-gray-400 text-sm">Deploy and share your portfolio with one click</p>
            </div>
          </div>


        </div>
      </main>
      <Footer />
    </div>
  )
}