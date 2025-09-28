import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analytics Platform',
  description: 'Enterprise Business Intelligence Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <header className="bg-slate-900 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-xl font-bold">Analytics Platform</h1>
            <p className="text-slate-300 text-sm">Enterprise Business Intelligence Dashboard</p>
          </div>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-slate-100 text-slate-600 p-4 mt-8">
          <div className="container mx-auto text-center">
            <p>&copy; 2024 Nibert Investments. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}