import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Cab Service in Bhopal | Employee Transportation',
  description: 'WTL Tourism Pvt. Ltd. offers reliable corporate cab service in Bhopal. Ensure safe, on-time employee transportation services with our hassle-free cab solutions.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/corporate/Corporate-Cab-Service-Bhopal'
  },
  authors: [{ name: 'WTL Tourism' }],
  keywords: 'employee transportation services in Bhopal, corporate employee transport services in Bhopal, employee transport service in Bhopal, cab transport services in Bhopal for corporate, corporate cab service in Bhopal, corporate cab services in Bhopal, corporate employee cab services in Bhopal, corporate employee cab system in Bhopal, whats per km price for corporate night cabs in Bhopal',
  robots: 'index, follow'
}

export default function BhopalCorporateCabServicePage({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 