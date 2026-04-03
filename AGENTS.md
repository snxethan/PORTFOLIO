# AGENTS.md

## Mission-critical map
- Framework is Next.js App Router (`src/app`) with a mostly client-driven homepage shell.
- Entry flow is `src/app/page.tsx` -> `src/app/components/pages/HomeClient.tsx`; URL hash and slug state drive which section/tab is shown.
- Layout-wide providers live in `src/app/layout.tsx`: `ExternalLinkHandler`, `react-hot-toast` toaster, Vercel Analytics/SpeedInsights.
- Section routing is validated in `src/app/[...slug]/page.tsx`; unknown paths call `notFound()`, then `src/app/not-found.tsx` redirects to `/#not-found` for toast UX.

## Core UI architecture (what to preserve)
- `HomeClient.tsx` coordinates top-level sections (`about/projects/career`), sub-tabs, smooth scrolling offsets, and observer locking during programmatic scroll.
- Navbar pin state persists in `localStorage` (`navbarPinned`) and updates CSS var `--navbar-height` in `src/app/components/pages/Navbar.tsx`; many scroll helpers depend on this offset.
- Projects/Repos split is a tabbed subview (`src/app/components/pages/portfolio/ProjectsPage.tsx`, `src/app/components/pages/portfolio/ReposPage.tsx`) using shared `PageTabs`.
- External links should go through `useExternalLink().handleExternalClick(...)` (`src/app/components/ExternalLinkHandler.tsx`) rather than raw `window.open` to keep warning modal behavior consistent.

## Data and state patterns used in this repo
- Static profile data is centralized in `src/app/data/*.ts` (not fetched server-side).
- Repo cards merge GitHub API data with manual entries from `src/app/data/portfolioProjects.ts` inside `ReposPage.tsx`.
- Short-lived UI persistence uses `src/app/utils/timedStorage.ts` (`getTimedItem/setTimedItem`) with default 10-minute expiry.
- `ReposPage.tsx` also keeps a separate 5-minute raw GitHub cache in `localStorage` keys `githubProjectsCache` + `githubProjectsExpiry`.

## API boundaries and integrations
- Contact form endpoint: `POST /api/contact` in `src/app/api/contact/route.ts`.
- Contact endpoint uses in-memory per-IP rate limit map (60s window via `x-forwarded-for`) and Gmail SMTP via Nodemailer env vars.
- Spotify flow spans `src/app/api/spotify/login/route.ts`, `.../callback/route.ts`, `.../now-playing/route.ts`.
- `now-playing` refreshes token each request, validates JSON content-type, and returns `{ isPlaying: false }` on 204/errors.
- Sidebar polling client is `src/app/components/pages/sidebar/SpotifyWidget.tsx` (30s polling + `visibilitychange` pause/resume).

## Local workflow shortcuts
- Install/run: `npm install`, `npm run dev` (Turbopack) from project root.
- Quality gates used in docs/scripts: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- TypeScript is strict with path alias `@/*` (`tsconfig.json`); keep imports/types explicit.
- ESLint is flat-config (`eslint.config.mjs`) extending `next/core-web-vitals` and `next/typescript`.

## Implementation conventions observed
- Prefer functional client components with explicit interfaces (e.g., `PageTabs`, `SearchFilterBar`, `ReposPage`).
- Defensive fetch checks for `response.ok` and JSON content-type are used in Spotify and GitHub fetch paths.
- Tailwind styling is heavily utility-first with project-specific dark palette (`#1a1a1a`, `#222222`, `#333333`) and red accent (`#dc2626`).
- For new tab/section routes, update both slug allowlist (`src/app/[...slug]/page.tsx`) and UI tab mappings in `HomeClient.tsx`/`Navbar.tsx` to avoid navigation drift.

