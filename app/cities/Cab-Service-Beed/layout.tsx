import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Taxi Service in Beed | Worldtriplink | Pune to Beed Cabs',
  description: 'Worldtriplink offers reliable taxi services in Beed, including Pune to Beed cab services. Book your cab for a comfortable and affordable journey today!',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Beed'
  },
  authors: [{ name: 'Ashutosh' }],
  keywords: 'taxi service in Beed, cab service in Beed, Pune to Beed cab services, best taxi service in Beed, best cab service in Beed, cab service near me in Beed',
  robots: 'index, follow'
}

export default function BeedCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 