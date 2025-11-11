import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cab Service in Akola | Best Cab Service | Worldtriplink',
  description: 'Book the best cab service in Akola with Worldtriplink. Reliable, affordable, and hassle-free Pune to Akola cab services for a comfortable journey!',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Akola'
  },
  authors: [{ name: 'Ashutosh' }],
  keywords: 'cab service in Akola, best cab service in Akola, Pune to Akola cab services, reliable cabs in Akola, affordable taxi service in Akola, Akola cab booking',
  robots: 'index, follow'
}

export default function AkolaCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 