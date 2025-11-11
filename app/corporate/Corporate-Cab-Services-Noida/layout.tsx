import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Cab Service in Noida | Employee Transportation',
  description: 'WTL Tourism Pvt. Ltd. offers reliable corporate cab service in Noida. Ensure safe, on-time employee transportation services with our hassle-free cab solutions.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/corporate/Corporate-Cab-Service-Noida'
  },
  authors: [{ name: 'WTL Tourism' }],
  keywords: 'employee transportation services in Noida, corporate employee transport services in Noida, employee transport service in Noida, cab transport services in Noida for corporate, corporate cab service in Noida, corporate cab services in Noida, corporate employee cab services in Noida, corporate employee cab system in Noida, whats per km price for corporate night cabs in Noida',
  robots: 'index, follow'
}

export default function NoidaCorporateCabServicePage({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 