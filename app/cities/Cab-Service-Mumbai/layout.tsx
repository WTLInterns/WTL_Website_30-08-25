import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Taxi Service in Mumbai | Best Cab Booking - WorldTripLink',
  description: 'WorldTripLink offers reliable taxi services in Mumbai. Book the best cab service for hassle-free travel, including affordable local and outstation cab options.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Mumbai'
  },
  authors: [{ name: 'WorldTripLink' }],
  keywords: 'taxi service in mumbai, cab service in mumbai, cab booking mumbai, best cab service in mumbai, best taxi service in mumbai, cabs in mumbai, cheapest cab service in mumbai, mumbai cab rental services, taxi in mumbai, local taxi service in mumbai, full day cab mumbai, best outstation cab service in mumbai, cheapest cabs in mumbai, cabs in mumbai for a day',
  robots: 'index, follow'
}

export default function MumbaiCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 