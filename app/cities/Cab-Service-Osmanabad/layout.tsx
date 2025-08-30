import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cab Service in Osmanabad | Pune to Osmanabad Cabs',
  description: 'Worldtriplink offers the best cab service in Osmanabad. Book reliable Pune to Osmanabad and Mumbai to Osmanabad cab services for a smooth travel experience.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Osmanabad'
  },
  authors: [{ name: 'Ashutosh' }],
  keywords: 'Cab Service In Osmanabad, Best Cab Service In Osmanabad, Pune To Osmanabad Cab Service, Mumbai To Osmanabad Cab, reliable cabs in Osmanabad, affordable taxi service in Osmanabad, Worldtriplink cab booking',
  robots: 'index, follow'
}

export default function OsmanabadCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 