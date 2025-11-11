// app/about/page.tsx
import { Metadata } from "next"
import AboutClient from "././aboutClient" 

export const metadata: Metadata = {
  title: "About Us | World Trip Link",
  description: "Learn more about World Trip Link, our mission, and our team.",
  metadataBase: new URL("https://api.worldtriplink.com"),
  alternates: {
    canonical: "https://api.worldtriplink.com/about",
  },
  openGraph: {
    title: "About Us - World Trip Link",
    description: "Discover the story and team behind World Trip Link.",
    url: "https://api.worldtriplink.com/about",
    siteName: "World Trip Link",
    type: "website",
    images: [
      {
        url: "https://api.worldtriplink.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About World Trip Link",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - World Trip Link",
    description: "Get to know the team behind your favorite travel platform.",
    site: "@worldtriplink",
    creator: "@worldtriplink",
    images: ["https://api.worldtriplink.com/images/og-image.jpg"],
  },
  robots: "index, follow",
}

export default function Page() {
  return <AboutClient />
}
