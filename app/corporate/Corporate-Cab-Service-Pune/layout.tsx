import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Cab & Employee Transportation Services in Pune',
  description: 'WTL Tourism Pvt. Ltd. offers safe and reliable corporate employee transport services in Delhi. Ensure hassle-free, on-time cab solutions for your workforce.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/corporate/Corporate-Cab-Service-Pune'
  },
  authors: [{ name: 'WTL Tourism Pvt. Ltd.' }],
  keywords: 'corporate cab services in pune, corporate cab service in pune, corporate employee cab services in pune, corporate employee cab system in pune, uber cabs corporate office in pune, employee transportation services in pune, daily cab service in pune, corporate transport service',
  robots: 'index, follow'
}

export default function PuneCorporateCabServicePage({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 