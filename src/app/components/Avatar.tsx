"use client"

import Image from "next/image"

const getSeasonalAvatar = (): string => {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()

  // 🎄 Christmas: Dec 15–31 (GIF before 25th, PNG after)
  if (month === 12 && day <= 25) return "/images/avatar/avatar_christmas2.gif"
  if (month === 12 && day >= 15) return "/images/avatar/avatar_christmas.png"

  // 🎃 Halloween
  if (month === 10 && day >= 25) return "/images/avatar/avatar_halloween.png"

  // 🎂 Birthday
  if (month === 8 && day === 11) return "/images/avatar/avatar_birthday.png"

  // 👤 Default
  return "/images/avatar/avatar.png"
}

const Avatar = () => {
  const avatarSrc = getSeasonalAvatar()
  const isGif = avatarSrc.endsWith(".gif")

  return isGif ? (
    <img
      src={avatarSrc}
      alt="Ethan Townsend"
      width={512}
      height={512}
      className="w-full h-full object-cover rounded-full"
    />
  ) : (
    <Image
      src={avatarSrc}
      alt="Ethan Townsend"
      width={512}
      height={512}
      className="w-full h-full object-cover rounded-full"
    />
  )
}

export default Avatar
