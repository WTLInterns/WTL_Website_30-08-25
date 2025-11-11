import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aurangabad To Mumbai Best Cab Service | WorldTriplink',
  description: 'Enjoy Aurangabad to Mumbai best cab service with WorldTriplink (WTL). Trusted, comfortable, and affordable cab booking service in Aurangabad.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Aurangabad'
  },
  authors: [{ name: 'WorldTriplink (WTL)' }],
  keywords: 'Aurangabad To Mumbai, Best Cab Service In Aurangabad, Cab Service In Aurangabad, Mumbai To Aurangabad Cab, Pune To Aurangabad Cab Service',
  robots: 'index, follow'
}

export default function AurangabadCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 