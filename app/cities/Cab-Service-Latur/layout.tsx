import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cab Service in Latur | Pune to Latur | Mumbai to Latur',
  description: 'Book reliable cab services in Latur with Worldtriplink. Enjoy affordable Pune to Latur and Mumbai to Latur cab services for a hassle-free journey.',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Latur'
  },
  authors: [{ name: 'Ashutosh' }],
  keywords: 'Cab Service In Latur, Pune To Latur Cab Service, Mumbai To Latur Cab, best cab service in Latur, affordable taxi service in Latur, Worldtriplink cab booking',
  robots: 'index, follow'
}

export default function LaturCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 