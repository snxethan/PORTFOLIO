import { NextResponse } from "next/server"
import { API_URLS } from "../../../config/urls"

export async function GET() {
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN!

  const tokenResponse = await fetch(API_URLS.SPOTIFY.TOKEN, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  })

  const tokenData = await tokenResponse.json()
  const access_token = tokenData.access_token

  const nowPlayingRes = await fetch(
    API_URLS.SPOTIFY.NOW_PLAYING,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  )

  if (nowPlayingRes.status === 204 || nowPlayingRes.status > 400) {
    return NextResponse.json({ isPlaying: false })
  }

  // ✅ Prevent crash if response is HTML or invalid JSON
  const contentType = nowPlayingRes.headers.get("content-type")
  if (!contentType?.includes("application/json")) {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      const text = await nowPlayingRes.text()
      console.warn("Spotify returned non-JSON:", text.slice(0, 100))
    }
    return NextResponse.json({ isPlaying: false })
  }

  const track = await nowPlayingRes.json()

  return NextResponse.json({
    isPlaying: track.is_playing,
    title: track.item.name,
    artist: track.item.artists.map((a: { name: string }) => a.name).join(", "),
    album: track.item.album.name,
    albumImageUrl: track.item.album.images[0].url,
    songUrl: track.item.external_urls.spotify,
  })
}
