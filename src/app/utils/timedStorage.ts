/**
 * Utility functions for localStorage with timestamp-based expiration.
 * Stores values with timestamps and automatically clears expired data.
 */

interface TimedStorageItem<T> {
  value: T
  timestamp: number
}

/**
 * Default expiration time in milliseconds (30 minutes)
 */
const DEFAULT_EXPIRATION_MS = 30 * 60 * 1000 // 30 minutes

/**
 * Set an item in localStorage with a timestamp
 * @param key - The localStorage key
 * @param value - The value to store
 * @param expirationMs - Optional custom expiration time in milliseconds
 */
export function setTimedItem<T>(
  key: string,
  value: T,
  expirationMs: number = DEFAULT_EXPIRATION_MS
): void {
  if (typeof window === 'undefined') return

  const item: TimedStorageItem<T> = {
    value,
    timestamp: Date.now()
  }

  try {
    localStorage.setItem(key, JSON.stringify(item))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

/**
 * Get an item from localStorage, checking if it has expired
 * @param key - The localStorage key
 * @param expirationMs - Optional custom expiration time in milliseconds
 * @returns The stored value if not expired, null otherwise
 */
export function getTimedItem<T>(
  key: string,
  expirationMs: number = DEFAULT_EXPIRATION_MS
): T | null {
  if (typeof window === 'undefined') return null

  try {
    const itemStr = localStorage.getItem(key)
    if (!itemStr) return null

    const item: TimedStorageItem<T> = JSON.parse(itemStr)
    const now = Date.now()
    const age = now - item.timestamp

    // Check if expired
    if (age > expirationMs) {
      // Remove expired item
      localStorage.removeItem(key)
      return null
    }

    return item.value
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
}

/**
 * Update the timestamp of an existing item without changing its value
 * Useful for "touch" operations to keep an item fresh
 * @param key - The localStorage key
 */
export function touchTimedItem(key: string): void {
  if (typeof window === 'undefined') return

  try {
    const itemStr = localStorage.getItem(key)
    if (!itemStr) return

    const item = JSON.parse(itemStr)
    item.timestamp = Date.now()
    localStorage.setItem(key, JSON.stringify(item))
  } catch (error) {
    console.error('Error touching localStorage item:', error)
  }
}

/**
 * Remove an item from localStorage
 * @param key - The localStorage key
 */
export function removeTimedItem(key: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}

/**
 * Check if an item exists and is not expired
 * @param key - The localStorage key
 * @param expirationMs - Optional custom expiration time in milliseconds
 * @returns true if item exists and is not expired
 */
export function hasValidTimedItem(
  key: string,
  expirationMs: number = DEFAULT_EXPIRATION_MS
): boolean {
  return getTimedItem(key, expirationMs) !== null
}
