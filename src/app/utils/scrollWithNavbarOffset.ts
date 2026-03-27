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

