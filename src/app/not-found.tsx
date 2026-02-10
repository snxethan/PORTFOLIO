"use client"
import Link from "next/link"
import { FaHome, FaUser, FaBriefcase, FaFolderOpen } from "react-icons/fa"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl p-8 shadow-2xl text-white max-w-2xl w-full text-center">
        <div className="mb-6">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-red-600/80 to-red-500/80 text-transparent bg-clip-text mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Page Not Found
          </h2>
          <div className="w-32 h-[2px] mx-auto bg-gradient-to-r from-red-600/80 to-red-500/80 rounded-full" />
        </div>

        <p className="text-gray-400 text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Link
            href="/?page=about"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#252525] hover:bg-[#2a2a2a] border border-[#333333] hover:border-red-600/50 rounded-lg transition-all duration-200"
          >
            <FaUser className="text-red-500" />
            <span>About Me</span>
          </Link>
          
          <Link
            href="/?page=resume"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#252525] hover:bg-[#2a2a2a] border border-[#333333] hover:border-red-600/50 rounded-lg transition-all duration-200"
          >
            <FaBriefcase className="text-red-500" />
            <span>Resume</span>
          </Link>
          
          <Link
            href="/?page=portfolio"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#252525] hover:bg-[#2a2a2a] border border-[#333333] hover:border-red-600/50 rounded-lg transition-all duration-200"
          >
            <FaFolderOpen className="text-red-500" />
            <span>Portfolio</span>
          </Link>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600/80 to-red-500/80 hover:from-red-500/80 hover:to-red-400/80 rounded-lg transition-all duration-200"
          >
            <FaHome />
            <span>Go Home</span>
          </Link>
        </div>

        <p className="text-gray-500 text-sm">
          Need help? Check the URL or use the navigation above.
        </p>
      </div>
    </div>
  )
}
