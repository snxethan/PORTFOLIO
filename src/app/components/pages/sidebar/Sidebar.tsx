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
      <aside className={`w-full lg:w-80 bg-[#222222] rounded-xl border border-[#333333] shadow-lg p-6 self-start relative z-10 lg:sticky lg:top-2 my-8 ${className}`}>
        <audio ref={clickSoundRef} src="/sounds/yippe.mp3" preload="auto" />

        {/* Avatar */}
        <div
          className="relative w-32 h-32 mx-auto rounded-full overflow-hidden group cursor-pointer transition-transform duration-300 ease-out hover:scale-105 active:scale-100"
          onClick={handleAvatarClick}
        >
          <div className="absolute -inset-0.5 rounded-full opacity-0 blur-sm transition duration-300 group-hover:opacity-5 group-hover:bg-gradient-to-r group-hover:from-red-700 group-hover:to-red-500"></div>
          <Avatar />
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Ethan Townsend
          </h2>
          <p className="text-gray-300">Full Stack Software Developer</p>
          <p className="text-gray-400 text-sm mt-1">Salt Lake City, UT</p>
        </div>

        {/* View Resume Button */}
        <div className="mt-6 flex justify-center">
          <TooltipWrapper label="View Resume" url="/resume/EthanTownsend_Resume_march2026.pdf">
            <button
              onClick={() => setSelectedPDF('/resume/EthanTownsend_Resume_march2026.pdf')}
              aria-label="View Resume"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95 text-sm font-medium shadow-lg shadow-red-600/40"
            >
              <FaFilePdf />
              <span>View Resume</span>
            </button>
          </TooltipWrapper>
        </div>

        {/* Professional Links */}
        <div className="mt-6">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#333333] to-transparent"></div>
          <div className="flex justify-center space-x-6 mt-4">
            {socialLinks.professional.map(({ label, icon, url, tooltip }) => {
              const Icon = Icons[icon as keyof typeof Icons]
              return (
                <TooltipWrapper key={label} label={tooltip}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-gray-300 hover:text-red-600 text-2xl transition-all duration-200 ease-out hover:scale-125 active:scale-100"
                  >
                    <Icon />
                  </a>
                </TooltipWrapper>
              )
            })}
          </div>
        </div>

        {/* Spotify Widget */}
        <div className="mt-6">
          <SpotifyWidget />
        </div>
      </aside>

      {selectedPDF && <PDFModalViewer pdfUrl={selectedPDF} onClose={() => setSelectedPDF(null)} />}
    </>
  )
}

export default Sidebar
