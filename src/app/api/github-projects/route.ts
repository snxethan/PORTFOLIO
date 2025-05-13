import { NextResponse } from "next/server"

export async function GET() {
  const token = process.env.GITHUB_TOKEN

  const res = await fetch("https://api.github.com/users/snxethan/repos?sort=updated&direction=desc", {
    headers: {
      Authorization: `token ${token}`,
    },
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch GitHub repos" }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
