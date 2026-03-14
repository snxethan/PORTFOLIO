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
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="bg-[#1a1a1a] text-white font-sans">
        <Script
          id="person-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Toaster
          position="top-center"
          toastOptions={{
            // Default options for all toasts
            duration: 4000,
            className: 'animate-fade-in-up',
            style: {
              background: '#1e1e1e',
              color: '#fff',
              border: '1px solid #333333',
              borderRadius: '0.75rem',
              padding: '16px',
              fontSize: '14px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
            },
            // Success toast styling
            success: {
              duration: 3000,
              className: 'animate-fade-in-up',
              style: {
                border: '1px solid #10b981',
              },
              iconTheme: {
                primary: '#10b981',
                secondary: '#1e1e1e',
              },
            },
            // Error toast styling
            error: {
              duration: 4000,
              className: 'animate-fade-in-up',
              style: {
                border: '1px solid #dc2626',
              },
              iconTheme: {
                primary: '#dc2626',
                secondary: '#1e1e1e',
              },
            },
            // Loading toast styling
            loading: {
              className: 'animate-fade-in-up',
              style: {
                border: '1px solid #ef4444',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1e1e1e',
              },
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
