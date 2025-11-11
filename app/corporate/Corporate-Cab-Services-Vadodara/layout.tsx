import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Cab Service in Vadodara | Employee Transportation',
  description: 'WTL Tourism Pvt. Ltd. offers reliable corporate cab service in Vadodara. Ensure safe, on-time employee transportation services with our hassle-free cab solutions.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/corporate/Corporate-Cab-Service-Vadodara'
  },
  authors: [{ name: 'WTL Tourism' }],
  keywords: 'employee transportation services in Vadodara, corporate employee transport services in Vadodara, employee transport service in Vadodara, cab transport services in Vadodara for corporate, corporate cab service in Vadodara, corporate cab services in Vadodara, corporate employee cab services in Vadodara, corporate employee cab system in Vadodara, whats per km price for corporate night cabs in Vadodara',
  robots: 'index, follow'
}

export default function VadodaraCorporateCabServicePage({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 