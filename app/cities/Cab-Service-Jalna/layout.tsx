import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Cab Service in Jalna | Pune to Jalna Cabs | WTL',
  description: 'Worldtriplink offers the best cab service in Jalna. Book Pune to Jalna cab services for a hassle-free, comfortable, and affordable travel experience.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Jalna'
  },
  authors: [{ name: 'Ashutosh' }],
  keywords: 'Best cab service in Jalna, Pune to Jalna cab service, cab service in Jalna, reliable taxi service in Jalna, affordable cab booking in Jalna, Worldtriplink cab services',
  robots: 'index, follow'
}

export default function JalnaCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 