"use client"

import { useEffect, useState, useRef } from "react"
import { FaSpotify } from "react-icons/fa"
import { useExternalLink } from "../../ExternalLinkHandler"
import TooltipWrapper from "../../ToolTipWrapper"

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
  const [loading, setLoading] = useState(true)
  const { handleExternalClick } = useExternalLink()
  const lastFetchedRef = useRef<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchTrack = async () => {
    const now = Date.now()
    if (now - lastFetchedRef.current < 30000) return
    lastFetchedRef.current = now

    try {
      const res = await fetch("/api/spotify/now-playing")
      const contentType = res.headers.get("content-type")

      if (!res.ok || !contentType?.includes("application/json")) {
        const text = await res.text()
        console.warn("Non-JSON response from /api/spotify/now-playing:", text.slice(0, 200))
        setTrack(null)
        return
      }

      const data = await res.json()
      setTrack(data)
    } catch (err) {
      console.error("Error fetching Spotify data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrack()
    intervalRef.current = setInterval(fetchTrack, 30000)

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) clearInterval(intervalRef.current)
      } else {
        fetchTrack()
        intervalRef.current = setInterval(fetchTrack, 30000)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  if (loading) {
    return (
      <div className="bg-[#222222] border border-[#333333] rounded-xl p-4 shadow-md animate-pulse">
        <div className="flex justify-center items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-[#333333] rounded-full" />
          <span className="h-4 bg-[#333333] w-24 rounded"></span>
        </div>
        <div className="flex items-center justify-center gap-4 p-2">
          <div className="w-12 h-12 bg-[#333333] rounded"></div>
          <div className="flex flex-col gap-2 w-3/5">
            <div className="h-4 bg-[#333333] rounded w-full"></div>
            <div className="h-3 bg-[#333333] rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!track || !track.title) return null

  return (
    <div className="bg-[#222222] border border-[#333333] rounded-xl p-4 shadow-md">
      {/* Top: Spotify icon + label centered */}
      <div className="flex justify-center items-center gap-2 mb-2">
        <TooltipWrapper label="My Spotify Profile">
        <button
          onClick={() =>
            handleExternalClick("https://open.spotify.com/user/l7ypevjdnoaz97kdqkkwf832d")
          }
          aria-label="Spotify"
          className="text-gray-400 hover:text-red-500 transition-colors text-xl"
        >
          <FaSpotify />
        </button>
        </TooltipWrapper>
        <span className="text-gray-400 text-sm">now listening:</span>
      </div>

      {/* Track info */}
      <TooltipWrapper label={track.songUrl}>
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
      </TooltipWrapper>

  
    </div>
  )
}
