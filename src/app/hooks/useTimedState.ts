"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getTimedItem, setTimedItem } from "../utils/timedStorage"

/**
 * `useState` backed by `timedStorage` (10-minute expiry), for short-lived UI
 * state such as a section's search text, sort and selected tags.
 *
 * `parse` converts whatever was stored into `T`, which lets callers migrate
 * old shapes (a single tag string becoming a tag array, for example).
 *
 * The key may change between renders (About reuses one component for two
 * sub-sections); the value is then re-read for the new key, using the
 * fallback passed on that render.
 */
export function useTimedState<T>(
  key: string,
  fallback: T,
  parse?: (stored: unknown) => T
) {
  const fallbackRef = useRef(fallback)
  const parseRef = useRef(parse)
  fallbackRef.current = fallback
  parseRef.current = parse

  const read = useCallback((storageKey: string): T => {
    const stored = getTimedItem<unknown>(storageKey)
    if (stored === null) return fallbackRef.current
    return parseRef.current ? parseRef.current(stored) : (stored as T)
  }, [])

  const [state, setState] = useState(() => ({ key, value: read(key) }))

  // Adjusting state during render (instead of in an effect) avoids one render
  // where the new key shows the old key's value.
  if (state.key !== key) {
    setState({ key, value: read(key) })
  }

  useEffect(() => {
    if (state.key === key) setTimedItem(key, state.value)
  }, [key, state])

  const setValue = useCallback((next: T | ((prev: T) => T)) => {
    setState((prev) => ({
      key: prev.key,
      value: typeof next === "function" ? (next as (prev: T) => T)(prev.value) : next,
    }))
  }, [])

  return [state.key === key ? state.value : read(key), setValue] as const
}
