// app/mytrip/page.tsx
import { Metadata } from "next"
import MyTripClient from "././mytripClient"

export const metadata: Metadata = {
  title: "My Trip | World Trip Link",
  description: "View and manage your booked trips with World Trip Link.",
  metadataBase: new URL("https://api.worldtriplink.com"),
  alternates: {
    canonical: "https://api.worldtriplink.com/mytrip",
  },
  openGraph: {
    title: "My Trip - World Trip Link",
    description: "Access your trip details and manage your bookings easily.",
    url: "https://api.worldtriplink.com/mytrip",
    siteName: "World Trip Link",
    type: "website",
    images: [
      {
        url: "https://api.worldtriplink.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "World Trip Link Trip Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Trip - World Trip Link",
    description: "Manage your bookings with World Trip Link.",
    site: "@worldtriplink",
    creator: "@worldtriplink",
    images: ["https://api.worldtriplink.com/images/og-image.jpg"],
  },
  robots: "index, follow",
}

export default function Page() {
  return <MyTripClient />
}
