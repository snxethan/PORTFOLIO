"use client"

import SpotifyWidget from "./SpotifyWidget"
import { useEffect, useState, useRef } from "react"
import * as Icons from "react-icons/fa";
import { socialLinks } from "@/app/data/socialLinks";
import { useExternalLink } from "../../ExternalLinkHandler"
import Status from "./Status"
import Avatar from "./Avatar"
import TooltipWrapper from "../../ToolTipWrapper"

// This component is used to display the sidebar of the website. It contains the user's avatar, professional links, personal links, and a Spotify widget.
// The sidebar is styled using Tailwind CSS classes. It is responsive and will adjust its size based on the screen size.
// The sidebar is sticky and will remain in view when the user scrolls down the page.
// The sidebar also includes a sound effect that plays when the user clicks on the avatar.

const Sidebar = ({ className = "" }: { className?: string }) => {
  const clickSoundRef = useRef<HTMLAudioElement | null>(null) // Reference to the audio element for the click sound
  const { handleExternalClick } = useExternalLink() // Function to handle external link clicks
  const [isHovered, setIsHovered] = useState(false) // State to control the hover effect on the avatar

  const handleAvatarClick = () => { // Function to handle the avatar click event
    clickSoundRef.current?.play()
  }

  const [loading, setLoading] = useState(true) // State to control the loading state of the sidebar

    useEffect(() => {
      setLoading(false) // Set loading to false after 1 second
    }, [])


  return (
    <>
      {loading ? (
        // Loading state: Show a skeleton loader while the sidebar is loading
        // This is a placeholder for the sidebar content while it is loading.
        <aside className={`w-full md:max-w-md lg:w-80 bg-[#222222] rounded-xl border border-[#333333] shadow-lg p-6 pt-8 lg:sticky lg:top-8 self-start relative z-10 mx-auto lg:mx-0 ${className}`}>
          <div className="w-32 h-32 mx-auto rounded-full bg-[#333333]" />
          <div className="mt-4 text-center space-y-2">
            <div className="h-6 w-40 bg-[#333333] mx-auto rounded" />
            <div className="h-4 w-24 bg-[#333333] mx-auto rounded" />
          </div>
          <div className="mt-6 flex justify-center space-x-6">
            {[...Array(3)].map((_, i) => ( // Placeholder for the professional links
              <div key={i} className="w-6 h-6 bg-[#333333] rounded-full" />
            ))}
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            {[...Array(3)].map((_, i) => ( // Placeholder for the personal links
              <div key={i} className="w-4 h-4 bg-[#333333] rounded-full" />
            ))}
          </div>
          <div className="mt-6 h-20 bg-[#333333] rounded" />
          <div className="mt-6 h-12 bg-[#333333] rounded" />
        </aside>
      ) : (
        <aside className={`w-full lg:w-80 bg-[#222222] rounded-xl border border-[#333333] shadow-lg p-6 lg:sticky lg:top-8 self-start relative z-10 ${className}`}>
          <audio ref={clickSoundRef} src="/sounds/yippe.mp3" preload="auto" />

          {/* Avatar */}
            <div
            className="relative w-32 h-32 mx-auto rounded-full overflow-hidden group cursor-pointer transition-transform duration-300 ease-out hover:scale-105 active:scale-100"
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
              {socialLinks.professional.map(({ label, icon, url, tooltip }) => {
                const Icon = Icons[icon as keyof typeof Icons]
                return (
                  <TooltipWrapper key={label} label={tooltip}>
                    {url.startsWith("mailto:") ? (
                      <a
                        href={url}
                        aria-label={label}
                        className="text-gray-300 hover:text-red-600 text-2xl transition-transform duration-200 ease-out hover:scale-125 active:scale-100"
                      >
                        <Icon />
                      </a>
                    ) : (
                      <button
                        onClick={() => handleExternalClick(url)}
                        aria-label={label}
                        className="text-gray-300 hover:text-red-600 text-2xl transition-transform duration-200 ease-out hover:scale-125 active:scale-100"
                      >
                        <Icon />
                      </button>
                    )}
                  </TooltipWrapper>
                )
              })}
            </div>
          </div>
          {/* Personal Links */}
          <div className="mt-6">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#333333] to-transparent"></div>
            <div className="flex justify-center space-x-5 mt-4">
              {socialLinks.personal.map(({ label, icon, url, tooltip }) => {
                const Icon = Icons[icon as keyof typeof Icons]
                return (
                  <TooltipWrapper key={label} label={tooltip}>
                    <button
                      onClick={() => handleExternalClick(url)}
                      aria-label={label}
                      className="text-gray-400 hover:text-red-600 text-lg transition-transform duration-200 ease-out hover:scale-125 active:scale-100"
                    >
                      <Icon />
                    </button>
                  </TooltipWrapper>
                )
              })}
            </div>
          </div>
          {/* Divider */}
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
