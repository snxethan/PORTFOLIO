"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import TooltipWrapper from "../ToolTipWrapper"
import HealthModal from "../HealthModal"
import * as Icons from "react-icons/fa"
import { socialLinks } from "../../data/socialLinks"
import { useExternalLink } from "../ExternalLinkHandler"

const LICENSE_URL = "https://github.com/snxethan/PORTFOLIO/blob/main/LICENSE.md"
const domainLinkClass =
  "inline-flex items-center rounded-md px-2 py-1.5 hover:text-red-600 transition-[color,transform] duration-200 ease-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:text-red-500"

const Footer = () => {
  const [loading, setLoading] = useState(true)
  const [showHealth, setShowHealth] = useState(false)
  const { handleExternalClick } = useExternalLink()

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <footer className="bg-[#121212] text-gray-400 w-full py-6 px-6">
        <div className="max-w-8xl mx-auto flex flex-col items-center gap-6">
          <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4 text-sm">
            {/* Left: Summary Skeleton */}
            <div className="order-3 lg:order-1 mt-2 lg:mt-0">
              <div className="h-5 w-48 bg-[#333333] rounded animate-pulse" />
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
          {/* Left: Professional Links */}
          <div className="order-3 lg:order-1 mt-2 lg:mt-0">
            <div className="flex items-center gap-4">
              {socialLinks.professional.map(({ label, icon, url, tooltip }) => {
                const Icon = Icons[icon as keyof typeof Icons]
                const isLinkedIn = label === "LinkedIn"
                return (
                  <TooltipWrapper key={label} label={tooltip}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className={`inline-flex items-center justify-center ${isLinkedIn ? "rounded-none" : "rounded-full"} p-1 text-gray-400 hover:text-red-600 text-xl transition-all duration-200 ease-out hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.48)] hover:shadow-[0_0_14px_rgba(220,38,38,0.14)] focus-visible:outline-none focus-visible:text-red-500 focus-visible:drop-shadow-[0_0_10px_rgba(220,38,38,0.48)] focus-visible:shadow-[0_0_14px_rgba(220,38,38,0.14)]`}
                    >
                      <Icon />
                    </a>
                  </TooltipWrapper>
                )
              })}
            </div>
          </div>

          {/* Center: Logo & Name */}
          <div className="order-1 lg:order-2 flex items-center gap-2">
            <button
              onClick={() => setShowHealth(true)}
              aria-label="Show API health"
              className="group p-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              <Image
                src="/images/avatar/snex.png"
                alt="Ethan Townsend"
                width={32}
                height={32}
                className="rounded-full transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105"
              />
            </button>
            <TooltipWrapper label="License & copyright notice">
              <a
                href={LICENSE_URL}
                onClick={(event) => {
                  event.preventDefault()
                  handleExternalClick(LICENSE_URL, true)
                }}
                className="inline-flex items-center rounded-md px-2 py-1.5 text-sm text-gray-400 hover:text-red-600 transition-[color,transform] duration-200 ease-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:text-red-500"
              >
                snxethan &copy; {new Date().getFullYear()}
              </a>
            </TooltipWrapper>
          </div>

          {/* Right: Domain Links */}
          <div className="order-2 lg:order-3">
            <div className="footer-links flex flex-col sm:flex-row items-center gap-2">
              <div className="flex gap-2">
                <Link href="https://snex.dev" className={domainLinkClass}>
                  snex.dev
                </Link>
                <Link href="https://snxethan.dev" className={domainLinkClass}>
                  snxethan.dev
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showHealth && <HealthModal onClose={() => setShowHealth(false)} />}
    </footer>
  )
}

export default Footer
