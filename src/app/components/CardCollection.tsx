"use client"

import React, { useEffect, useRef } from "react"
import ScrollArrows, { scrollRailByCard } from "./ScrollArrows"
import type { ViewMode } from "../hooks/useSectionView"

/**
 * How big a section's cards are. Each section picks one, so card sizes never
 * depend on what another section shows.
 */
export type CardSize = "compact" | "standard" | "wide" | "gallery"

/*
 * Cards per view in rail mode, chosen with container queries (`@md:` etc.)
 * against the rail's own width rather than the viewport: the content column
 * is narrower than the window next to the sidebar, so viewport breakpoints
 * would over-count.
 */
const RAIL_PER_VIEW: Record<CardSize, string> = {
  compact: "[--per-view:1] @md:[--per-view:2] @3xl:[--per-view:3] @5xl:[--per-view:4]",
  standard: "[--per-view:1] @xl:[--per-view:2] @4xl:[--per-view:3]",
  wide: "[--per-view:1] @3xl:[--per-view:2]",
  gallery: "[--per-view:1]",
}

/** Narrowest a card may get in grid mode before the grid drops a column. */
const GRID_MIN_CARD_WIDTH: Record<CardSize, string> = {
  compact: "14rem",
  standard: "17rem",
  wide: "22rem",
  gallery: "16rem",
}

const CARD_SELECTOR = "[data-rail-card='true']"

/**
 * If `card` is partly hidden behind a rail's edge, scroll it fully into view
 * and return true. Clicking a half-visible card should first show it, and
 * only act (open a link, a popup) once it can be seen.
 */
const revealIfClipped = (card: HTMLElement, scroller: HTMLElement): boolean => {
  const cardRect = card.getBoundingClientRect()
  const scrollerRect = scroller.getBoundingClientRect()
  const inset = Number.parseFloat(getComputedStyle(scroller).scrollPaddingLeft) || 0
  const visibleLeft = scrollerRect.left + inset
  const visibleRight = scrollerRect.right - inset

  // Scroll only the rail; scrollIntoView would also nudge the page vertically.
  if (cardRect.left < visibleLeft - 2) {
    scroller.scrollBy({ left: cardRect.left - visibleLeft, behavior: "smooth" })
    return true
  }
  if (cardRect.right > visibleRight + 2) {
    scroller.scrollBy({ left: cardRect.right - visibleRight, behavior: "smooth" })
    return true
  }
  return false
}
const AUTO_SCROLL_INTERVAL_MS = 4000
/** After the visitor scrolls or clicks, wait this long before resuming. */
const AUTO_SCROLL_RESUME_DELAY_MS = 6000

interface CardCollectionProps<T> {
  items: T[]
  getKey: (item: T) => string
  renderCard: (item: T) => React.ReactNode
  viewMode: ViewMode
  autoScroll?: boolean
  size: CardSize
  /** Accessible name for the scrolling region, e.g. "Certifications". */
  label: string
  emptyMessage?: string
}

/**
 * Renders a section's cards as either a horizontal rail or a grid.
 *
 * Equal sizing: every card sits in a wrapper that is a stretched flex item
 * (rail) or a `1fr` grid row (grid), and the card fills that wrapper. All
 * cards in a section therefore match the tallest one in it.
 */
