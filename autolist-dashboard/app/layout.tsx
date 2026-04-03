import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AutoList — Facebook Marketplace Lister for Dealers',
  description: 'Scrape Autotrader listings and post to Facebook Marketplace in seconds. AI-generated descriptions, photo injection, and dealer dashboard.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
