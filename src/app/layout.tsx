import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ExternalLinkHandler } from "./components/ExternalLinkHandler"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from 'react-hot-toast'
import Script from "next/script"


export const metadata: Metadata = {
  title: "Ethan Townsend",
  description: "Im a Software Engineer & Backend Developer",
  icons: {
    // Keep the browser tab icon on the existing root favicon (snex).
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
    apple: "/images/avatar/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/images/avatar/favicon/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/images/avatar/favicon/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
  },
  manifest: "/images/avatar/favicon/site.webmanifest",
  openGraph: {
    title: "Ethan Townsend",
    description: "Im a Software Engineer & Backend Developer",
    url: "https://www.ethantownsend.dev",
    siteName: "ethantownsend.dev",
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
  twitter: {
    card: "summary_large_image",
    title: "Ethan Townsend",
    description: "Im a Software Engineer & Backend Developer",
    images: ["https://www.snxethan.dev/images/avatar/avatar.png"],
  },  other: {
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "index, follow, noimageai, noimageindex",
    "Permissions-Policy": "browsing-topics=(), interest-cohort=()",
    "Content-Security-Policy": "default-src 'self'",
  },
}
export const viewport: Viewport = {
  themeColor: "#1a1a1a",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ethan Townsend",
  "title": "Ethan Townsend Portfolio",
  "url": "https://www.ethantownsend.dev",
  "image": "https://www.snxethan.dev/images/avatar/avatar.png",
  "jobTitle": "Software Engineer",
  "sameAs": [
    "https://github.com/snxethan",
    "https://www.linkedin.com/in/snxethan",
    "https://www.instagram.com/snxethan",
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="font-sans" style={{ background: "#ece9d8", color: "#000000" }}>
        <Script
          id="person-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            className: 'animate-fade-in-up',
            style: {
              background: '#d4d0c8',
              color: '#000000',
              border: '1px solid',
              borderTopColor: '#ffffff',
              borderLeftColor: '#ffffff',
              borderRightColor: '#404040',
              borderBottomColor: '#404040',
              borderRadius: '0',
              padding: '8px 12px',
              fontSize: '11px',
              fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
              boxShadow: '2px 2px 4px rgba(0,0,0,0.4)',
            },
            success: {
              duration: 3000,
              className: 'animate-fade-in-up',
              style: { borderTopColor: '#008000' },
              iconTheme: { primary: '#008000', secondary: '#d4d0c8' },
            },
            error: {
              duration: 4000,
              className: 'animate-fade-in-up',
              style: { borderTopColor: '#800000' },
              iconTheme: { primary: '#800000', secondary: '#d4d0c8' },
            },
            loading: {
              className: 'animate-fade-in-up',
              style: {},
              iconTheme: { primary: '#000080', secondary: '#d4d0c8' },
            },
          }}
        />
        <ExternalLinkHandler>
            {children}
        </ExternalLinkHandler>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
