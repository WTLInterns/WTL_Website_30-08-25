import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Taxi Service in Nanded | Car Rental in Nanded | WTL',
  description: 'Book reliable taxi services and car rentals in Nanded with Worldtriplink. Enjoy affordable Pune to Nanded and Mumbai to Nanded cab services.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Nanded'
  },
  authors: [{ name: 'Ashutosh' }],
  keywords: 'Taxi service in Nanded, Car rental in Nanded, Cab Service In Nanded, Best Cab Service In Nanded, Pune To Nanded Cab Service, Mumbai To Nanded Cab, affordable taxi services, Worldtriplink cab booking',
  robots: 'index, follow'
}

export default function NandedCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 