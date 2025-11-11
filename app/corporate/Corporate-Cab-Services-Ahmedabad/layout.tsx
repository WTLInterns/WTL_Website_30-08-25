import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Cab Service in Ahmedabad | Employee Transportation',
  description: 'WTL Tourism Pvt. Ltd. offers reliable corporate cab service in Ahmedabad. Ensure safe, on-time employee transportation services with our hassle-free cab solutions.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/corporate/Corporate-Cab-Service-Ahmedabad'
  },
  authors: [{ name: 'WTL Tourism' }],
  keywords: 'employee transportation services in Ahmedabad, corporate employee transport services in Ahmedabad, employee transport service in Ahmedabad, cab transport services in Ahmedabad for corporate, corporate cab service in Ahmedabad, corporate cab services in Ahmedabad, corporate employee cab services in Ahmedabad, corporate employee cab system in Ahmedabad, whats per km price for corporate night cabs in Ahmedabad',
  robots: 'index, follow'
}

export default function AhmedabadCorporateCabServicePage({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 