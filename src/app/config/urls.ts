// Centralized URL configuration
export const API_URLS = {
  SPOTIFY: {
    AUTHORIZE: "https://accounts.spotify.com/authorize",
    TOKEN: "https://accounts.spotify.com/api/token",
    NOW_PLAYING: "https://api.spotify.com/v1/me/player/currently-playing",
    PROFILE: "https://open.spotify.com/user/l7ypevjdnoaz97kdqkkwf832d"
  },
  GITHUB: {
    USER_REPOS: "https://api.github.com/users/snxethan/repos?sort=created&direction=asc"
  },
  PORTFOLIYOU: {
    BASE: "https://portfoliyou.snxethan.dev",
    ICON: "https://portfoliyou.snxethan.dev/images/icon/portfoliyou.png"
  }
} as const

export const EXTERNAL_LINKS = {
  PORTFOLIO_SITE: "https://snex.dev/",
  PORTFOLIYOU: API_URLS.PORTFOLIYOU.BASE,
  SPOTIFY_PROFILE: API_URLS.SPOTIFY.PROFILE
} as const
