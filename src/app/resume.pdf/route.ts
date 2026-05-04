import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { PDFDocument } from "pdf-lib"
import {
  RESUME_DOWNLOAD_FILENAME,
  RESUME_FALLBACK_PDF_PATH,
} from "@/app/data/resume"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const PDF_CONTENT_TYPE = "application/pdf"
const FALLBACK_PDF_PATH = join(process.cwd(), "public", RESUME_FALLBACK_PDF_PATH.slice(1))

function buildPdfResponse(
  body: ArrayBuffer | Uint8Array,
  disposition: "inline" | "attachment" = "inline",
  contentType = PDF_CONTENT_TYPE
) {
  const responseBody =
    body instanceof ArrayBuffer
      ? body
      : body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength)

  return new Response(responseBody as BodyInit, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `${disposition}; filename="${RESUME_DOWNLOAD_FILENAME}"`,
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  })
}

async function fetchRemotePdf(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: PDF_CONTENT_TYPE,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch resume PDF: ${response.status} ${response.statusText}`)
  }

  const contentType = response.headers.get("content-type")?.toLowerCase() ?? ""
  if (!contentType.includes("pdf")) {
    throw new Error(`Resume source returned unexpected content type: ${contentType || "unknown"}`)
  }

  return await response.arrayBuffer()
}

async function trimFirstPage(pdfBytes: Uint8Array) {
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const pageCount = pdfDoc.getPageCount()

  if (pageCount <= 1) {
    return pdfBytes
  }

  const trimmedDoc = await PDFDocument.create()
  const copiedPages = await trimmedDoc.copyPages(pdfDoc, Array.from({ length: pageCount - 1 }, (_, index) => index + 1))

  copiedPages.forEach((page) => trimmedDoc.addPage(page))

  return await trimmedDoc.save()
}

function getResumeExportUrl() {
  return (
    process.env.RESUME_GOOGLE_DOC_EXPORT_URL?.trim() ??
    process.env.RESUME_GOOGLE_DOC_EXPORT_UR?.trim() ??
    null
  )
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const exportUrl = getResumeExportUrl()
  const isDownload = searchParams.has("download")

  if (exportUrl) {
    try {
      const remotePdf = await fetchRemotePdf(exportUrl)
      const trimmedPdf = await trimFirstPage(new Uint8Array(remotePdf))
      return buildPdfResponse(trimmedPdf, isDownload ? "attachment" : "inline")
    } catch (error) {
      console.error("[resume.pdf] Falling back to local PDF after remote fetch failure:", error)
    }
  }

  try {
    const fallbackPdf = await readFile(FALLBACK_PDF_PATH)
    const trimmedPdf = await trimFirstPage(fallbackPdf)
    return buildPdfResponse(trimmedPdf, isDownload ? "attachment" : "inline")
  } catch (error) {
    console.error("[resume.pdf] Unable to read fallback resume PDF:", error)
    return new Response("Resume PDF is unavailable.", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store, max-age=0",
      },
    })
  }
}





