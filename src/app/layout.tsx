import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NFKBO Service',
  description: 'KBO provider abstraction service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}