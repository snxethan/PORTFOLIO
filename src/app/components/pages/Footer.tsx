"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import TooltipWrapper from "../ToolTipWrapper"

const Footer = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500) // simulate 0.5s load
    return () => clearTimeout(timeout)
  }, [])

  return (
    <footer className="bg-[#121212] text-gray-400 w-full py-6 px-6">
      <div className="max-w-8xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 text-sm">
        {loading ? (
          <>
            {/* Skeleton Left */}
            <div className="flex items-center gap-2 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-[#333333]" />
              <div className="h-4 w-32 bg-[#333333] rounded" />
            </div>

            {/* Skeleton Right */}
            <div className="flex flex-col sm:flex-row gap-2 animate-pulse">
              <div className="h-4 w-24 bg-[#333333] rounded" />
              <div className="h-4 w-28 bg-[#333333] rounded" />
              <div className="h-4 w-32 bg-[#333333] rounded" />
            </div>
          </>
        ) : (
          <>
            {/* Left: Avatar and copyright */}
            <div className="flex items-center gap-2">
              <Image
                src="/images/avatar/snex.png"
                alt="Ethan Townsend"
                width={32}
                height={32}
                className="rounded-full"
              />
              <p>Ethan Townsend &copy; {new Date().getFullYear()}</p>
            </div>

            {/* Right: Domain Links */}
            <TooltipWrapper label="My Domains">
              <div className="footer-links flex flex-col sm:flex-row gap-2">
                <a href="https://snex.dev" target="_blank" rel="noopener noreferrer">snex.dev</a>
                <a href="https://snxethan.dev" target="_blank" rel="noopener noreferrer">snxethan.dev</a>
                <a href="https://ethantownsend.dev" target="_blank" rel="noopener noreferrer">ethantownsend.dev</a>
              </div>
            </TooltipWrapper>
          </>
        )}
      </div>
    </footer>
  )
}

export default Footer
