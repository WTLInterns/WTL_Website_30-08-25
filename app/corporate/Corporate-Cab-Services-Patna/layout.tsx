import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Cab Service in Patna | Employee Transportation',
  description: 'WTL Tourism Pvt. Ltd. offers reliable corporate cab service in Patna. Ensure safe, on-time employee transportation services with our hassle-free cab solutions.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/corporate/Corporate-Cab-Service-Patna'
  },
  authors: [{ name: 'WTL Tourism' }],
  keywords: 'employee transportation services in Patna, corporate employee transport services in Patna, employee transport service in Patna, cab transport services in Patna for corporate, corporate cab service in Patna, corporate cab services in Patna, corporate employee cab services in Patna, corporate employee cab system in Patna, whats per km price for corporate night cabs in Patna',
  robots: 'index, follow'
}

export default function PatnaCorporateCabServicePage({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 