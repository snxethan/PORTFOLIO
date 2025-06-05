"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

// This component is used to display the avatar of the user. It will show a seasonal avatar based on the current date.
const getSeasonalAvatar = (): string => {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()

  // Check for special dates and return the corresponding avatar
  if (month == 12 && day < 25) return "/images/avatar/avatar_christmas.png" // Christmas
  if (month == 12 && day >= 25) return "/images/avatar/avatar_christmas2.gif" // Christmas & snowing
  if (month == 10) return "/images/avatar/avatar_halloween.png" // Halloween
  if (month == 8 && day == 11) return "/images/avatar/avatar_birthday.png" // Birthday
  if (month == 7) return "/images/avatar/avatar_summer.png" // Summer
  if (month == 6) return "/images/avatar/avatar_pride.png" // Pride month

  return "/images/avatar/avatar.png"
}

const Avatar = ({ isAnimated = false }: { isAnimated?: boolean }) => {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null) // Initialize avatarSrc to null

  useEffect(() => { 
    // Set the avatar source based on the current date
    setAvatarSrc(getSeasonalAvatar())
  }, [])

  // If avatarSrc is null, show a loading animation
  // This is useful for when the component is first mounted
  if (!avatarSrc) {
    return (
      <div className="w-full h-full rounded-full bg-[#333333] animate-pulse" />
    )
  }

  // Check if the avatar is a GIF
  const isGif = avatarSrc.endsWith(".gif")

  return (
    // Display the avatar image with the appropriate source
    // Use the isGif variable to determine if the image should be optimized
      <Image
        src={avatarSrc}
        alt="Ethan Townsend"
        width={512}
        height={512}
className={`w-full h-full object-cover rounded-full transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105
}`}
        unoptimized={isGif}
        priority
      />

  )
}

export default Avatar
