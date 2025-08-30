// app/page.tsx
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home | World Trip Link",
  description: "Explore and book flights, hotels, buses, cabs, and holiday packages with World Trip Link.",
  keywords: [
    "travel booking",
    "cab booking",
    "bus tickets",
    "flights",
    "hotels",
    "holiday packages",
    "World Trip Link"
  ],
  metadataBase: new URL("https://api.worldtriplink.com"),
  alternates: {
    canonical: "https://api.worldtriplink.com/",
  },
  openGraph: {
    title: "Home - World Trip Link",
    description: "Book your next adventure with World Trip Link. Best deals on cabs, flights, hotels & more.",
    url: "https://api.worldtriplink.com/",
    siteName: "World Trip Link",
    type: "website",
    images: [
      {
        url: "https://api.worldtriplink.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "World Trip Link Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home - World Trip Link",
    description: "Book your next adventure online with World Trip Link.",
    site: "@worldtriplink",
    creator: "@worldtriplink",
    images: ["https://api.worldtriplink.com/images/og-image.jpg"],
  },
  robots: "index, follow",
  other: {
    "google-site-verification": "6SysWbzWBM94Wtixh0BkkT2Tbd5-Fcmw7nzrbNyRT2w",
  },
}

import HomePage from "./HomePage"
export default function Page() {
  return <HomePage/>
}
