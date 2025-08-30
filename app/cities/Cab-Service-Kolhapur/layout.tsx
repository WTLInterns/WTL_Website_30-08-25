import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Taxi Service in Kolhapur | Best Cab Booking - WorldTripLink',
  description: 'WorldTripLink offers reliable taxi services in Kolhapur. Book affordable cab services for local travel and outstation trips with trusted drivers.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Kolhapur'
  },
  authors: [{ name: 'Ashutosh' }],
  keywords: 'kolhapur taxi, taxi kolhapur, car rental service in kolhapur, Kolhapur cab service, affordable taxi in Kolhapur, Kolhapur local taxi, Kolhapur outstation cabs',
  robots: 'index, follow'
}

export default function KolhapurCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 