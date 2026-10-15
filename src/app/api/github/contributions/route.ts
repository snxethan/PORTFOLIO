import { NextResponse } from "next/server"
import { parseContributionsHtml } from "@/app/utils/githubContributions"

const GITHUB_USER = "snxethan"

/**
 * Last year of GitHub contributions as JSON, for the Repositories header.
 *
 * Browsers can't read github.com's calendar directly (CORS), so it is fetched
 * here. Successful results are cached for an hour (Next's fetch cache plus
 * CDN headers); failures are never cached, so one bad fetch doesn't stick.
 */
export async function GET() {
  try {
    const response = await fetch(`https://github.com/users/${GITHUB_USER}/contributions`, {
      headers: { Accept: "text/html" },
      next: { revalidate: 3600 },
    })
    const contentType = response.headers.get("content-type")
    if (!response.ok || !contentType?.includes("text/html")) {
      throw new Error(`GitHub responded ${response.status}`)
    }

    const calendar = parseContributionsHtml(await response.text())
    if (!calendar) throw new Error("Contribution calendar not found in page")

    return NextResponse.json(calendar, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    })
  } catch (error) {
    console.error("GitHub contributions unavailable:", error)
    return NextResponse.json(
      { error: "Contribution history is unavailable right now." },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    )
  }
}
