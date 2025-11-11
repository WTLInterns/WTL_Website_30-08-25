import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Cab Service in Nagpur | Employee Transportation',
  description: 'WTL Tourism Pvt. Ltd. offers reliable corporate cab service in Nagpur. Ensure safe, on-time employee transportation services with our hassle-free cab solutions.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/corporate/Corporate-Cab-Service-Nagpur'
  },
  authors: [{ name: 'WTL Tourism' }],
  keywords: 'employee transportation services in Nagpur, corporate employee transport services in Nagpur, employee transport service in Nagpur, cab transport services in Nagpur for corporate, corporate cab service in Nagpur, corporate cab services in Nagpur, corporate employee cab services in Nagpur, corporate employee cab system in Nagpur, whats per km price for corporate night cabs in Nagpur',
  robots: 'index, follow'
}

export default function NagpurCorporateCabServicePage({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 