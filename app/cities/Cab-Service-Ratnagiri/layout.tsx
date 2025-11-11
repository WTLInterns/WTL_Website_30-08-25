import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cab Service in Ratnagiri | Worldtriplink | Taxi Booking',
  description: 'Worldtriplink offers reliable cab services in Ratnagiri, including Ratnagiri to Ganpatipule. Book a taxi or car rental with us for a comfortable journey!',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Ratnagiri'
  },
  authors: [{ name: 'Worldtriplink' }],
  keywords: 'cab service in Ratnagiri, taxi service in Ratnagiri, Ratnagiri to Ganpatipule, car rental in Ratnagiri, bike rent in Ratnagiri, Ratnagiri railway station to Ganpatipule distance, self drive car in Ratnagiri, Ratnagiri to Pune cab service, Ratnagiri to Mumbai cab services',
  robots: 'index, follow'
}

export default function RatnagiriCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 