"use client"

import { useEffect, useState, useRef } from "react"
import { FaSpotify } from "react-icons/fa"
import { useExternalLink } from "../../ExternalLinkHandler"
import TooltipWrapper from "../../ToolTipWrapper"
import Image from "next/image"

// This component fetches the currently playing track from Spotify and displays it in a widget.
// It updates every 30 seconds and shows a loading animation while fetching data.

// The widget includes a link to the user's Spotify profile and a button to open the currently playing track in Spotify.
// The widget also includes a loading animation and a fade-out effect when the track is not playing.


interface Track { // Represents the track data
  isPlaying: boolean 
  title: string
  artist: string
  album: string
  albumImageUrl: string
  songUrl: string
}

// The Track interface defines the structure of the track data returned from the Spotify API.
export default function SpotifyWidget() {
  const [track, setTrack] = useState<Track | null>(null) // State to store the track data
  const [loading, setLoading] = useState(true) // State to control the loading state of the widget
  const [isVisible, setIsVisible] = useState(false) // State to control the visibility of the widget
  const [isAnimatingOut, setIsAnimatingOut] = useState(false) // State to control the fade-out animation of the widget
  const lastFetchedRef = useRef<number>(0) // Reference to store the last fetched time
  const intervalRef = useRef<NodeJS.Timeout | null>(null) // Reference to store the interval ID
  const { handleExternalClick } = useExternalLink() // Function to handle external link clicks

  // This function fetches the currently playing track from the Spotify API.
  // It updates the track state and handles errors.
  const fetchTrack = async () => { 
    const now = Date.now() // Get the current time in milliseconds
    if (now - lastFetchedRef.current < 30000) return // If the last fetch was less than 30 seconds ago, do not fetch again
    lastFetchedRef.current = now // Update the last fetched time

    try { // Fetch the currently playing track from the Spotify API
      const res = await fetch("/api/spotify/now-playing") 
      const contentType = res.headers.get("content-type") // Get the content type of the response

      if (!res.ok || !contentType?.includes("application/json")) { // Check if the response is not OK or not JSON
        const text = await res.text() // Get the response text
        console.warn("Non-JSON response from /api/spotify/now-playing:", text.slice(0, 200)) // Log the response text
        setTrack(null) // Set the track to null if the response is not OK
        return
      }

      const data = await res.json() // Parse the response JSON
      setTrack(data) // Update the track state with the fetched data
    } catch (err) { 
      console.error("Error fetching Spotify data", err) // Log any errors that occur during the fetch
    } finally {
      setLoading(false)
    }
  }

  // This function handles the click event for external links.
  useEffect(() => {
    fetchTrack() // Fetch the track data when the component mounts
    intervalRef.current = setInterval(fetchTrack, 30000) // Set an interval to fetch the track data every 30 seconds

    const handleVisibilityChange = () => { // This function handles the visibility change event
      if (document.hidden) { // If the document is hidden (not visible)
        if (intervalRef.current) clearInterval(intervalRef.current) // Clear the interval to stop fetching data
      } else { 
        fetchTrack() // Fetch the track data again when the document becomes visible
        intervalRef.current = setInterval(fetchTrack, 30000) // Set the interval again
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange) // Add the visibility change event listener

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current) // Clear the interval when the component unmounts
      document.removeEventListener("visibilitychange", handleVisibilityChange) // Remove the visibility change event listener
    }
  }, [])

  useEffect(() => { // This effect handles the visibility and animation of the widget
    if (!loading && track && track.title) { // If the track is loaded and has a title
      setIsVisible(true) // Show the widget
    } else if (!loading && !track?.title && isVisible) { // If the track is not playing and the widget is visible
      setIsAnimatingOut(true) // Start the fade-out animation
      setTimeout(() => { // After 300ms, hide the widget
        setIsAnimatingOut(false) // Reset the animation state
        setIsVisible(false) // Hide the widget
      }, 300) // Set a timeout to hide the widget after the animation
    }
  }, [loading, track, isVisible]) 

  if (!isVisible && !isAnimatingOut) return null // If the widget is not visible and not animating out, return null

  // This is the main container for the widget. It has a dark background, rounded corners, and a shadow effect.
  const containerClasses = `bg-[#222222] border border-[#333333] rounded-xl p-4 shadow-md ${
    loading ? "animate-pulse animate-elastic-in" :
    isAnimatingOut ? "animate-elastic-out" :
    "animate-elastic-in"
  }`

  // The container has a gradient background and a shadow effect when the track is playing.
  return (
  <div className={`${containerClasses} max-w-md mx-auto`}>
      {/* Loading state: Show a skeleton loader while the track is loading */}
      {loading ? (
        <>
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
        </>
      ) : (
        <>
          <div className="flex items-center justify-center gap-2 mb-2">
          <TooltipWrapper label="My Spotify Profile">
            <button
              onClick={() =>
                handleExternalClick("https://open.spotify.com/user/l7ypevjdnoaz97kdqkkwf832d")
              }
              aria-label="Spotify"
              className="text-gray-400 hover:text-red-500 transition-colors text-lg flex items-center"
            >
              <FaSpotify />
            </button>
          </TooltipWrapper>
          <span className="text-gray-400 text-sm leading-none">now listening:</span>
        </div>
        <div className="flex items-center justify-center">
          <TooltipWrapper label={track!.songUrl}> {/* Tooltip to show the song URL */}
            <button
              onClick={() => handleExternalClick(track!.songUrl)}
              className="relative flex items-center justify-center gap-4 p-2 rounded-lg transition group w-full"
            >
              <Image
                src={track!.albumImageUrl}
                alt="Album Art"
                width={48}
                height={48}
                className="w-12 h-12 rounded object-cover border border-[#333333]"
              />
              <div className="text-left">
                <p className="text-white font-semibold leading-tight">{track!.title}</p>
                <p className="text-gray-400 text-sm">{track!.artist}</p>
              </div>
              <div className="absolute -inset-0.5 rounded-lg opacity-10 blur-sm transition duration-300 group-hover:opacity-10 group-hover:bg-gradient-to-r group-hover:from-red-700 group-hover:to-red-500 z-0"></div>
            </button>
          </TooltipWrapper>
                  </div>

        </>
      )}
    </div>
  )
}
