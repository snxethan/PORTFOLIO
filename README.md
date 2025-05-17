# Ethan Townsend – Developer Portfolio

This is the codebase for my personal developer portfolio, built with **Next.js**, **TypeScript**, and **Tailwind CSS**. It showcases my skills, experience, and selected projects, and integrates with APIs like **GitHub** and **Spotify**.

DOMAINS:
* [snxethan.dev](https://www.snxethan.dev/)
* [snex.dev](https://www.snex.dev) 
* [ethantownsend.dev](https://www.ethantownsend.dev)
---

## Features

- **Dynamic Portfolio Tabs** – About Me, Resume, Projects  
- **Live Spotify Widget** – Displays currently playing music  
- **Project Filtering** – Tags, languages, and search functionality  
- **External Link Warning** – Custom warnings for social vs. professional links  
- **GitHub API Integration** – Displays live public repositories  
- **Responsive Design** – Fully mobile-friendly and desktop-optimized with smooth animations
- **Environment-Aware** – Secure management of secrets via `.env.local`
- **PDF Display** - Display previews & modals of PDFs for certificates & resume

---

# Getting Started

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/snxethan/portfolio.git
cd portfolio
npm install
```
### 2. Set Environment Variables

Create a `.env.local` file in the root directory with the following content:

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback
```

⚠️ Never expose .env.local or these secrets in a public repo. ⚠️

### 3. Start Development Server

```bash
npm run dev
```
Visit http://localhost:3000 in your browser.

# Deployment

This project is built for deployment on [Vercel](https://vercel.com)

⚠️ Be sure to set your environment variables in the Vercel dashboard.⚠️



# API Endpoints

- `/api/spotify/now-playing` – Returns the currently playing Spotify track  
- `/api/spotify/login` – Starts Spotify OAuth flow  
- `/api/github-projects` – Returns GitHub repository data



