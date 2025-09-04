import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ExternalLinkHandler } from "./components/ExternalLinkHandler"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from 'react-hot-toast'
import ClickSoundWrapper from "./components/ClickSoundWrapper"

// Google Fonts configuration for Inter font family
const inter = Inter({ subsets: ["latin"] })

/**
 * Metadata configuration for the portfolio website
 * Defines SEO settings, Open Graph data, Twitter cards, and security headers
 */
export const metadata: Metadata = {
  title: "Ethan Townsend | Portfolio",
  description: "Full Stack Developer Portfolio",
  // Favicon and icon configuration for different devices and browsers
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  // Open Graph metadata for social media sharing
  openGraph: {
    title: "Ethan Townsend | Portfolio",
    description: "Explore my website! Find my portfolio, education & experience, and more.",
    url: "https://www.snxethan.dev",
    siteName: "snex.dev",
    images: [
      {
        url: "https://www.snxethan.dev/images/avatar/avatar.png",
        width: 512,
        height: 512,
        alt: "Ethan Townsend Portfolio Preview",
      },
    ],
    type: "website",
  },
  // Twitter Card configuration for Twitter sharing
  twitter: {
    card: "summary_large_image",
    title: "Ethan Townsend | Portfolio",
    description: "Explore my website! Find my portfolio, education & experience, and more.",
    images: ["https://www.snxethan.dev/images/avatar/snex.png"],
  },  
  // Security and privacy headers
  other: {
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'index, follow, noimageai, noimageindex',
    'Permissions-Policy': 'browsing-topics=(), interest-cohort=()',
    'Content-Security-Policy': "default-src 'self'",
  }
}

// Viewport configuration for mobile devices
export const viewport: Viewport = {
  themeColor: "#1a1a1a",
}

// Structured data (JSON-LD) for search engine optimization
// Helps search engines understand the content and context of the website
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ethan Townsend",
  "url": "https://www.snxethan.dev",
  "image": "https://www.snxethan.dev/images/avatar/snex.png",
  "jobTitle": "Software Engineer",
  "sameAs": [
    "https://github.com/snxethan",
    "https://www.linkedin.com/in/ethantownsend",
    "https://www.instagram.com/snxethan",

  ]
}

/**
 * Root layout component for the portfolio website
 * Wraps all pages with common elements like fonts, analytics, and global providers
 * Includes structured data injection for SEO purposes
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Inject structured data for search engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className={`${inter.className} bg-[#1a1a1a] text-white`}>
        {/* Toast notifications for user feedback */}
        <Toaster position="top-center" />
        
        {/* External link handler wrapper for security */}
        <ExternalLinkHandler>
          {/* Click sound wrapper is commented out but available for future use */}
          {/* <ClickSoundWrapper> */}
            {children}
          {/* </ClickSoundWrapper> */}
        </ExternalLinkHandler>
        
        {/* Vercel Analytics for tracking page views and performance */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
