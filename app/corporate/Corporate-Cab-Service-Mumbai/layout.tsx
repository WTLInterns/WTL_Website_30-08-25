import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Cab Service in Mumbai | Employee Transportation',
  description: 'WTL Tourism Pvt. Ltd. offers reliable corporate cab service in Mumbai. Ensure safe, on-time employee transportation services with our hassle-free cab solutions.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/corporate/Corporate-Cab-Service-Mumbai'
  },
  authors: [{ name: 'WTL Tourism' }],
  keywords: 'employee transportation services in mumbai, corporate employee transport services in mumbai, employee transport service in mumbai, cab transport services in mumbai for corporate, corporate cab service in mumbai, corporate cab services in mumbai, corporate employee cab services in mumbai, corporate employee cab system in mumbai, whats per km price for corporate night cabs in mumbai',
  robots: 'index, follow'
}

export default function MumbaiCorporateCabServicePage({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 