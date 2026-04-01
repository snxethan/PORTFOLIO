"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { FaSpotify } from "react-icons/fa"
import { useExternalLink } from "../../ExternalLinkHandler"
import TooltipWrapper from "../../ToolTipWrapper"

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
        setTrack(null) // Set the track to null if the response is not OK
        return
      }

      const data = await res.json() // Parse the response JSON
      setTrack(data) // Update the track state with the fetched data
    } catch {
      // Handle errors silently - set track to null
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

  const containerClasses = isAnimatingOut ? "animate-elastic-out" : "animate-elastic-in"

  return (
    <div
      className={`${containerClasses} max-w-md mx-auto`}
      style={{
        background: "#d4d0c8",
        borderTop: "1px solid #ffffff",
        borderLeft: "1px solid #ffffff",
        borderRight: "1px solid #404040",
        borderBottom: "1px solid #404040",
        fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
      }}
    >
      {/* Win2K group box title */}
      <div className="win-titlebar" style={{ fontSize: "10px", padding: "2px 4px" }}>
        <FaSpotify style={{ fontSize: "10px" }} />
        <span>Now Listening</span>
      </div>

      {loading ? (
        <div className="p-2 animate-pulse flex items-center gap-2">
          <div style={{ width: 36, height: 36, background: "#c0bdb4", borderTop: "1px solid #808080", borderLeft: "1px solid #808080", borderRight: "1px solid #fff", borderBottom: "1px solid #fff" }} />
          <div className="flex flex-col gap-1.5 flex-1">
            <div style={{ height: "10px", background: "#c0bdb4", borderRadius: 0 }} />
            <div style={{ height: "9px", background: "#c0bdb4", borderRadius: 0, width: "70%" }} />
          </div>
        </div>
      ) : (
        <div className="p-2">
          <TooltipWrapper label={track!.songUrl}>
            <button
              onClick={() => handleExternalClick(track!.songUrl)}
              className="flex items-center gap-2 w-full text-left"
              style={{ background: "transparent", border: "none", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#c0bdb4")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <Image
                src={track!.albumImageUrl}
                alt="Album Art"
                width={36}
                height={36}
                style={{
                  width: 36, height: 36, objectFit: "cover",
                  borderTop: "1px solid #808080", borderLeft: "1px solid #808080",
                  borderRight: "1px solid #fff", borderBottom: "1px solid #fff",
                }}
              />
              <div className="text-left overflow-hidden">
                <p style={{ fontSize: "11px", fontWeight: "bold", color: "#000000", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track!.title}</p>
                <p style={{ fontSize: "10px", color: "#444444", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track!.artist}</p>
              </div>
            </button>
          </TooltipWrapper>
          <div className="mt-1 flex justify-end">
            <TooltipWrapper label="My Spotify Profile">
              <button
                onClick={() => handleExternalClick("https://open.spotify.com/user/l7ypevjdnoaz97kdqkkwf832d")}
                aria-label="Spotify"
                className="win-btn flex items-center gap-1"
                style={{ fontSize: "9px", padding: "1px 5px", minWidth: "auto" }}
              >
                <FaSpotify style={{ fontSize: "9px" }} />
                <span>Open</span>
              </button>
            </TooltipWrapper>
          </div>
        </div>
      )}
    </div>
  )
}
