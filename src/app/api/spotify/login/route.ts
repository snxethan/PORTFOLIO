import { API_URLS } from "../../../config/urls"

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

  const url = `${API_URLS.SPOTIFY.AUTHORIZE}?${params.toString()}`

  return Response.redirect(url, 302)
}
