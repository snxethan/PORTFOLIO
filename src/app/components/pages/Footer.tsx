"use client"
import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import TooltipWrapper from "../ToolTipWrapper"
import SecurityPolicyModal from "../SecurityPolicyModal"

const Footer = () => {
  const [showSecurityPolicy, setShowSecurityPolicy] = useState(false)

  return (
    <footer className="bg-[#121212] text-gray-400 w-full py-6 px-6">
      <div className="max-w-8xl mx-auto flex flex-col items-center gap-6">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4 text-sm">
          {/* Left: Security Policy */}
          <div className="order-3 lg:order-1 mt-2 lg:mt-0">
            <TooltipWrapper label="View Security Policy">
              <button 
                onClick={() => setShowSecurityPolicy(true)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
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
              className="rounded-full"
            />
            <TooltipWrapper label="Social Page">
              <Link href="/social" className="text-sm text-gray-400 hover:text-white transition-colors">
                Ethan Townsend &copy; {new Date().getFullYear()}
              </Link>
            </TooltipWrapper>
          </div>

          {/* Right: Domain Links */}
          <div className="order-2 lg:order-3">
            <TooltipWrapper label="My Domains">
              <div className="footer-links flex flex-col sm:flex-row gap-2">
                <a href="https://snex.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">snex.dev</a>
                <a href="https://snxethan.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">snxethan.dev</a>
                <a href="https://ethantownsend.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">ethantownsend.dev</a>
              </div>
            </TooltipWrapper>
          </div>
        </div>
      </div>
      {showSecurityPolicy && <SecurityPolicyModal onClose={() => setShowSecurityPolicy(false)} />}
    </footer>
  )
}

export default Footer