import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Social Links | Ethan Townsend",
  description: "Connect with Ethan Townsend on various social platforms and explore his portfolio links",
  openGraph: {
    title: "Social Links | Ethan Townsend",
    description: "Connect with me on various platforms and explore my portfolio",
    url: "https://www.snxethan.dev/social",
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
    title: "Social Links | Ethan Townsend",
    description: "Connect with me on various platforms and explore my portfolio",
    images: ["https://www.snxethan.dev/images/avatar/snex.png"],
  }
}

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}