/**
 * Utility functions for localStorage with timestamp-based expiration.
 * Stores values with timestamps and automatically clears expired data.
 */

interface TimedStorageItem<T> {
  value: T
  timestamp: number
}

const DEFAULT_EXPIRATION_MS = 10 * 60 * 1000 // 10 minutes

export function setTimedItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  const item: TimedStorageItem<T> = { value, timestamp: Date.now() }
  try {
    localStorage.setItem(key, JSON.stringify(item))
  } catch {
    // Ignore storage errors (e.g. private mode quota exceeded)
  }
}

export function getTimedItem<T>(
  key: string,
  expirationMs: number = DEFAULT_EXPIRATION_MS
): T | null {
  if (typeof window === 'undefined') return null
  try {
    const itemStr = localStorage.getItem(key)
    if (!itemStr) return null
    const item: TimedStorageItem<T> = JSON.parse(itemStr)
    if (Date.now() - item.timestamp > expirationMs) {
      localStorage.removeItem(key)
      return null
    }
    return item.value
  } catch {
    return null
  }
}

export function removeTimedItem(key: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}
