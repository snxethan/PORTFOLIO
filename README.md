# Ethan Townsend – Portfolio

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.6-38bdf8?style=for-the-badge&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

A modern, responsive portfolio application built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS 4**. Features real-time integrations with Spotify and GitHub APIs, dynamic content loading, smooth animations, and a comprehensive project showcase system.

[**Live Demo**](https://www.snxethan.dev) • [**Report Bug**](https://github.com/snxethan/Portfolio/issues) • [**Request Feature**](https://github.com/snxethan/Portfolio/issues)

</div>

---

## 🌐 Live Domains

- **[snxethan.dev](https://www.snxethan.dev/)** - Primary Portfolio
- **[snex.dev](https://www.snex.dev)** - Domain Alias
- **[ethantownsend.dev](https://www.ethantownsend.dev)** - Social Landing Page

---

## ✨ Features

### 🎨 Dynamic UI Components
- **Responsive Sidebar** with seasonal avatars and dynamic status indicators
- **Tab-based Navigation System** for seamless page transitions
- **Real-time Spotify Widget** displaying currently playing tracks with album art
- **Interactive Project Gallery** with filtering, search, and categorization
- **PDF Resume Viewer** with device compatibility detection
- **Modal-based Contact Form** with email notifications
- **External Link Warnings** for enhanced security
- **Click Sound Effects** for interactive feedback
- **Custom Tooltips** for enhanced user experience

### 🔧 Technical Features
- **Server-Side Rendering (SSR)** with Next.js 16 App Router
- **Type-safe Development** with strict TypeScript configuration
- **Responsive Design** with mobile-first approach (min-width: 360px)
- **Custom Animations** using Tailwind CSS and custom keyframes
- **API Routes** for serverless backend functionality
- **GitHub Integration** dynamically fetching and displaying repositories
- **Session Storage** with timed persistence for UI state
- **Vercel Analytics** and Speed Insights for performance monitoring

### 🔒 Security & Performance
- **API Rate Limiting** (1 request/minute per IP on contact form)
- **Input Validation** and sanitization on all forms
- **Secure OAuth 2.0** implementation for Spotify authentication
- **Environment Variable** security and validation
- **Image Optimization** with Next.js Image component
- **Caching Strategies** for API responses (5-minute cache)
- **PDF Preview Optimization** with error handling

---

## 🛠️ Technology Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.5 | React framework with SSR and App Router |
| **React** | 19.0 | UI library with latest concurrent features |
| **TypeScript** | 5.9.3 | Type-safe JavaScript development |
| **Tailwind CSS** | 4.1.6 | Utility-first CSS framework |
| **Turbopack** | - | Next-gen bundler for faster builds |

### UI & Styling
- **Lucide React** - Modern icon library
- **React Icons** - Additional icon sets
- **React Hot Toast** - Toast notification system
- **Custom CSS Animations** - Elastic, fade, and scale effects

### Backend & APIs
- **Next.js API Routes** - Serverless functions
- **Nodemailer** (7.0.3) - Email delivery via Gmail SMTP
- **Spotify Web API** - Real-time music integration
- **GitHub API** - Repository data fetching

### Analytics & Monitoring
- **Vercel Analytics** - User metrics and insights
- **Vercel Speed Insights** - Performance monitoring

### Development Tools
- **ESLint 9** - Code linting with Next.js config
- **PostCSS 4** - CSS processing
- **Git** - Version control

---

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── contact/           # Contact form endpoint
│   │   │   │   └── route.ts       # Email handler with rate limiting
│   │   │   └── spotify/           # Spotify integration
│   │   │       ├── now-playing/   # Current track endpoint
│   │   │       ├── login/         # OAuth flow initiation
│   │   │       └── callback/      # OAuth callback handler
│   │   ├── components/            # React components
│   │   │   ├── pages/            # Page components
│   │   │   │   ├── portfolio/    # Portfolio sub-pages
│   │   │   │   │   ├── ProjectsPage.tsx
│   │   │   │   │   ├── ExperiencePage.tsx
│   │   │   │   │   ├── EducationPage.tsx
│   │   │   │   │   ├── SkillsPage.tsx
│   │   │   │   │   ├── CertificationsPage.tsx
│   │   │   │   │   └── ReposPage.tsx
│   │   │   │   ├── sidebar/      # Sidebar components
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   ├── Avatar.tsx
│   │   │   │   │   ├── SpotifyWidget.tsx
│   │   │   │   │   └── Status.tsx
│   │   │   │   ├── About.tsx
│   │   │   │   ├── Resume.tsx
│   │   │   │   └── Portfolio.tsx
│   │   │   ├── ContactFormModal.tsx
│   │   │   ├── PDFModalViewer.tsx
│   │   │   ├── ClickSoundWrapper.tsx
│   │   │   └── ToolTipWrapper.tsx
│   │   ├── data/                 # Static data files
│   │   │   ├── portfolioProjects.ts
│   │   │   ├── timelineData.ts
│   │   │   ├── aboutData.ts
│   │   │   └── socialLinks.ts
│   │   ├── config/               # Configuration
│   │   │   └── urls.ts          # API endpoint URLs
│   │   ├── utils/               # Utility functions
│   │   │   └── timedStorage.ts  # Session storage utilities
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── page.tsx            # Main page component
│   │   └── globals.css         # Global styles and animations
│   └── social/                 # Social landing page
├── public/                     # Static assets
│   ├── images/                # Images and avatars
│   ├── sounds/                # Sound effects
│   └── resume/                # Resume PDF files
├── .github/                   # GitHub configuration
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

---

## 🚀 API Endpoints

### Contact Form
**`POST /api/contact`**
- Handles contact form submissions
- Rate limiting: 1 request per minute per IP
- Validation: Required fields (name, email, message)
- Email delivery via Nodemailer with Gmail SMTP

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!"
}
```

**Response:**
```json
{
  "message": "Email sent successfully"
}
```

### Spotify Integration

**`GET /api/spotify/now-playing`**
- Returns currently playing track
- 5-minute response caching
- Handles authentication errors gracefully

**Response:**
```json
{
  "isPlaying": true,
  "title": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "albumImageUrl": "https://...",
  "songUrl": "https://open.spotify.com/track/..."
}
```

**`GET /api/spotify/login`**
- Initiates Spotify OAuth 2.0 flow
- Redirects to Spotify authorization page

**`GET /api/spotify/callback`**
- Handles OAuth callback
- Exchanges authorization code for tokens

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 18.x or higher | JavaScript runtime |
| **npm** or **yarn** | Latest | Package manager |
| **Git** | Latest | Version control |

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/snxethan/Portfolio.git
cd Portfolio
```

**2. Install dependencies:**
```bash
npm install
# or
yarn install
```

**3. Configure environment variables:**

Create a `.env.local` file in the root directory:

```env
# Spotify Integration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback

# Email Configuration (Gmail SMTP)
GMAIL_USER=yourgoogleuser@gmail.com
GMAIL_PASS=your_gmail_app_password
RECEIVER_EMAIL=destination@email.com
```

<details>
<summary><b>📝 How to get Spotify credentials</b></summary>

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Note down your `Client ID` and `Client Secret`
4. Add `http://localhost:3000/api/spotify/callback` to Redirect URIs
5. Use the authorization flow to get your refresh token:
   - Visit `/api/spotify/login` on your local server
   - Authorize the application
   - Extract the refresh token from the callback

</details>

<details>
<summary><b>📧 How to set up Gmail for contact form</b></summary>

1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google Account Settings](https://myaccount.google.com/security)
3. Navigate to "App Passwords"
4. Generate a new app password for "Mail"
5. Use this password as `GMAIL_PASS` in your `.env.local`

</details>

**4. Start the development server:**
```bash
npm run dev
# Uses Turbopack for faster builds
```

**5. Open your browser:**

Visit [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build optimized production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint for code quality checks |

---

## 📦 Deployment

This project is optimized for deployment on **[Vercel](https://vercel.com)** with zero configuration.

### Deployment Steps

**1. Connect Repository:**
- Import your GitHub repository in Vercel dashboard
- Vercel will automatically detect Next.js configuration

**2. Configure Environment Variables:**
Add all environment variables from `.env.local` to Vercel:
- Go to Project Settings → Environment Variables
- Add each variable for Production, Preview, and Development environments

**3. Set Up Custom Domains:**
- Add custom domains in Project Settings → Domains
- Configure DNS records (CNAME or A records)
- SSL certificates are automatically provisioned

**4. Deploy:**
- Push to your main branch for automatic deployment
- Or use `vercel deploy` CLI command
- Monitor deployment status in Vercel dashboard

### Deployment Checklist
- [ ] All environment variables configured
- [ ] Custom domains added and DNS configured
- [ ] SSL certificates active
- [ ] Analytics and Speed Insights enabled
- [ ] Build successful with no errors

---

## 🧪 Development Workflow

### Code Quality
```bash
# Run linter
npm run lint

# Build for production (test locally)
npm run build
npm start
```

### Testing Changes
1. Make changes to source files in `src/`
2. Hot reload will automatically update the browser
3. Test all interactive features (forms, navigation, etc.)
4. Verify responsive design on different screen sizes
5. Check API endpoints functionality

### Adding New Features

**To add a new project:**
1. Edit `src/app/data/portfolioProjects.ts`
2. Add project object with proper typing
3. Test filtering and search functionality

**To add a new page:**
1. Create component in `src/app/components/pages/`
2. Add route in main navigation
3. Update TypeScript types if needed

**To add a new API endpoint:**
1. Create route file in `src/app/api/[endpoint]/route.ts`
2. Implement proper validation and error handling
3. Add rate limiting if needed
4. Update API documentation

---

## 🎨 Customization

### Changing Theme Colors
Edit `src/app/globals.css` to modify color variables and animations.

### Updating Personal Information
- **About Section:** `src/app/data/aboutData.ts`
- **Timeline:** `src/app/data/timelineData.ts`
- **Social Links:** `src/app/data/socialLinks.ts`
- **Projects:** `src/app/data/portfolioProjects.ts`

### Adding Custom Animations
Define new keyframe animations in `src/app/globals.css` under the `@keyframes` section.

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Spotify widget not showing**
- Verify all Spotify environment variables are set correctly
- Check that refresh token is valid and not expired
- Ensure Spotify app has proper permissions

**Issue: Contact form not sending emails**
- Verify Gmail credentials are correct
- Check that app password (not regular password) is used
- Ensure Gmail account has 2FA enabled

**Issue: Build fails**
- Clear `.next` directory: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

**Issue: PDF viewer not working**
- PDFs are disabled on iOS/Safari/mobile by design
- Ensure PDF files are in `public/resume/` directory
- Check browser console for errors

### Getting Help
- Check [existing issues](https://github.com/snxethan/Portfolio/issues)
- Open a [new issue](https://github.com/snxethan/Portfolio/issues/new)
- Contact via the portfolio contact form

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

**1. Fork the repository**
```bash
# Click the Fork button on GitHub
```

**2. Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

**3. Make your changes**
- Follow existing code style and conventions
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

**4. Commit your changes**
```bash
git commit -m 'Add some amazing feature'
```

**5. Push to your branch**
```bash
git push origin feature/amazing-feature
```

**6. Open a Pull Request**
- Provide a clear description of changes
- Reference any related issues
- Wait for code review

### Contribution Guidelines
- Follow TypeScript best practices
- Maintain consistent code formatting
- Write meaningful commit messages
- Test across different browsers and devices
- Keep pull requests focused and atomic

---

## 📄 License

This project is **open source** and available for personal and educational use. Please respect the original author's work and provide attribution when using or adapting this code.

**Copyright © 2024 Ethan Townsend**

If you'd like to use this project as a template for your own portfolio, feel free to fork it and customize it to your needs. Consider giving this repository a ⭐ if you found it helpful!

---

## 👤 Author

**Ethan Townsend** (snxethan)

- Portfolio: [snxethan.dev](https://www.snxethan.dev)
- GitHub: [@snxethan](https://github.com/snxethan)
- LinkedIn: Connect via portfolio contact form

---

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For seamless deployment and hosting
- **Tailwind CSS** - For the utility-first CSS framework
- **Spotify** - For the Web API integration
- **GitHub** - For repository hosting and API
- **Open Source Community** - For the incredible tools and libraries

---

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/snxethan/Portfolio?style=social)
![GitHub forks](https://img.shields.io/github/forks/snxethan/Portfolio?style=social)
![GitHub issues](https://img.shields.io/github/issues/snxethan/Portfolio)
![GitHub pull requests](https://img.shields.io/github/issues-pr/snxethan/Portfolio)

---

## 🗺️ Roadmap

- [x] Initial portfolio design and setup
- [x] Spotify integration
- [x] GitHub repository integration
- [x] Contact form with email delivery
- [x] PDF resume viewer
- [x] Custom animations and transitions
- [x] Multi-domain support
- [x] Analytics integration
- [ ] Blog section with markdown support
- [ ] Dark/light theme toggle
- [ ] Internationalization (i18n)
- [ ] Advanced project filtering
- [ ] Performance optimizations

---

<div align="center">

**[⬆ Back to Top](#ethan-townsend--portfolio)**

Made with ❤️ by [Ethan Townsend](https://www.snxethan.dev)

</div>
