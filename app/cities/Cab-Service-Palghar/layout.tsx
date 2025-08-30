import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Palghar to Mumbai Cab | Cab Service in Palghar | WTL',
  description: 'Book a reliable Palghar to Mumbai cab service with Worldtriplink. Affordable, comfortable, and hassle-free travel from Palghar to Mumbai and beyond.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Palghar'
  },
  authors: [{ name: 'Ashutosh' }],
  keywords: 'Palghar to Mumbai, Cab Service in Palghar, Palghar Mumbai, Pune to Palghar distance, affordable taxi services, Worldtriplink cab booking',
  robots: 'index, follow'
}

export default function PalgharCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 