import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pune to Shirdi Cab | Cab Service in Shirdi | Worldtriplink',
  description: 'Book a Pune to Shirdi cab with Worldtriplink for a comfortable ride. Affordable fares, including one-way and round-trip options. Reliable taxi services available!',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Shirdi'
  },
  authors: [{ name: 'Worldtriplink' }],
  keywords: 'pune to shirdi cab, cab service in Shirdi, pune to shirdi cab service, pune to shirdi cab charges, pune to shirdi taxi, shirdi to pune cab, shirdi to pune taxi, distance between pune to shirdi, shirdi cab, shirdi taxi, pune to shirdi cab fare, pune to shirdi cab package, pune airport to shirdi cab, pune to shirdi cab one way, pune to shirdi distance by cab',
  robots: 'index, follow'
}

export default function ShirdiCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 