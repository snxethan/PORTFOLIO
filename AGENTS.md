# AGENTS.md

## Mission-critical map
- Framework is Next.js App Router (`src/app`) with a mostly client-driven homepage shell.
- Entry flow is `src/app/page.tsx` -> `src/app/components/pages/HomeClient.tsx`; URL hash and slug state drive which section/tab is shown.
- Layout-wide providers live in `src/app/layout.tsx`: `ExternalLinkHandler`, `react-hot-toast` toaster, Vercel Analytics/SpeedInsights.
- Section routing is validated in `src/app/[...slug]/page.tsx`; unknown paths call `notFound()`, then `src/app/not-found.tsx` redirects to `/#not-found` for toast UX.

## Core UI architecture (what to preserve)
- `HomeClient.tsx` coordinates top-level sections (`about/projects/career`), sub-tabs, smooth scrolling offsets, and observer locking during programmatic scroll.
- Navbar pin state persists in `localStorage` (`navbarPinned`). Pinned, it is a fixed top bar and sets CSS var `--navbar-height` to its height; unpinned, it renders under the sidebar in the sticky left column and sets the var to `0px`. Scroll helpers and sticky offsets depend on this var. Mobile spacing in `HomeClient.tsx` deliberately matches the pre-revamp layout.
- Projects/Repos split is a tabbed subview (`src/app/components/pages/portfolio/ProjectsPage.tsx`, `src/app/components/pages/portfolio/ReposPage.tsx`) using shared `PageTabs`. Experience/Education are one `CareerPage` with a `kind` prop.
- Every section renders cards through `src/app/components/CardCollection.tsx` (rail or grid, equal card sizes, arrows, auto-scroll) and its header through `SectionHeader` + `SearchFilterBar`. Don't hand-roll a new horizontal scroller.
- Project cards open `ProjectDetailModal`; the URL becomes `/projects/<slug>` via `window.history.pushState` (no navigation). `HomeClient` derives the open project from the pathname, and the slug allowlist accepts project slugs.
- All file previews (PDF and image) use `MediaModal`. Stacked popups use `useModalLayer` so Escape closes only the top one. Layering: navbar z-50, project popup z-[60], media popup z-[70], external-link warning z-[80].
- External links should go through `useExternalLink().handleExternalClick(...)` (`src/app/components/ExternalLinkHandler.tsx`) rather than raw `window.open` to keep warning modal behavior consistent.

## Data and state patterns used in this repo
- Static profile data is centralized in `src/app/data/*.ts` (not fetched server-side).
- Repo cards merge GitHub API data with manual entries from `src/app/data/portfolioProjects.ts` inside `ReposPage.tsx`.
- Short-lived UI persistence uses `src/app/utils/timedStorage.ts` (`getTimedItem/setTimedItem`) with default 10-minute expiry, usually through `useTimedState` / `useSectionFilters` (search, sort, multi-tag selection + any/all mode per section).
- Per-section grid/rail and auto-scroll choices persist permanently in `localStorage` (`sectionView:<key>`) via `useSectionView`; sections with fewer than 6 items default to grid.
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


<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
