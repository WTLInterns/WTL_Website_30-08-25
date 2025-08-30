import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Cab Service in Sindhudurg | Pune to Sindhudurg Cabs',
  description: 'Book the best cab service in Sindhudurg with Worldtriplink. Reliable Pune to Sindhudurg and Sindhudurg to Pune cab services for a hassle-free journey!',
  alternates: {
    canonical: 'https://api.worldtriplink.com/cities/Cab-Service-Sindhudurg'
  },
  authors: [{ name: 'Ashutosh' }],
  keywords: 'Best cab service in Sindhudurg, Pune to Sindhudurg cab service, Sindhudurg to Pune cab service, cab service in Sindhudurg, reliable cabs in Sindhudurg, affordable taxi service in Sindhudurg, Worldtriplink cab booking',
  robots: 'index, follow'
}

export default function SindhudurgCabServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 