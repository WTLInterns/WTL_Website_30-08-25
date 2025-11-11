import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Cab Service in Kolkata | Employee Transportation',
  description: 'WTL Tourism Pvt. Ltd. offers reliable corporate cab service in Kolkata. Ensure safe, on-time employee transportation services with our hassle-free cab solutions.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/corporate/Corporate-Cab-Service-Kolkata'
  },
  authors: [{ name: 'WTL Tourism' }],
  keywords: 'employee transportation services in Kolkata, corporate employee transport services in Kolkata, employee transport service in Kolkata, cab transport services in Kolkata for corporate, corporate cab service in Kolkata, corporate cab services in Kolkata, corporate employee cab services in Kolkata, corporate employee cab system in Kolkata, whats per km price for corporate night cabs in Kolkata',
  robots: 'index, follow'
}

export default function KolkataCorporateCabServicePage({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 