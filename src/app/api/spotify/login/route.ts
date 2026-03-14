const SPOTIFY_AUTHORIZE_URL = "https://accounts.spotify.com/authorize"

export async function GET() {
  const scope = "user-read-currently-playing user-read-recently-played"
  const client_id = process.env.SPOTIFY_CLIENT_ID!
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI! // must match Spotify dashboard exactly

  const params = new URLSearchParams({
    response_type: "code",
    client_id,
    scope,
    redirect_uri, // don't encode — URLSearchParams does it
  })

  const url = `${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`

  return Response.redirect(url, 302)
}
