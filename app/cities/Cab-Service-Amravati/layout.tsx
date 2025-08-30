import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Amravati To Mumbai Best Cab Service | WorldTriplink',
  description: 'Experience Amravati to Mumbai best cab service with WorldTriplink (WTL). Reliable, safe, and affordable cab booking service in Amravati.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Amravati'
  },
  authors: [{ name: 'WorldTriplink (WTL)' }],
  keywords: 'Amravati To Mumbai, Best Cab Service In Amravati, Cab Service In Amravati, Mumbai To Amravati Cab, Pune To Amravati Cab Service',
  robots: 'index, follow'
}

export default function AmravatiCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 