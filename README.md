# Ethan Townsend – Portfolio

A modern, responsive portfolio built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Features real-time integrations with Spotify and GitHub APIs, dynamic content loading, and smooth animations.

## Live Domains
- [snxethan.dev](https://www.snxethan.dev/) (Primary)
- [snex.dev](https://www.snex.dev) (Alias)
- [ethantownsend.dev](https://www.ethantownsend.dev) (Social Landing)

## Core Features

- **Dynamic UI Components**
  - Responsive sidebar with seasonal avatars
  - Tab-based navigation system
  - Real-time Spotify integration
  - Project filtering and search
  - PDF preview system
  - Modal-based contact form

- **Technical Features**
  - SSR with Next.js 14
  - Type-safe development with TypeScript
  - Responsive design with Tailwind CSS
  - Custom animations and transitions
  - API route handling
  - Environment variable management

- **Security & Performance**
  - API rate limiting
  - Secure form handling
  - Image optimization
  - PDF previews
  - External link warnings

## Setup & Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/snxethan/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
Create a `.env.local` file:
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback
GMAIL_USER=yourgoogleuser@gmail.com
GMAIL_PASS=your_custom_token
RECEIVER_EMAIL=youremail@email.com
```

4. Start development server:
```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000)

## API Endpoints

- `/api/spotify`
  - `/now-playing` - Get current Spotify track
  - `/login` - Spotify OAuth flow
- `/api/github-projects` - Fetch GitHub repositories
- `/api/contact` - Handle contact form submissions

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

Important deployment steps:
1. Connect your GitHub repository
2. Configure environment variables in Vercel dashboard
3. Set up custom domains and SSL
4. Configure project settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author(s)

- [**Ethan Townsend (snxethan)**](www.ethantownsend.dev)
