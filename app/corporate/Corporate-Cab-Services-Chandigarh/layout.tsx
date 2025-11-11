import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Cab Service in Chandigarh | Employee Transportation',
  description: 'WTL Tourism Pvt. Ltd. offers reliable corporate cab service in Chandigarh. Ensure safe, on-time employee transportation services with our hassle-free cab solutions.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/corporate/Corporate-Cab-Service-Chandigarh'
  },
  authors: [{ name: 'WTL Tourism' }],
  keywords: 'employee transportation services in Chandigarh, corporate employee transport services in Chandigarh, employee transport service in Chandigarh, cab transport services in Chandigarh for corporate, corporate cab service in Chandigarh, corporate cab services in Chandigarh, corporate employee cab services in Chandigarh, corporate employee cab system in Chandigarh, whats per km price for corporate night cabs in Chandigarh',
  robots: 'index, follow'
}

export default function ChandigarhCorporateCabServicePage({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 