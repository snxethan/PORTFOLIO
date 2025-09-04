import { NextResponse } from "next/server"

/**
 * GET endpoint for fetching currently playing Spotify track
 * Uses Spotify Web API with OAuth2 refresh token flow
 * Returns track information including title, artist, album, and cover image
 * 
 * Required environment variables:
 * - SPOTIFY_REFRESH_TOKEN: Long-lived refresh token from Spotify OAuth
 * - SPOTIFY_CLIENT_ID: Spotify app client ID
 * - SPOTIFY_CLIENT_SECRET: Spotify app client secret
 * 
 * @returns JSON object with current track info or isPlaying: false
 */
export async function GET() {
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN!

  // Step 1: Exchange refresh token for access token
  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      // Basic authentication with client credentials
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

  // Step 2: Fetch currently playing track using access token
  const nowPlayingRes = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  )

  // Handle no content (nothing playing) or error responses
  if (nowPlayingRes.status === 204 || nowPlayingRes.status > 400) {
    return NextResponse.json({ isPlaying: false })
  }

  // Validate response format to prevent crashes on unexpected responses
  const contentType = nowPlayingRes.headers.get("content-type")
  if (!contentType?.includes("application/json")) {
    const text = await nowPlayingRes.text()
    console.warn("Spotify returned non-JSON:", text.slice(0, 100))
    return NextResponse.json({ isPlaying: false })
  }

  const track = await nowPlayingRes.json()

  // Return formatted track information
  return NextResponse.json({
    isPlaying: track.is_playing,
    title: track.item.name,
    artist: track.item.artists.map((a: any) => a.name).join(", "),
    album: track.item.album.name,
    albumImageUrl: track.item.album.images[0].url,
    songUrl: track.item.external_urls.spotify,
  })
}
