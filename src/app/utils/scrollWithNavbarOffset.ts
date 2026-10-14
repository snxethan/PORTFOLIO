export const scrollElementIntoViewWithNavbarOffset = (
  target: HTMLElement | null,
  extraOffset = 12
) => {
  if (typeof window === "undefined" || !target) return

  const rawNavbarHeight = getComputedStyle(document.documentElement)
    .getPropertyValue("--navbar-height")
    .trim()
  const navbarHeight = Number.parseFloat(rawNavbarHeight) || 0
  const targetTop = window.scrollY + target.getBoundingClientRect().top
  const nextTop = Math.max(0, targetTop - navbarHeight - extraOffset)

  window.scrollTo({
    top: nextTop,
    behavior: "smooth",
  })
}


/**
 * Scrolls a section's filter panel (SectionHeader `<id>-filters`) into view,
 * after the tag panel has started opening so the target position is final.
 */
export const scrollToSectionFilters = (headerId: string) => {
  if (typeof window === "undefined") return
  window.setTimeout(() => {
    scrollElementIntoViewWithNavbarOffset(document.getElementById(`${headerId}-filters`), 16)
  }, 80)
}
