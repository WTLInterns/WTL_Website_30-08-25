import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Cab Service in Hyderabad | Employee Transportation',
  description: 'WTL Tourism Pvt. Ltd. offers reliable corporate cab service in Hyderabad. Ensure safe, on-time employee transportation services with our hassle-free cab solutions.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/corporate/Corporate-Cab-Service-Hyderabad'
  },
  authors: [{ name: 'WTL Tourism' }],
  keywords: 'employee transportation services in Hyderabad, corporate employee transport services in Hyderabad, employee transport service in Hyderabad, cab transport services in Hyderabad for corporate, corporate cab service in Hyderabad, corporate cab services in Hyderabad, corporate employee cab services in Hyderabad, corporate employee cab system in Hyderabad, whats per km price for corporate night cabs in Hyderabad',
  robots: 'index, follow'
}

export default function HyderabadCorporateCabServicePage({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 