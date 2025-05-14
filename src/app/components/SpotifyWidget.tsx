"use client"

import { useEffect, useState } from "react"
import { FaSpotify } from "react-icons/fa"
import { useExternalLink } from "../components/ExternalLinkHandler" 

interface Track {
  isPlaying: boolean
  title: string
  artist: string
  album: string
  albumImageUrl: string
  songUrl: string
}

export default function SpotifyWidget() {
  const [track, setTrack] = useState<Track | null>(null)
  const { handleExternalClick } = useExternalLink()

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const res = await fetch("/api/spotify/now-playing")
        const data = await res.json()
        setTrack(data)
      } catch (err) {
        console.error("Error fetching Spotify data", err)
      }
    }

    fetchTrack()
    const interval = setInterval(fetchTrack, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!track || !track.title) return null

  return (
<div className="bg-[#222222] border border-[#333333] rounded-xl p-4 shadow-md">
  {/* Top: Spotify icon + label centered */}
  <div className="flex justify-center items-center gap-2 mb-2">
    <button
      onClick={() =>
        handleExternalClick("https://open.spotify.com/user/l7ypevjdnoaz97kdqkkwf832d")
      }
      aria-label="Spotify"
      className="text-gray-400 hover:text-red-500 transition-colors text-xl"
    >
      <FaSpotify />
    </button>
    <span className="text-gray-400 text-sm">now listening:</span>
  </div>

  {/* Track info: image left, text right, centered in widget */}
  <button
    onClick={() => handleExternalClick(track.songUrl)}
    className="relative flex items-center justify-center gap-4 p-2 rounded-lg transition group w-full"
  >
    <img
      src={track.albumImageUrl}
      alt="Album Art"
      className="w-12 h-12 rounded object-cover border border-[#333333]"
    />
    <div className="text-left">
      <p className="text-white font-semibold leading-tight">{track.title}</p>
      <p className="text-gray-400 text-sm">{track.artist}</p>
    </div>

    <div className="absolute -inset-0.5 rounded-lg opacity-10 blur-sm transition duration-300 group-hover:opacity-10 group-hover:bg-gradient-to-r group-hover:from-red-700 group-hover:to-red-500 z-0"></div>
  </button>
</div>

  )
}
