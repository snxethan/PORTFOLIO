// Utility functions for birthday detection and celebrations

/**
 * Checks if today is the user's birthday
 * For testing purposes, the birthday is set to September 8th, 2025 (9/8/2025)
 * @returns boolean indicating if today is the birthday
 */
export const isBirthday = (): boolean => {
  const now = new Date()
  const month = now.getMonth() + 1 // getMonth() returns 0-11, so add 1
  const day = now.getDate()
  
  // Birthday is September 8th (month 9, day 8)
  return month === 9 && day === 8
}

/**
 * Checks if the birthday celebration should be shown
 * This includes logic for session-based triggering
 * @returns boolean indicating if celebration should be shown
 */
export const shouldShowBirthdayCelebration = (): boolean => {
  return isBirthday()
}