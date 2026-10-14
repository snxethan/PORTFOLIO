/**
 * Parses GitHub's public contribution calendar
 * (`https://github.com/users/<user>/contributions`).
 *
 * The page is HTML, not an API, so the parser only relies on the attributes
 * the calendar has used for years, and returns `null` instead of guessing if
 * they disappear:
 *   <td data-date="2025-10-12" id="contribution-day-component-0-0" data-level="0" ...>
 *   <tool-tip for="contribution-day-component-0-0">3 contributions on October 12th.</tool-tip>
 */

export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface ContributionDay {
  /** ISO date, YYYY-MM-DD */
  date: string
  level: ContributionLevel
  count: number
}

export interface ContributionCalendar {
  total: number
  days: ContributionDay[]
}

const readAttribute = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]

export function parseContributionsHtml(html: string): ContributionCalendar | null {
  // Exact counts live in the tooltips, keyed by the day cell's id.
  const countsById = new Map<string, number>()
  for (const match of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const text = match[2].trim()
    const count = /^No contributions/i.test(text) ? 0 : Number.parseInt(text.replace(/,/g, ""), 10)
    if (Number.isFinite(count)) countsById.set(match[1], count)
  }

  const days: ContributionDay[] = []
  for (const match of html.matchAll(/<td\b[^>]*\bdata-date="\d{4}-\d{2}-\d{2}"[^>]*>/g)) {
    const tag = match[0]
    const date = readAttribute(tag, "data-date")
    const level = Number(readAttribute(tag, "data-level"))
    if (!date || !Number.isInteger(level) || level < 0 || level > 4) continue

    const id = readAttribute(tag, "id")
    days.push({
      date,
      level: level as ContributionLevel,
      // Without a tooltip we still know whether the day had any activity.
      count: (id ? countsById.get(id) : undefined) ?? (level > 0 ? 1 : 0),
    })
  }

  if (days.length === 0) return null
  days.sort((a, b) => a.date.localeCompare(b.date))

  const flatHtml = html.replace(/\s+/g, " ")
  const headline = flatHtml.match(/([\d,]+) contributions? in the last year/)
  const total = headline
    ? Number.parseInt(headline[1].replace(/,/g, ""), 10)
    : days.reduce((sum, day) => sum + day.count, 0)

  return { total, days }
}
