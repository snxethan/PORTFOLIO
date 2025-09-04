// Utility function to check if today is the birthday
export const isBirthday = (): boolean => {
  const now = new Date()
  const month = now.getMonth() + 1 // JavaScript months are 0-indexed
  const day = now.getDate()
  
  // Birthday is August 11th (month 8, day 11)
  return month === 8 && day === 11
}