"use client"

import { useEffect, useRef } from "react"

/*
 * Popups can stack (an image opened from inside a project popup). Two things
 * must then behave like a stack rather than like independent listeners:
 *
 * - Escape closes only the top-most popup. With one window listener per popup,
 *   every open popup would close at once.
 * - The page scroll lock is released only when the last popup closes. Saving
 *   and restoring `overflow` per popup breaks if they close out of order.
 */
const openLayers: number[] = []
let nextLayerId = 1
let scrollLockCount = 0
let overflowBeforeLock = ""

const lockScroll = () => {
  if (scrollLockCount === 0) {
    overflowBeforeLock = document.body.style.overflow
    document.body.style.overflow = "hidden"
  }
  scrollLockCount += 1
}

const unlockScroll = () => {
  scrollLockCount = Math.max(0, scrollLockCount - 1)
  if (scrollLockCount === 0) document.body.style.overflow = overflowBeforeLock
}

export function useModalLayer(active: boolean, onEscape: () => void) {
  const onEscapeRef = useRef(onEscape)

  useEffect(() => {
    onEscapeRef.current = onEscape
  }, [onEscape])

  useEffect(() => {
    if (!active) return

    const layerId = nextLayerId++
    openLayers.push(layerId)
    lockScroll()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      if (openLayers[openLayers.length - 1] !== layerId) return
      event.stopPropagation()
      onEscapeRef.current()
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      const index = openLayers.indexOf(layerId)
      if (index !== -1) openLayers.splice(index, 1)
      unlockScroll()
    }
  }, [active])
}
