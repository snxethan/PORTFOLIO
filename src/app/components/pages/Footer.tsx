"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import TooltipWrapper from "../ToolTipWrapper"
import * as Icons from "react-icons/fa"
import { socialLinks } from "../../data/socialLinks"

const Footer = () => {
  const [loading, setLoading] = useState(true)

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
                      className={`inline-flex items-center justify-center ${isLinkedIn ? "rounded-none" : "rounded-full"} p-1 text-gray-400 hover:text-red-600 text-xl transition-all duration-200 ease-out hover:scale-125 active:scale-100 hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.48)] hover:shadow-[0_0_14px_rgba(220,38,38,0.14)] focus-visible:outline-none focus-visible:text-red-500 focus-visible:drop-shadow-[0_0_10px_rgba(220,38,38,0.48)] focus-visible:shadow-[0_0_14px_rgba(220,38,38,0.14)]`}
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
            <Image
              src="/images/avatar/snex.png"
              alt="Ethan Townsend"
              width={32}
              height={32}
              className="rounded-full transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
            />
            <TooltipWrapper label="My Portfolio">
              <a href="https://ethantownsend.dev" className="inline-flex items-center text-sm text-gray-400 hover:text-red-600 transition-all duration-200 ease-out hover:scale-105 active:scale-100 focus-visible:outline-none focus-visible:text-red-500 focus-visible:scale-105">
                Ethan Townsend &copy; {new Date().getFullYear()}
              </a>
            </TooltipWrapper>
          </div>

          {/* Right: Domain Links */}
          <div className="order-2 lg:order-3">
            <div className="footer-links flex flex-col sm:flex-row items-center gap-2">
              <div className="flex gap-4">
                <Link href="https://snex.dev" className="inline-flex items-center hover:text-red-600 transition-all duration-200 ease-out hover:scale-105 active:scale-100 focus-visible:outline-none focus-visible:text-red-500 focus-visible:scale-105">
                  snex.dev
                </Link>
                <Link href="https://snxethan.dev" className="inline-flex items-center hover:text-red-600 transition-all duration-200 ease-out hover:scale-105 active:scale-100 focus-visible:outline-none focus-visible:text-red-500 focus-visible:scale-105">
                  snxethan.dev
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer