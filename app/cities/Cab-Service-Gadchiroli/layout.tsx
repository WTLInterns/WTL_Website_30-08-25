import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gadchiroli to Mumbai | Best Cab Service in Gadchiroli',
  description: 'WorldTriplink offers the best cab service in Gadchiroli. Book reliable Gadchiroli to Mumbai and Pune to Gadchiroli cab services at affordable prices.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Gadchiroli'
  },
  authors: [{ name: 'Ashutosh' }],
  keywords: 'Gadchiroli to Mumbai, Best Cab Service in Gadchiroli, Cab Service in Gadchiroli, Mumbai to Gadchiroli Cab, Pune to Gadchiroli Cab Service, WorldTriplink cab services',
  robots: 'index, follow'
}

export default function GadchiroliCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 