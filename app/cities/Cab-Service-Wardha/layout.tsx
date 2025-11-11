import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Cab Service in Wardha | Reliable Taxi Service | WTL',
  description: 'Worldtriplink offers the best cab service in Wardha. Book affordable Mumbai to Wardha and Pune to Wardha cab services for a smooth travel experience.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Wardha'
  },
  authors: [{ name: 'Ashutosh' }],
  keywords: 'Best Cab Service In Wardha, Cab Service In Wardha, Mumbai To Wardha Cab, Pune To Wardha Cab Service, affordable taxi services, Worldtriplink cab booking',
  robots: 'index, follow'
}

export default function WardhaCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 