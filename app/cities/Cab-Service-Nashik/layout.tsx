import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cab Service in Nashik | Worldtriplink | Taxi Booking',
  description: 'Worldtriplink offers reliable cab services in Nashik, including affordable Nashik to Pune taxi options. Book your taxi with us for a comfortable journey!',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Nashik'
  },
  authors: [{ name: 'Worldtriplink' }],
  keywords: 'local taxi service in Nashik, Nashik local taxi service, best taxi service in Nashik, Nashik bypass, Nashik sightseeing cabs, cab booking Nashik, rent a car in Nashik with driver, car rental service in Nashik, Kasara to Nashik taxi, Nashik airport taxi, Nashik to Pune cab service, Nasik to Pune cab service, driver on hire Nashik, outstation cabs Nashik',
  robots: 'index, follow'
}

export default function NashikCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 