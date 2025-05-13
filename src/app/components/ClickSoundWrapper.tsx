"use client"

import { type ReactNode, useCallback } from "react"

interface ClickSoundWrapperProps {
  children: ReactNode
}

const ClickSoundWrapper = ({ children }: ClickSoundWrapperProps) => {
  const handleClick = useCallback(() => {
    // Play the click sound
    const clickSound = new Audio("sounds/click.mp3")
    clickSound.volume = 0.5 // You can adjust volume as needed
    clickSound.play().catch((err) => {
      // Handle any errors with audio playback silently
      console.log("Audio playback error:", err)
    })
  }, [])

  // Wrap the children in a div with the click handler
  return (
    <div onClick={handleClick} style={{ display: "contents" }} data-click-sound-wrapper>
      {children}
    </div>
  )
}

export default ClickSoundWrapper
