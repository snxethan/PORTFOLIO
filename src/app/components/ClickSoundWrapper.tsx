"use client"
import React, { useRef } from "react"

interface ClickSoundWrapperProps {
  children: React.ReactElement
  sound?: string // optional override
}

const ClickSoundWrapper: React.FC<ClickSoundWrapperProps> = ({
  children,
  sound = "/sounds/click.mp3",
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleClick = (e: React.MouseEvent) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }

    // Call child's onClick if it exists
    if (children.props.onClick) {
      children.props.onClick(e)
    }
  }

  return (
    <>
      <audio ref={audioRef} src={sound} preload="auto" />
      {React.cloneElement(children, {
        onClick: handleClick,
      })}
    </>
  )
}

export default ClickSoundWrapper
