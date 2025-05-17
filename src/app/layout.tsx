import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ExternalLinkHandler } from "./components/ExternalLinkHandler"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from 'react-hot-toast'
import ClickSoundWrapper from "./components/ClickSoundWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ethan Townsend | Portfolio",
  description: "Full Stack Developer Portfolio",
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
  twitter: {
    card: "summary_large_image",
    title: "Ethan Townsend | Portfolio",
    description: "Explore my website! Find my portfolio, education & experience, and more.",
    images: ["https://www.snxethan.dev/images/avatar/avatar.png"],
  },
}


export const viewport: Viewport = {
  themeColor: "#1a1a1a",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className={`${inter.className} bg-[#1a1a1a] text-white`}>
      <Toaster position="top-center" />
        <ExternalLinkHandler>
              <ClickSoundWrapper>
          {children}
              </ClickSoundWrapper>
        </ExternalLinkHandler>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
