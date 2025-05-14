import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ethan Townsend | Portfolio",
  description: "Software Engineer Portfolio",
  openGraph: {
    title: "Ethan Townsend | Portfolio",
    description: "Explore my projects, resume, and about me section.",
    url: "https://www.snxethan.dev",
    siteName: "Ethan's Portfolio",
    images: [
      {
        url: "https://www.snxethan.dev/images/avatar.png", 
        width: 1200,
        height: 630,
        alt: "Ethan Townsend Portfolio Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethan Townsend | Portfolio",
    description: "Explore my projects, resume, and more.",
    images: ["https://www.snxethan.dev/images/preview.png"],
  },
}


export const viewport: Viewport = {
  themeColor: "#1a1a1a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#1a1a1a] text-white`}>{children}</body>
    </html>
  )
}
