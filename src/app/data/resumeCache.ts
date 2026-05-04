import { RESUME_PDF_URL } from "@/app/data/resume"

let cachedResumeObjectUrl: string | null = null
let warmResumePromise: Promise<string | null> | null = null

async function fetchResumeBlobUrl() {
  const response = await fetch(RESUME_PDF_URL, {
    cache: "no-store",
    headers: {
      Accept: "application/pdf",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to warm resume cache: ${response.status} ${response.statusText}`)
  }

  const contentType = response.headers.get("content-type")?.toLowerCase() ?? ""
  if (!contentType.includes("pdf")) {
    throw new Error(`Resume cache returned unexpected content type: ${contentType || "unknown"}`)
  }

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

export async function warmResumePdfCache() {
  if (cachedResumeObjectUrl) return cachedResumeObjectUrl
  if (warmResumePromise) return warmResumePromise

  warmResumePromise = fetchResumeBlobUrl()
    .then((objectUrl) => {
      cachedResumeObjectUrl = objectUrl
      return objectUrl
    })
    .catch((error) => {
      console.error("[resume-cache] Failed to warm resume PDF cache:", error)
      return null
    })
    .finally(() => {
      warmResumePromise = null
    })

  return warmResumePromise
}

export function getCachedResumePdfUrl() {
  return cachedResumeObjectUrl
}



