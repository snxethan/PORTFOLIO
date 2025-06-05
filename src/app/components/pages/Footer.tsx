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
              <a href="/social" className="text-sm text-gray-400 hover:text-white transition-colors">
                Ethan Townsend &copy; {new Date().getFullYear()}
              </a>
            </TooltipWrapper>
          </div>

{/* Right: Domain Links */}
          <div className="order-2 lg:order-3">
            <div className="footer-links flex flex-col sm:flex-row items-center gap-2">
              <TooltipWrapper label="Portfolio">
                <div className="flex gap-4">
                  <Link href="https://snex.dev" className="hover:text-white transition-colors">
                    snex.dev    
                  </Link>
                  <Link href="https://snxethan.dev" className="hover:text-white transition-colors">
                    snxethan.dev
                  </Link>
                </div>
              </TooltipWrapper>
              <span className="hidden sm:block text-gray-600">|</span>
              <TooltipWrapper label="Social Page">
                <Link href="https://ethantownsend.dev" className="hover:text-white transition-colors">
                  ethantownsend.dev
                </Link>
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