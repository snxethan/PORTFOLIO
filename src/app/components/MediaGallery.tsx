"use client"

import React, { useState } from "react"
import Image from "next/image"
import CardCollection from "./CardCollection"
import MediaModal from "./MediaModal"

interface MediaGalleryProps {
  images: string[]
  title: string
}

/**
 * Image-by-image gallery built on the same rail as the page sections (arrows,
 * edge fade, snapping), so it looks and scrolls like the rest of the site.
 * Clicking an image opens the shared media popup.
 */
const MediaGallery = ({ images, title }: MediaGalleryProps) => {
  const [openImage, setOpenImage] = useState<string | null>(null)
  const openIndex = openImage ? images.indexOf(openImage) : -1

  return (
    <>
      <CardCollection
        items={images}
        getKey={(src) => src}
        viewMode="rail"
        size="gallery"
        label={`${title} gallery`}
        renderCard={(src) => {
          const index = images.indexOf(src)
          return (
            <button
              type="button"
              onClick={() => setOpenImage(src)}
              className="relative block aspect-[16/10] w-full overflow-hidden rounded-lg border border-[#333333] bg-[#0a0a0a] transition-colors duration-200 hover:border-red-600/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              aria-label={`Open ${title} image ${index + 1} of ${images.length}`}
            >
              <Image
                src={src}
                alt={`${title} - image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-contain"
              />
              <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-gray-200">
                {index + 1} / {images.length}
              </span>
            </button>
          )
        }}
      />
      <MediaModal
        src={openImage}
        kind="image"
        alt={openIndex >= 0 ? `${title} - image ${openIndex + 1} of ${images.length}` : title}
        onClose={() => setOpenImage(null)}
      />
    </>
  )
}

export default MediaGallery
