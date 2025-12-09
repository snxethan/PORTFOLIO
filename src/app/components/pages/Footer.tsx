"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import TooltipWrapper from "../ToolTipWrapper"
import SecurityPolicyModal from "../SecurityPolicyModal"

const Footer = () => {
  const [showSecurityPolicy, setShowSecurityPolicy] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <footer className="bg-[#121212] text-gray-400 w-full py-6 px-6">
        <div className="max-w-8xl mx-auto flex flex-col items-center gap-6">
          <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4 text-sm">
            {/* Left: Security Policy Skeleton */}
            <div className="order-3 lg:order-1 mt-2 lg:mt-0">
              <div className="h-5 w-24 bg-[#333333] rounded animate-pulse" />
            </div>

            {/* Center: Logo & Name Skeleton */}
            <div className="order-1 lg:order-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#333333] animate-pulse" />
              <div className="h-5 w-40 bg-[#333333] rounded animate-pulse" />
            </div>

            {/* Right: Domain Links Skeleton */}
            <div className="order-2 lg:order-3">
              <div className="footer-links flex flex-col sm:flex-row items-center gap-2">
                <div className="flex gap-4">
                  <div className="h-5 w-16 bg-[#333333] rounded animate-pulse" />
                  <div className="h-5 w-24 bg-[#333333] rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  return (
    <footer className="bg-[#121212] text-gray-400 w-full py-6 px-6">
      <div className="max-w-8xl mx-auto flex flex-col items-center gap-6">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4 text-sm">
          {/* Left: Security Policy */}
          <div className="order-3 lg:order-1 mt-2 lg:mt-0">
            <TooltipWrapper label="View Security Policy">
              <button 
                onClick={() => setShowSecurityPolicy(true)}
                className="text-sm text-gray-400 hover:text-red-600 hover:scale-105 transition-all duration-200"
              >
                Security Policy
              </button>
            </TooltipWrapper>
          </div>

          {/* Center: Logo & Name */}
          <div className="order-1 lg:order-2 flex items-center gap-2">
            <Image
              src="/images/avatar/snex.png"
              alt="Ethan Townsend"
              width={32}
              height={32}
              className="rounded-full transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
            />
            <TooltipWrapper label="Social Landing">
              <a href="https://ethantownsend.dev" className="text-sm text-gray-400 hover:text-red-600 transition-colors duration-200">
                Ethan Townsend &copy; {new Date().getFullYear()}
              </a>
            </TooltipWrapper>
          </div>

{/* Right: Domain Links */}
          <div className="order-2 lg:order-3">
            <div className="footer-links flex flex-col sm:flex-row items-center gap-2">
              <TooltipWrapper label="Portfolio">
                <div className="flex gap-4">
                  <Link href="https://snex.dev" className="hover:text-red-600 hover:scale-105 transition-all duration-200">
                    snex.dev    
                  </Link>
                  <Link href="https://snxethan.dev" className="hover:text-red-600 hover:scale-105 transition-all duration-200">
                    snxethan.dev
                  </Link>
                </div>
              </TooltipWrapper>
            </div>
          </div>
        </div>
      </div>
      {showSecurityPolicy && <SecurityPolicyModal onClose={() => setShowSecurityPolicy(false)} />}
    </footer>
  )
}

export default Footer