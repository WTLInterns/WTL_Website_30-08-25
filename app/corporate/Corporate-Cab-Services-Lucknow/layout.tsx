import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Cab Service in Lucknow | Employee Transportation',
  description: 'WTL Tourism Pvt. Ltd. offers reliable corporate cab service in Lucknow. Ensure safe, on-time employee transportation services with our hassle-free cab solutions.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/corporate/Corporate-Cab-Service-Lucknow'
  },
  authors: [{ name: 'WTL Tourism' }],
  keywords: 'employee transportation services in Lucknow, corporate employee transport services in Lucknow, employee transport service in Lucknow, cab transport services in Lucknow for corporate, corporate cab service in Lucknow, corporate cab services in Lucknow, corporate employee cab services in Lucknow, corporate employee cab system in Lucknow, whats per km price for corporate night cabs in Lucknow',
  robots: 'index, follow'
}

export default function LucknowCorporateCabServicePage({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 