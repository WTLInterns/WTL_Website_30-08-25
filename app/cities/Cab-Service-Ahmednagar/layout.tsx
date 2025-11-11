import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Taxi Service in Ahmednagar | Worldtriplink | Cab Booking',
  description: 'Worldtriplink offers reliable taxi services in Ahmednagar, including the best cab service nearby. Book a ride with us for a comfortable and affordable journey!',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Ahmednagar'
  },
  authors: [{ name: 'Worldtriplink' }],
  keywords: 'taxi service in Ahmednagar, cab service in Ahmednagar, best taxi service in Ahmednagar, best cab service in Ahmednagar, cab service in Ahmednagar near me',
  robots: 'index, follow'
}

export default function AhmednagarCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 