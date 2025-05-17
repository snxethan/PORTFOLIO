"use client"

import SpotifyWidget from "./SpotifyWidget"
import { useEffect, useState, useRef } from "react"
import {
  FaDiscord,
  FaEnvelope,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaSteam,
} from "react-icons/fa"
import { useExternalLink } from "../../ExternalLinkHandler"
import Status from "./Status"
import Avatar from "./Avatar"
import TooltipWrapper from "../../ToolTipWrapper"

const Sidebar = () => {
  const clickSoundRef = useRef<HTMLAudioElement | null>(null)
  const { handleExternalClick } = useExternalLink()
  const [isHovered, setIsHovered] = useState(false)

  const handleAvatarClick = () => {
    clickSoundRef.current?.play()
  }

  const [loading, setLoading] = useState(true)

    useEffect(() => {
      setLoading(false)
    }, [])


  return (
    <>
      {loading ? (
      <aside className="w-full lg:w-80 bg-[#222222] rounded-xl border border-[#333333] shadow-lg p-6 lg:sticky lg:top-8 self-start relative z-10">
          <div className="w-32 h-32 mx-auto rounded-full bg-[#333333]" />
          <div className="mt-4 text-center space-y-2">
            <div className="h-6 w-40 bg-[#333333] mx-auto rounded" />
            <div className="h-4 w-24 bg-[#333333] mx-auto rounded" />
          </div>
          <div className="mt-6 flex justify-center space-x-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-6 h-6 bg-[#333333] rounded-full" />
            ))}
          </div>
          <div className="mt-6 flex justify-center space-x-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-5 h-5 bg-[#333333] rounded-full" />
            ))}
          </div>
          <div className="mt-6 h-20 bg-[#333333] rounded" />
          <div className="mt-6 h-12 bg-[#333333] rounded" />
        </aside>
      ) : (
        <aside className="w-full lg:w-80 bg-[#222222] rounded-xl border border-[#333333] shadow-lg p-6 lg:sticky lg:top-8 self-start relative z-10">
          <audio ref={clickSoundRef} src="/sounds/yippe.mp3" preload="auto" />

          {/* Avatar */}
              <div
                className="relative w-32 h-32 mx-auto rounded-full overflow-hidden group cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleAvatarClick}
              >
                <div className="absolute -inset-0.5 rounded-full opacity-0 blur-sm transition duration-300 group-hover:opacity-5 group-hover:bg-gradient-to-r group-hover:from-red-700 group-hover:to-red-500"></div>
                <Avatar isAnimated={isHovered} />
              </div>


          <div className="mt-4 text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent transition-transform duration-200 ease-out hover:scale-110">
          Ethan Townsend
        </h2>

            <p className="text-gray-400">Full Stack Software Developer</p>
          </div>

          {/* Professional Links */}
          <div className="mt-6">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#333333] to-transparent"></div>
            <div className="flex justify-center space-x-6 mt-4">
              <TooltipWrapper label="snxethan@gmail.com">
              <a
                href="mailto:snxethan@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email"
                className="text-gray-300 hover:text-red-600 text-2xl transition-transform duration-200 ease-out hover:scale-125 active:scale-100"
              >
                <FaEnvelope />
              </a>
              </TooltipWrapper>
            <TooltipWrapper label="My GitHub Profile">
            <button
              onClick={() => handleExternalClick("https://github.com/snxethan", true)}
              aria-label="GitHub"
              className="text-gray-300 hover:text-red-600 text-2xl transition-transform duration-200 ease-out hover:scale-125 active:scale-100"
            >
              <FaGithub />
            </button>
          </TooltipWrapper>

              <TooltipWrapper label="My LinkedIn Profile">
              <button
                onClick={() =>
                  handleExternalClick("https://www.linkedin.com/in/snxethan/", true)
                }
                aria-label="LinkedIn"
              className="text-gray-300 hover:text-red-600 text-2xl transition-transform duration-200 ease-out hover:scale-125 active:scale-100"
              >
                <FaLinkedin />
              </button>
              </TooltipWrapper>
            </div>
          </div>

          {/* Personal Links */}
          <div className="mt-6">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#333333] to-transparent"></div>
            <div className="flex justify-center space-x-5 mt-4">
            <TooltipWrapper label="My Instagram Profile">
              <button
                onClick={() => handleExternalClick("https://instagram.com/snxethan")}
                aria-label="Instagram"
              className="text-gray-400 hover:text-red-600 text-lg transition-transform duration-200 ease-out hover:scale-125 active:scale-100"
              >
                <FaInstagram />
              </button>
              </TooltipWrapper>
              <TooltipWrapper label="My Discord Profile">
              <button
                onClick={() => handleExternalClick("http://discord.com/users/250059394799239169")}
                aria-label="Discord"
              className="text-gray-400 hover:text-red-600 text-lg transition-transform duration-200 ease-out hover:scale-125 active:scale-100"
              >
                <FaDiscord />
              </button>
              </TooltipWrapper>
              <TooltipWrapper label="My Steam Profile">
              <button
                onClick={() => handleExternalClick("https://steamcommunity.com/id/snxethan/")}
                aria-label="Steam"
              className="text-gray-400 hover:text-red-600 text-lg transition-transform duration-200 ease-out hover:scale-125 active:scale-100"
              >
                <FaSteam />
              </button>
              </TooltipWrapper>
            </div>
          </div>

          <div className="mt-6">
            <SpotifyWidget />
          </div>

          <div className="mt-6">
            <Status />
          </div>
        </aside>
      )}
    </>
  )

}

export default Sidebar
