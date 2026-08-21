"use client"

import React, { useCallback, useEffect, useState } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

interface ScrollArrowsProps {
  /** The horizontally scrolling element these arrows drive. */
  containerRef: React.RefObject<HTMLDivElement | null>
  /**
   * Selector for a single card, used to measure one scroll step. Falls back to
   * 80% of the visible width when no card matches.
   */
  cardSelector: string
  /** Re-measure when the rendered set changes (filters, sorts, tags). */
  resetKey?: string
}

// Translucent and backdrop-blurred so the arrow reads as sitting *in* the edge
// gradient rather than as a hard chip stamped on top of it. Shown on mobile
// too — touch users have the same trouble reaching the next card.
const arrowBaseClass =
  "absolute top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#151515]/60 backdrop-blur-sm text-gray-300 border border-white/10 shadow-md shadow-black/30 transition-all duration-200 hover:bg-[#252525]/90 hover:border-red-600/60 hover:text-[#dc2626] hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none"

/**
 * Prev/next controls for a horizontal card scroller.
 *
 * These render as a sibling of the scroller rather than a child: the scroller
 * carries a mask-image edge fade, and anything inside it gets faded out too.
 */
const ScrollArrows = ({ containerRef, cardSelector, resetKey }: ScrollArrowsProps) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Ask "is there a card off either edge?" rather than comparing scrollLeft
    // against scrollWidth. Scroll-snap parks the first card a few px in from
    // the leading inset, so a scrollLeft-based test reports "can scroll left"
    // while the first card is still the one on screen.
    const update = () => {
      const cards = el.querySelectorAll(cardSelector)
      if (cards.length === 0) {
        setCanScrollLeft(false)
        setCanScrollRight(false)
        return
      }

      const box = el.getBoundingClientRect()
      const tolerance = 4
      let hasLeft = false
      let hasRight = false

      cards.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect()
        if (rect.left < box.left - tolerance) hasLeft = true
        if (rect.right > box.right + tolerance) hasRight = true
      })

      setCanScrollLeft(hasLeft)
      setCanScrollRight(hasRight)
    }

    update()
    el.addEventListener("scroll", update, { passive: true })

    // Observe the content row as well as the scroller: adding or removing
    // cards does not change the scroller's own box, so observing only `el`
    // would miss it and leave the arrows stuck in their mount-time state.
    const observer = new ResizeObserver(update)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)

    // Late-settling layout (fonts, images) can change overflow after mount.
    const settleTimer = window.setTimeout(update, 250)

    return () => {
      el.removeEventListener("scroll", update)
      observer.disconnect()
      window.clearTimeout(settleTimer)
    }
  }, [containerRef, cardSelector, resetKey])

  // Advance by one card plus the flex gap, so each press lands on the next card.
  const scrollByCard = useCallback(
    (direction: 1 | -1) => {
      const el = containerRef.current
      if (!el) return

      const card = el.querySelector(cardSelector)
      const step = card
        ? (card as HTMLElement).getBoundingClientRect().width + 24
        : el.clientWidth * 0.8

      el.scrollBy({ left: step * direction, behavior: "smooth" })
    },
    [containerRef, cardSelector]
  )

  return (
    <>
      <button
        type="button"
        aria-label="Scroll to previous card"
        onClick={() => scrollByCard(-1)}
        disabled={!canScrollLeft}
        className={`${arrowBaseClass} left-1`}
      >
        <FaChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        aria-label="Scroll to next card"
        onClick={() => scrollByCard(1)}
        disabled={!canScrollRight}
        className={`${arrowBaseClass} right-1`}
      >
        <FaChevronRight className="w-4 h-4" />
      </button>
    </>
  )
}

export default ScrollArrows
