import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ExternalLinkHandler } from "./components/ExternalLinkHandler"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ethan Townsend | Portfolio",
  description: "Software Engineer Portfolio",
  openGraph: {
    title: "Ethan Townsend | Portfolio",
    description: "Explore my website! Find my portfolio, education & experience, and more.",
    url: "https://www.snxethan.dev",
    siteName: "Ethan's Portfolio",
    images: [
      {
        url: "https://www.snxethan.dev/images/avatar.png",
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
    images: ["https://www.snxethan.dev/images/avatar.png"],
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
        <ExternalLinkHandler>
          {children}
        </ExternalLinkHandler>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
