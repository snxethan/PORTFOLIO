"use client"

import SpotifyWidget from "./SpotifyWidget"
import { useRef, useState } from "react"
import * as Icons from "react-icons/fa"
import { FaFilePdf } from "react-icons/fa"
import { socialLinks } from "@/app/data/socialLinks"
import Avatar from "./Avatar"
import TooltipWrapper from "../../ToolTipWrapper"
import PDFModalViewer from "../../PDFModalViewer"

const Sidebar = ({ className = "" }: { className?: string }) => {
  const clickSoundRef = useRef<HTMLAudioElement | null>(null)
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null)

  const handleAvatarClick = () => {
    clickSoundRef.current?.play()
  }

  return (
    <>
      {/* Win2K window panel */}
      <aside
        className={`w-full lg:w-72 self-start relative z-10 lg:sticky lg:top-2 my-4 ${className}`}
        style={{
          background: "#d4d0c8",
          borderTop: "2px solid #ffffff",
          borderLeft: "2px solid #ffffff",
          borderRight: "2px solid #404040",
          borderBottom: "2px solid #404040",
          fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
        }}
      >
        <audio ref={clickSoundRef} src="/sounds/yippe.mp3" preload="auto" />

        {/* Window title bar */}
        <div className="win-titlebar">
          <span style={{ fontSize: "11px" }}>👤 User Profile</span>
          <div className="ml-auto flex gap-1">
            <div style={{
              background: "#d4d0c8", borderTop: "1px solid #fff", borderLeft: "1px solid #fff",
              borderRight: "1px solid #404040", borderBottom: "1px solid #404040",
              width: "16px", height: "14px", fontSize: "9px", display: "flex",
              alignItems: "center", justifyContent: "center", color: "#000",
            }}>─</div>
            <div style={{
              background: "#d4d0c8", borderTop: "1px solid #fff", borderLeft: "1px solid #fff",
              borderRight: "1px solid #404040", borderBottom: "1px solid #404040",
              width: "16px", height: "14px", fontSize: "9px", display: "flex",
              alignItems: "center", justifyContent: "center", color: "#000",
            }}>□</div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-4">
          {/* Avatar */}
          <div
            className="relative w-28 h-28 mx-auto overflow-hidden cursor-pointer"
            style={{
              borderTop: "2px solid #808080",
              borderLeft: "2px solid #808080",
              borderRight: "2px solid #ffffff",
              borderBottom: "2px solid #ffffff",
            }}
            onClick={handleAvatarClick}
          >
            <Avatar />
          </div>

          {/* Name & Title */}
          <div className="mt-3 text-center">
            <h2 style={{ fontSize: "13px", fontWeight: "bold", color: "#000080" }}>
              Ethan Townsend
            </h2>
            <p style={{ fontSize: "11px", color: "#444444", marginTop: "2px" }}>Full Stack Software Developer</p>
            <p style={{ fontSize: "10px", color: "#666666", marginTop: "1px" }}>Salt Lake City, UT</p>
          </div>

          {/* Horizontal separator */}
          <div style={{ marginTop: "10px", marginBottom: "10px", borderTop: "1px solid #808080", borderBottom: "1px solid #ffffff" }} />

          {/* View Resume Button */}
          <div className="flex justify-center">
            <TooltipWrapper label="View Resume" url="/resume/EthanTownsend_Resume_march2026.pdf">
              <button
                onClick={() => setSelectedPDF('/resume/EthanTownsend_Resume_march2026.pdf')}
                aria-label="View Resume"
                className="win-btn flex items-center gap-1.5"
                style={{ fontSize: "11px", padding: "3px 12px" }}
              >
                <FaFilePdf style={{ fontSize: "12px" }} />
                <span>View Resume</span>
              </button>
            </TooltipWrapper>
          </div>

          {/* Horizontal separator */}
          <div style={{ marginTop: "10px", marginBottom: "10px", borderTop: "1px solid #808080", borderBottom: "1px solid #ffffff" }} />

          {/* Professional Links */}
          <div>
            <p style={{ fontSize: "10px", fontWeight: "bold", color: "#000000", marginBottom: "6px", textAlign: "center" }}>
              Links:
            </p>
            <div className="flex justify-center gap-4">
              {socialLinks.professional.map(({ label, icon, url, tooltip }) => {
                const Icon = Icons[icon as keyof typeof Icons]
                return (
                  <TooltipWrapper key={label} label={tooltip}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex items-center justify-center"
                      style={{
                        background: "#d4d0c8",
                        borderTop: "1px solid #fff",
                        borderLeft: "1px solid #fff",
                        borderRight: "1px solid #404040",
                        borderBottom: "1px solid #404040",
                        width: "28px", height: "28px",
                        fontSize: "14px",
                        color: "#000080",
                        cursor: "pointer",
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
          </div>

          {/* Spotify Widget */}
          <div className="mt-3">
            <SpotifyWidget />
          </div>
        </div>
      </aside>

      {selectedPDF && <PDFModalViewer pdfUrl={selectedPDF} onClose={() => setSelectedPDF(null)} />}
    </>
  )
}

export default Sidebar
