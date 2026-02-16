import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ExternalLinkHandler } from "./components/ExternalLinkHandler"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from 'react-hot-toast'


export const metadata: Metadata = {
  title: "Ethan Townsend | Software Engineer",
  description: "Im a Software Engineer & Backend Developer",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Ethan Townsend | Software Engineer",
    description: "Im a Software Engineer & Backend Developer",
    url: "https://www.ethantownsend.dev",
    siteName: "ethantownsend.dev",
    images: [
      {
        url: "https://www.snxethan.dev/images/avatar/snex.png",
        width: 512,
        height: 512,
        alt: "Ethan Townsend Portfolio Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethan Townsend | Software Engineer",
    description: "Im a Software Engineer & Backend Developer",
    images: ["https://www.snxethan.dev/images/avatar/snex.png"],
  },  other: {
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'index, follow, noimageai, noimageindex',
    'Permissions-Policy': 'browsing-topics=(), interest-cohort=()',
    'Content-Security-Policy': "default-src 'self'",
  }
}
export const viewport: Viewport = {
  themeColor: "#1a1a1a",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ethan Townsend",
  "url": "https://www.ethantownsend.dev",
  "image": "https://www.snxethan.dev/images/avatar/snex.png",
  "jobTitle": "Software Engineer",
  "sameAs": [
    "https://github.com/snxethan",
    "https://www.linkedin.com/in/ethantownsend",
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
      <head>
        {/* Inject structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="bg-[#1a1a1a] text-white font-sans">
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
          {/* <ClickSoundWrapper> */}
            {children}
          {/* </ClickSoundWrapper> */}
        </ExternalLinkHandler>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
