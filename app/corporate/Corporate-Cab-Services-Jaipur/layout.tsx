import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Cab Service in Jaipur | Employee Transportation',
  description: 'WTL Tourism Pvt. Ltd. offers reliable corporate cab service in Jaipur. Ensure safe, on-time employee transportation services with our hassle-free cab solutions.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/corporate/Corporate-Cab-Service-Jaipur'
  },
  authors: [{ name: 'WTL Tourism' }],
  keywords: 'employee transportation services in Jaipur, corporate employee transport services in Jaipur, employee transport service in Jaipur, cab transport services in Jaipur for corporate, corporate cab service in Jaipur, corporate cab services in Jaipur, corporate employee cab services in Jaipur, corporate employee cab system in Jaipur, whats per km price for corporate night cabs in Jaipur',
  robots: 'index, follow'
}

export default function JaipurCorporateCabServicePage({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 