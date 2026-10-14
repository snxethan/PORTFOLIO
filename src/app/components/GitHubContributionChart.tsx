"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { FaGithub } from "react-icons/fa"
import { useExternalLink } from "./ExternalLinkHandler"
import type { ContributionCalendar, ContributionDay, ContributionLevel } from "../utils/githubContributions"

const PROFILE_URL = "https://github.com/snxethan"

/*
 * One-hue sequential ramp (more = brighter red), tuned for the dark card
 * surface. Validated as an ordinal ramp: monotone lightness, visible steps,
 * and the lowest step clears the surface at >= 2:1. Empty days are neutral
 * grey so "nothing" never reads as "a little".
 */
const LEVEL_COLORS: Record<ContributionLevel, string> = {
  0: "#2a2a2a",
  1: "#932f2f",
  2: "#bd3434",
  3: "#e04444",
  4: "#fb8a8a",
}

const CELL = 11
const GAP = 3
const DAY_LABELS: [number, string][] = [[1, "Mon"], [3, "Wed"], [5, "Fri"]]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const parseDate = (iso: string) => new Date(`${iso}T00:00:00Z`)
const formatDay = (iso: string) =>
  parseDate(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
const describeDay = (day: ContributionDay) =>
  `${day.count === 0 ? "No" : day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDay(day.date)}`

interface Hovered {
  day: ContributionDay
  x: number
  y: number
}

/**
 * GitHub-style contribution heatmap: weeks are columns, weekdays are rows.
 * Data comes from /api/github/contributions.
 */
const GitHubContributionChart = () => {
  const [calendar, setCalendar] = useState<ContributionCalendar | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [hovered, setHovered] = useState<Hovered | null>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const { handleExternalClick } = useExternalLink()

  useEffect(() => {
    let isActive = true
    fetch("/api/github/contributions")
      .then(async (response) => {
        const contentType = response.headers.get("content-type")
        if (!response.ok || !contentType?.includes("application/json")) throw new Error(String(response.status))
        return (await response.json()) as ContributionCalendar
      })
      .then((data) => {
        if (!isActive) return
        setCalendar(data)
        setStatus("ready")
      })
      .catch(() => {
        if (isActive) setStatus("error")
      })
    return () => {
      isActive = false
    }
  }, [])

  // Weeks start on Sunday, like GitHub's calendar.
  const { weeks, monthLabels } = useMemo(() => {
    if (!calendar || calendar.days.length === 0) return { weeks: [], monthLabels: [] }
    const firstDate = parseDate(calendar.days[0].date)
    const firstSunday = new Date(firstDate)
    firstSunday.setUTCDate(firstDate.getUTCDate() - firstDate.getUTCDay())

    const columns: (ContributionDay | null)[][] = []
    for (const day of calendar.days) {
      const date = parseDate(day.date)
      const week = Math.floor((date.getTime() - firstSunday.getTime()) / (7 * 86_400_000))
      columns[week] ??= Array<ContributionDay | null>(7).fill(null)
      columns[week][date.getUTCDay()] = day
    }

    // Label a month above the first week that contains its 1st..7th day.
    const labels: { week: number; label: string }[] = []
    columns.forEach((column, week) => {
      const firstDay = column?.find(Boolean)
      if (!firstDay) return
      const date = parseDate(firstDay.date)
      if (date.getUTCDate() <= 7 && week > 0) labels.push({ week, label: MONTHS[date.getUTCMonth()] })
    })

    return { weeks: columns, monthLabels: labels }
  }, [calendar])

  // On narrow screens the chart scrolls; start at the most recent weeks.
  useEffect(() => {
    if (status !== "ready" || !scrollerRef.current) return
    scrollerRef.current.scrollLeft = scrollerRef.current.scrollWidth
  }, [status])

  if (status === "loading") {
    return <div className="mx-auto h-[132px] w-full max-w-[760px] animate-pulse rounded-lg bg-[#1e1e1e]" aria-hidden="true" />
  }

  if (status === "error" || !calendar) {
    return (
      <p className="text-center text-sm text-gray-400">
        Search through my GitHub repositories and shipped work.
      </p>
    )
  }

  const gridWidth = weeks.length * (CELL + GAP) - GAP
  const gridHeight = 7 * (CELL + GAP) - GAP
  const labelGutter = 28

  return (
    <figure className="mx-auto w-full max-w-[760px]">
      <figcaption className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-gray-300">
          <span className="font-semibold text-white">{calendar.total.toLocaleString("en-US")}</span> contributions in the last year
        </span>
        <a
          href={PROFILE_URL}
          onClick={(event) => {
            event.preventDefault()
            handleExternalClick(PROFILE_URL, true)
          }}
          className="inline-flex items-center gap-1.5 text-gray-400 transition-colors hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-sm"
        >
          <FaGithub aria-hidden="true" />
          @snxethan
        </a>
      </figcaption>

      <div
        ref={scrollerRef}
        className="relative overflow-x-auto rounded-lg border border-[#333333] bg-[#1e1e1e] p-3"
        onMouseLeave={() => setHovered(null)}
        onScroll={() => setHovered(null)}
      >
        <svg
          role="img"
          aria-label={`GitHub contributions: ${calendar.total} in the last year`}
          width={gridWidth + labelGutter}
          height={gridHeight + 18}
          className="mx-auto block"
        >
          {monthLabels.map(({ week, label }) => (
            <text key={`${label}-${week}`} x={labelGutter + week * (CELL + GAP)} y={10} className="fill-gray-400 text-[10px]">
              {label}
            </text>
          ))}
          {DAY_LABELS.map(([row, label]) => (
            <text key={label} x={0} y={18 + row * (CELL + GAP) + CELL - 2} className="fill-gray-500 text-[10px]">
              {label}
            </text>
          ))}
          {weeks.map((column, week) =>
            column?.map((day, row) =>
              day ? (
                <rect
                  key={day.date}
                  x={labelGutter + week * (CELL + GAP)}
                  y={18 + row * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill={LEVEL_COLORS[day.level]}
                  stroke={hovered?.day.date === day.date ? "#ffffff" : "none"}
                  strokeWidth={1.5}
                  onMouseEnter={(event) => {
                    // Viewport coordinates: the tooltip is position: fixed so
                    // the scroller's overflow clipping can't cut it off.
                    const cell = (event.target as SVGRectElement).getBoundingClientRect()
                    setHovered({ day, x: cell.left + cell.width / 2, y: cell.top })
                  }}
                >
                  <title>{describeDay(day)}</title>
                </rect>
              ) : null
            )
          )}
        </svg>

        {hovered && (
          <div
            role="tooltip"
            className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-red-600 px-2 py-1 text-xs text-white shadow-md"
            style={{ left: hovered.x, top: hovered.y - 6 }}
          >
            {describeDay(hovered.day)}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-end gap-1.5 text-xs text-gray-400" aria-hidden="true">
        Less
        {([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => (
          <span key={level} className="inline-block h-[11px] w-[11px] rounded-[2px]" style={{ backgroundColor: LEVEL_COLORS[level] }} />
        ))}
        More
      </div>
    </figure>
  )
}

export default GitHubContributionChart
