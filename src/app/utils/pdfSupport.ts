export const isPdfPreviewSupported = (): boolean => {
  if (typeof navigator === "undefined") return false

  const ua = navigator.userAgent.toLowerCase()
  const isIOS = /iphone|ipad|ipod/.test(ua)
  const isSafari = /safari/.test(ua) && !/chrome/.test(ua)
  const isMobile = /android|iphone|ipad|mobile/.test(ua)

  return !(isIOS || isSafari || isMobile)
}

