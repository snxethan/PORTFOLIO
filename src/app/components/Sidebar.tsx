"use client"

import { useRef } from "react"
import Image from "next/image"
import SpotifyWidget from "./SpotifyWidget"
import {
  FaDiscord,
  FaEnvelope,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaSteam,
} from "react-icons/fa"
import { useExternalLink } from "../components/ExternalLinkHandler" 
import Status from "./Status"

const Sidebar = () => {
  const clickSoundRef = useRef<HTMLAudioElement | null>(null)
  const { handleExternalClick } = useExternalLink()

  const handleAvatarClick = () => {
    clickSoundRef.current?.play()
  }

  return (
    <>
      <aside className="w-full lg:w-80 bg-[#222222] rounded-xl border border-[#333333] shadow-lg p-6 lg:sticky lg:top-8 self-start relative z-10">
        <audio ref={clickSoundRef} src="/sounds/yippe.mp3" preload="auto" />

        {/* Avatar */}
        <div
          className="relative w-32 h-32 mx-auto rounded-full overflow-hidden group cursor-pointer"
          onClick={handleAvatarClick}
        >
          <div className="absolute -inset-0.5 rounded-full opacity-0 blur-sm transition duration-300 group-hover:opacity-5 group-hover:bg-gradient-to-r group-hover:from-red-700 group-hover:to-red-500"></div>
          <Image
            src="/images/avatar.png"
            alt="Ethan Townsend"
            width={128}
            height={128}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Ethan Townsend
          </h2>
          <p className="text-gray-400">Software Engineer</p>
        </div>

        {/* Professional Links */}
        <div className="mt-6">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#333333] to-transparent"></div>
          <div className="flex justify-center space-x-6 mt-4">
            <a
              href="mailto:ethantownsend73@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email"
              className="text-gray-300 hover:text-red-600 transition-colors text-2xl"
            >
              <FaEnvelope />
            </a>
            <button
              onClick={() => handleExternalClick("https://github.com/snxethan", true)}
              aria-label="GitHub"
              className="text-gray-300 hover:text-red-600 transition-colors text-2xl"
            >
          <FaGithub />
          </button>
            {/* LinkedIn (professional) */}
            <button
              onClick={() => handleExternalClick("https://www.linkedin.com/in/ethan-townsend-630aa4294/", true)}
              aria-label="LinkedIn"
              className="text-gray-300 hover:text-red-600 transition-colors text-2xl"
            >
              <FaLinkedin />
            </button>
          </div>
        </div>

        {/* Personal Links */}
        <div className="mt-6">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#333333] to-transparent"></div>
          <div className="flex justify-center space-x-5 mt-4">
            <button
              onClick={() => handleExternalClick("https://instagram.com/snxethan")}
              aria-label="Instagram"
              className="text-gray-400 hover:text-red-500 transition-colors text-lg"
            >
              <FaInstagram />
            </button>
            <button
              onClick={() => handleExternalClick("http://discord.com/users/250059394799239169")}
              aria-label="Discord"
              className="text-gray-400 hover:text-red-500 transition-colors text-lg"
            >
              <FaDiscord />
            </button>
            <button
              onClick={() => handleExternalClick("https://steamcommunity.com/id/snxethan/")}
              aria-label="Steam"
              className="text-gray-400 hover:text-red-500 transition-colors text-lg"
            >
              <FaSteam />
            </button>
          </div>
        </div>

        <div className="mt-6">
          <SpotifyWidget/>
        </div>

        <div className="mt-6">
          <Status/>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
