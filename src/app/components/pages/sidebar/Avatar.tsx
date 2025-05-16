"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

const getSeasonalAvatar = (): string => {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()

  if (month === 12 && day <= 25) return "/images/avatar/avatar_christmas2.gif"
  if (month === 12 && day >= 15) return "/images/avatar/avatar_christmas.png"
  if (month === 10 && day >= 25) return "/images/avatar/avatar_halloween.png"
  if (month === 8 && day === 11) return "/images/avatar/avatar_birthday.png"

  return "/images/avatar/avatar.png"
}

const Avatar = () => {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)

  useEffect(() => {
    // Prevent mismatch with SSR by determining avatar on client
    setAvatarSrc(getSeasonalAvatar())
  }, [])

  if (!avatarSrc) {
    return (
      <div className="w-full h-full rounded-full bg-[#333333] animate-pulse" />
    )
  }

  const isGif = avatarSrc.endsWith(".gif")

  return (
    <Image
      src={avatarSrc}
      alt="Ethan Townsend"
      width={512}
      height={512}
      className="w-full h-full object-cover rounded-full"
      unoptimized={isGif} // GIFs work better unoptimized
      priority
    />
  )
}

export default Avatar
