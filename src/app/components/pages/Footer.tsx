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

  const footerStyle: React.CSSProperties = {
    background: "linear-gradient(to bottom, #d4d0c8, #bab8b0)",
    borderTop: "2px solid #ffffff",
    borderBottom: "2px solid #404040",
    padding: "4px 12px",
    fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
    fontSize: "11px",
    color: "#000000",
  }

  if (loading) {
    return (
      <footer style={footerStyle} className="w-full">
        <div className="max-w-8xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2 animate-pulse">
          <div style={{ height: 16, width: 120, background: "#c0bdb4" }} />
          <div className="flex items-center gap-2">
            <div style={{ width: 20, height: 20, background: "#c0bdb4" }} />
            <div style={{ height: 14, width: 140, background: "#c0bdb4" }} />
          </div>
          <div className="flex gap-3">
            <div style={{ height: 14, width: 60, background: "#c0bdb4" }} />
            <div style={{ height: 14, width: 80, background: "#c0bdb4" }} />
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer style={footerStyle} className="w-full">
      <div className="max-w-8xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2">
        {/* Left: Professional Links */}
        <div className="order-3 lg:order-1 flex items-center gap-2">
          {socialLinks.professional.map(({ label, icon, url, tooltip }) => {
            const Icon = Icons[icon as keyof typeof Icons]
            return (
              <TooltipWrapper key={label} label={tooltip}>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center"
                  style={{
                    background: "#d4d0c8",
                    borderTop: "1px solid #fff",
                    borderLeft: "1px solid #fff",
                    borderRight: "1px solid #404040",
                    borderBottom: "1px solid #404040",
                    width: "22px", height: "20px",
                    fontSize: "12px",
                    color: "#000080",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#c0bdb4")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#d4d0c8")}
                >
                  <Icon />
                </a>
              </TooltipWrapper>
            )
          })}
        </div>

        {/* Center: Logo & Name */}
        <div className="order-1 lg:order-2 flex items-center gap-2">
          <Image
            src="/images/avatar/snex.png"
            alt="Ethan Townsend"
            width={20}
            height={20}
            style={{ width: 20, height: 20, objectFit: "cover" }}
          />
          <TooltipWrapper label="My Portfolio">
            <a href="https://ethantownsend.dev" style={{ color: "#000080", textDecoration: "none", fontSize: "11px" }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
            >
              Ethan Townsend &copy; {new Date().getFullYear()}
            </a>
          </TooltipWrapper>
        </div>

        {/* Right: Domain Links */}
        <div className="order-2 lg:order-3 flex gap-3">
          <Link href="https://snex.dev" style={{ color: "#000080", fontSize: "11px" }}>
            snex.dev
          </Link>
          <Link href="https://snxethan.dev" style={{ color: "#000080", fontSize: "11px" }}>
            snxethan.dev
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
