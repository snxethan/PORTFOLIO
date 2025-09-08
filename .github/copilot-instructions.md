# GitHub Copilot Instructions for Portfolio Project

## Project Overview

This is **Ethan Townsend's portfolio application** - a modern, responsive website built with Next.js 15, TypeScript, and Tailwind CSS. The application features real-time integrations with Spotify and GitHub APIs, dynamic content loading, smooth animations, and a comprehensive project showcase.

## Architecture & Technology Stack

### Core Technologies
- **Framework**: Next.js 15 with App Router and Server-Side Rendering
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS 4 for responsive design and animations
- **Deployment**: Vercel with custom domains and SSL

### Key Features
- **Dynamic UI Components**: Responsive sidebar, tab navigation, real-time Spotify widget
- **API Integrations**: Spotify Now Playing, GitHub repositories, contact form
- **Security**: Rate limiting, form validation, secure environment variable handling
- **Performance**: Image optimization, PDF previews, caching mechanisms

## File Structure & Organization

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── contact/           # Contact form endpoint with rate limiting
│   │   └── spotify/           # Spotify API integration
│   ├── components/            # React components
│   │   ├── pages/            # Page-specific components
│   │   │   ├── About.tsx     # About page with personal info
│   │   │   ├── Portfolio.tsx # GitHub integration & project showcase
│   │   │   ├── Resume.tsx    # PDF resume viewer
│   │   │   └── sidebar/      # Sidebar components (Avatar, Spotify, etc.)
│   │   ├── PDFModalViewer.tsx # PDF preview system
│   │   └── ToolTipWrapper.tsx # Custom tooltip implementation
│   ├── data/                 # Static data files
│   │   └── portfolioProjects.ts # Manual project definitions
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── social/             # Social landing page
public/                     # Static assets
```

## Coding Standards & Conventions

### TypeScript Guidelines
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Avoid `any` types - use proper typing
- Use optional chaining (`?.`) for safe property access
- Implement proper error handling with try-catch blocks

### React Patterns
- Use functional components with hooks
- Implement proper dependency arrays in useEffect
- Use useCallback for event handlers to prevent unnecessary re-renders
- Implement loading states and error boundaries
- Follow React best practices for state management

### API Development
- Implement rate limiting on all public endpoints
- Validate all input data before processing
- Use proper HTTP status codes and error responses
- Secure sensitive operations with environment variables
- Implement proper CORS handling

### Styling Guidelines
- Use Tailwind CSS classes consistently
- Implement responsive design with mobile-first approach
- Use CSS-in-JS sparingly, prefer Tailwind utilities
- Maintain consistent spacing and typography scales
- Use semantic HTML elements for accessibility

## Environment Variables

### Required Variables
```env
SPOTIFY_CLIENT_ID=          # Spotify app client ID
SPOTIFY_CLIENT_SECRET=      # Spotify app secret
SPOTIFY_REFRESH_TOKEN=      # OAuth refresh token
SPOTIFY_REDIRECT_URI=       # OAuth callback URL
GMAIL_USER=                # Gmail account for contact form
GMAIL_PASS=                # App-specific password
RECEIVER_EMAIL=            # Contact form destination
```

### Security Notes
- Never commit environment variables to version control
- Use Vercel environment variables for production
- Validate all environment variables at runtime
- Use different configurations for development/production

## API Endpoints & Integration

### `/api/contact` - Contact Form
- **Method**: POST
- **Rate Limiting**: 1 request per minute per IP
- **Validation**: Required fields (name, email, message)
- **Security**: Input sanitization, nodemailer with Gmail

### `/api/spotify/*` - Spotify Integration
- **`/now-playing`**: Get current track (cached)
- **`/login`**: OAuth flow initiation
- **Authentication**: OAuth 2.0 with refresh tokens
- **Caching**: 5-minute cache for API responses

## Component Guidelines

### Portfolio.tsx - Main Portfolio Component
- Fetches GitHub repositories dynamically
- Implements local caching (5-minute expiry)
- Merges GitHub data with manual project definitions
- Handles loading states and API failures gracefully
- Features project filtering and search functionality

### Spotify Widget - Real-time Integration
- Shows currently playing track with album art
- Handles authentication states and errors
- Implements smooth animations and transitions
- Uses polling for real-time updates

### PDF System - Resume Viewer
- Custom PDF preview tooltips
- Secure PDF loading and caching
- Responsive design for different screen sizes
- Error handling for failed PDF loads

## Development Workflow

### Local Development
1. Clone repository and install dependencies with `npm install`
2. Create `.env.local` with all required environment variables
3. Start development server with `npm run dev` (uses Turbopack)
4. Access application at `http://localhost:3000`

### Code Quality
- Run `npm run lint` to check ESLint rules
- Build with `npm run build` to verify production readiness
- Test API endpoints thoroughly before deployment
- Verify responsive design across different screen sizes

### Deployment
- Automatic deployment via Vercel on main branch pushes
- Configure environment variables in Vercel dashboard
- Set up custom domains and SSL certificates
- Monitor performance and error rates

## Common Tasks & Patterns

### Adding New Projects
1. Add project data to `src/app/data/portfolioProjects.ts`
2. Include proper typing with the `Project` interface
3. Specify `source`, `ctaLabel`, and `ctaIcon` appropriately
4. Test integration with existing filtering/search logic

### API Route Development
1. Implement proper TypeScript request/response types
2. Add input validation and sanitization
3. Include rate limiting for public endpoints
4. Use proper error handling and HTTP status codes
5. Test thoroughly with different input scenarios

### UI Component Development
1. Use TypeScript interfaces for component props
2. Implement proper loading and error states
3. Follow accessibility best practices
4. Use Tailwind CSS for consistent styling
5. Test responsive behavior across screen sizes

## Security Considerations

### API Security
- All API routes implement rate limiting
- Input validation on all user-submitted data
- Secure environment variable handling
- Proper CORS configuration

### Form Security
- Server-side validation for contact form
- Protection against common attacks (XSS, injection)
- Secure email handling with authentication

### Third-party Integration Security
- OAuth 2.0 for Spotify authentication
- Secure token storage and refresh mechanisms
- API key protection and rotation strategies

## Performance Optimization

### Caching Strategies
- GitHub API responses cached locally (5 minutes)
- Spotify data cached to reduce API calls
- Static asset optimization via Vercel

### Loading Optimization
- Lazy loading for non-critical components
- Image optimization with Next.js Image component
- PDF preview optimization and error handling

## Troubleshooting Common Issues

### Spotify Integration
- Verify OAuth flow and redirect URIs
- Check refresh token validity and regeneration
- Monitor API rate limits and implement backoff

### Contact Form
- Validate Gmail app password configuration
- Check rate limiting implementation
- Verify email delivery and error handling

### Build Issues
- Ensure all TypeScript types are properly defined
- Check for unused imports and variables
- Verify environment variable availability

## Contributing Guidelines

When making changes to this project:

1. **Maintain Type Safety**: Always use proper TypeScript types
2. **Test Thoroughly**: Test all new features locally and in production
3. **Follow Conventions**: Stick to established patterns and naming conventions
4. **Document Changes**: Update this file when adding new features or APIs
5. **Security First**: Always consider security implications of changes
6. **Performance Aware**: Monitor impact on loading times and user experience

## External Resources

- **Live Site**: https://www.snxethan.dev
- **Repository**: https://github.com/snxethan/Portfolio
- **Vercel Dashboard**: For deployment and environment management
- **Spotify Developer**: https://developer.spotify.com/dashboard
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs