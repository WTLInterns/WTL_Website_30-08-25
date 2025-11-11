import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Cab Service in Gurgaon | Employee Transportation',
  description: 'WTL Tourism Pvt. Ltd. offers reliable corporate cab service in Gurgaon. Ensure safe, on-time employee transportation services with our hassle-free cab solutions.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/corporate/Corporate-Cab-Service-Gurgaon'
  },
  authors: [{ name: 'WTL Tourism' }],
  keywords: 'employee transportation services in Gurgaon, corporate employee transport services in Gurgaon, employee transport service in Gurgaon, cab transport services in Gurgaon for corporate, corporate cab service in Gurgaon, corporate cab services in Gurgaon, corporate employee cab services in Gurgaon, corporate employee cab system in Gurgaon, whats per km price for corporate night cabs in Gurgaon',
  robots: 'index, follow'
}

export default function GurgaonCorporateCabServicePage({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 