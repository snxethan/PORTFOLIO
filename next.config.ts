/**
 * Next.js configuration file for the portfolio website
 * Configures build settings, ESLint behavior, and URL rewrites for domain routing
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during builds to prevent deployment failures
  // Lint checks should be handled in development and CI/CD pipeline
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  /**
   * URL rewrites configuration for domain-based routing
   * Redirects specific domains to the social page for social media contexts
   * Allows different content to be served based on the requesting domain
   */
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'ethantownsend.dev' }],
        destination: '/social',
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.ethantownsend.dev' }],
        destination: '/social',
      },
    ]
  },
};

export default nextConfig;