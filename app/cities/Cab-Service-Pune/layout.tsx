import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cab Booking in Pune | Reliable Mumbai Pune Taxi Service',
  description: 'WorldTripLink provides seamless Mumbai Pune taxi services, cab rentals in Pune, and car hire options with drivers. Affordable, reliable, and hassle-free rides.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Pune'
  },
  authors: [{ name: 'Ashutosh' }],
  keywords: 'Mumbai Pune taxi service, cab rental Pune, car hire in Pune, taxi on rent in Pune, Mumbai to Pune cab charges, Mumbai to Pune car, Pune to Mumbai car, road trip from Pune, car travel agency, Dadar to Pune cab, Mumbai to Pune distance by car, taxi in Mumbai for full day, best car rental in Mumbai',
  robots: 'index, follow'
}

export default function PuneCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 