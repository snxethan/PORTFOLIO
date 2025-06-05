"use client"

import Sidebar from "@/app/components/pages/sidebar/Sidebar"
import { FaPerson } from "react-icons/fa6";
import Footer from "../components/pages/Footer"

export default function SocialPage() {
  return (
    <div className="flex flex-col min-h-screen"> {/* Apply flex, flex-col, and min-h-screen here */}
    <main
      // Removed min-h-screen from main, added flex-grow
      className="flex-grow w-full flex items-center justify-center p-6 bg-gradient-to-b from-[#1a1a1a] via-[#121212] to-[#0d0d0d] text-white font-sans"
    >
      <div className="flex flex-col md:flex-row items-start justify-center gap-10 w-full max-w-4xl">
        <Sidebar />

        {/* Apply max-w-sm only on md screens and up */}
                <div className="mt-2 md:mt-5 w-full md:max-w-sm">
          <div className="bg-[#222222] rounded-xl border border-[#333333] shadow-lg p-6 flex flex-col items-center">
            <a
              href="https://snex.dev/"
              className="flex items-center justify-center gap-2 px-4 py-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg shadow text-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <FaPerson />
              My Portfolio
            </a>
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
        </div>
      </div>
      
    </main>
    <Footer/>
    </div>
  )
}