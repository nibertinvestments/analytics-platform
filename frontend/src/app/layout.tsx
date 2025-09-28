import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analytics Platform',
  description: 'Enterprise-grade business intelligence dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}