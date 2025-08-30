import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cheap Cab Service in Gondia | Gondia to Mumbai & Pune',
  description: 'Book cheap cab services in Gondia with WorldTriplink. Reliable Gondia to Mumbai and Gondia to Pune cab services at affordable rates.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Gondia'
  },
  authors: [{ name: 'Ashutosh' }],
  keywords: 'Cheap cab service in Gondia, Gondia to Mumbai, Gondia to Pune, Gondia cab booking, affordable taxi service, WorldTriplink cab services',
  robots: 'index, follow'
}

export default function GondiaCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 