import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Satara Car Rental | Reliable Taxi Service - WorldTripLink',
  description: 'WorldTripLink offers reliable Satara car rental services. Book taxis for local trips, Satara to Mahabaleshwar, Panchgani, and hill station travel.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Satara'
  },
  authors: [{ name: 'WorldTripLink' }],
  keywords: 'Satara car rental, Satara hill station, Satara to Mahabaleshwar cab, car hire in Satara, Satara taxi service, Satara to Panchgani taxi fare, Satara cab booking, affordable taxi in Satara',
  robots: 'index, follow'
}

export default function SataraCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 