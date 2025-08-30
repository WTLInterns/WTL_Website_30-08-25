import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cab Service in Washim | Best Taxi Service | Worldtriplink',
  description: 'Worldtriplink offers the best cab service in Washim. Book reliable Pune to Washim and Mumbai to Washim cab services for a comfortable and affordable journey.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Washim'
  },
  authors: [{ name: 'Ashutosh' }],
  keywords: 'Cab Service In Washim, Best Cab Service In Washim, Pune To Washim Cab Service, Mumbai To Washim Cab, Maharashtra taxi service, affordable taxi services, Worldtriplink cab booking',
  robots: 'index, follow'
}

export default function WashimCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 