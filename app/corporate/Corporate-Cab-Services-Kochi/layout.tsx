import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Cab Service in Kochi | Employee Transportation',
  description: 'WTL Tourism Pvt. Ltd. offers reliable corporate cab service in Kochi. Ensure safe, on-time employee transportation services with our hassle-free cab solutions.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/corporate/Corporate-Cab-Service-Kochi'
  },
  authors: [{ name: 'WTL Tourism' }],
  keywords: 'employee transportation services in Kochi, corporate employee transport services in Kochi, employee transport service in Kochi, cab transport services in Kochi for corporate, corporate cab service in Kochi, corporate cab services in Kochi, corporate employee cab services in Kochi, corporate employee cab system in Kochi, whats per km price for corporate night cabs in Kochi',
  robots: 'index, follow'
}

export default function KochiCorporateCabServicePage({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 