function CardCollection<T>({
  items,
  getKey,
  renderCard,
  viewMode,
  autoScroll = false,
  size,
  label,
  emptyMessage = "No items match your current filters.",
}: CardCollectionProps<T>) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const itemsKey = items.map(getKey).join("|")
  const previousItemsKeyRef = useRef(itemsKey)
  // The rail only mounts once there is something to show; re-arm auto-scroll then.
  const hasItems = items.length > 0

  // A new filter/sort result starts from its first card. Toggling auto-scroll
  // does not change the items, so it never resets the position.
  useEffect(() => {
    if (previousItemsKeyRef.current === itemsKey) return
    previousItemsKeyRef.current = itemsKey
    scrollerRef.current?.scrollTo({ left: 0, behavior: "smooth" })
  }, [itemsKey])

  useEffect(() => {
    if (viewMode !== "rail" || !autoScroll || !hasItems) return
    const wrapper = wrapperRef.current
    const scroller = scrollerRef.current
    if (!wrapper || !scroller) return

    const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth"
    let isPointerInside = false
    let hasKeyboardFocusInside = false
    let isOnScreen = true
    let lastInteractionAt = 0

    const tick = () => {
      if (isPointerInside || hasKeyboardFocusInside || !isOnScreen || document.hidden) return
      if (Date.now() - lastInteractionAt < AUTO_SCROLL_RESUME_DELAY_MS) return

      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth
      if (maxScrollLeft <= 2) return

      // At the end, loop back to the start; otherwise advance one card, the
      // same step the arrow buttons take.
      if (scroller.scrollLeft >= maxScrollLeft - 4) {
        scroller.scrollTo({ left: 0, behavior })
      } else {
        scrollRailByCard(scroller, CARD_SELECTOR, 1, behavior)
      }
    }

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") isPointerInside = true
    }
    const onPointerLeave = () => {
      isPointerInside = false
    }
    const markInteraction = () => {
      lastInteractionAt = Date.now()
    }
    // Only keyboard focus pauses. Clicking a card also focuses it, and a
    // mouse user should not freeze the rail just by having clicked once.
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null
      hasKeyboardFocusInside = Boolean(target?.matches(":focus-visible"))
    }
    const onFocusOut = (event: FocusEvent) => {
      if (!wrapper.contains(event.relatedTarget as Node | null)) hasKeyboardFocusInside = false
    }

    wrapper.addEventListener("pointerenter", onPointerEnter)
    wrapper.addEventListener("pointerleave", onPointerLeave)
    wrapper.addEventListener("focusin", onFocusIn)
    wrapper.addEventListener("focusout", onFocusOut)
    wrapper.addEventListener("pointerdown", markInteraction, { passive: true })
    scroller.addEventListener("wheel", markInteraction, { passive: true })
    scroller.addEventListener("touchstart", markInteraction, { passive: true })

    const visibility = new IntersectionObserver(([entry]) => {
      isOnScreen = entry?.isIntersecting ?? true
    })
    visibility.observe(scroller)

    const intervalId = window.setInterval(tick, AUTO_SCROLL_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
      visibility.disconnect()
      wrapper.removeEventListener("pointerenter", onPointerEnter)
      wrapper.removeEventListener("pointerleave", onPointerLeave)
      wrapper.removeEventListener("focusin", onFocusIn)
      wrapper.removeEventListener("focusout", onFocusOut)
      wrapper.removeEventListener("pointerdown", markInteraction)
      scroller.removeEventListener("wheel", markInteraction)
      scroller.removeEventListener("touchstart", markInteraction)
    }
  }, [autoScroll, hasItems, viewMode])

  if (items.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  if (viewMode === "grid") {
    return (
      <div
        role="list"
        aria-label={label}
        className="grid gap-6 px-1 py-4"
        style={{
          // auto-fill (not auto-fit) keeps empty tracks, so a filtered result
          // of two cards keeps normal card widths and the normal gap instead
          // of stretching across the whole row.
          gridTemplateColumns: `repeat(auto-fill, minmax(min(${GRID_MIN_CARD_WIDTH[size]}, 100%), 1fr))`,
          gridAutoRows: "1fr",
        }}
      >
        {items.map((item) => (
          <div key={getKey(item)} role="listitem" className="flex min-w-0 [&>*]:min-w-0 [&>*]:flex-1">
            {renderCard(item)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div
        ref={scrollerRef}
        role="region"
        aria-label={label}
        className="card-rail scroll-edge-fade @container w-full max-w-full overflow-x-auto overscroll-x-contain py-4 snap-x snap-mandatory"
      >
        {/* w-max: the row grows to fit its cards, so its end padding lands
            after the last card instead of being overflowed by it. */}
        <div role="list" className={`card-rail-row flex w-max min-w-full items-stretch py-2 ${RAIL_PER_VIEW[size]}`}>
          {items.map((item) => (
            <div
              key={getKey(item)}
              role="listitem"
              data-rail-card="true"
              className="rail-card flex snap-start [&>*]:min-w-0 [&>*]:flex-1"
              onClickCapture={(event) => {
                const scroller = scrollerRef.current
                if (scroller && revealIfClipped(event.currentTarget, scroller)) {
                  event.preventDefault()
                  event.stopPropagation()
                }
              }}
            >
              {renderCard(item)}
            </div>
          ))}
        </div>
      </div>
      <ScrollArrows containerRef={scrollerRef} cardSelector={CARD_SELECTOR} resetKey={itemsKey} />
    </div>
  )
}

export default CardCollection
