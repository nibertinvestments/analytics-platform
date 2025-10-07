'use client'

import Link from 'next/link'
import { BarChart3, Settings as SettingsIcon } from 'lucide-react'

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Analytics Platform</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/reports" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Reports
              </Link>
              <Link href="/settings" className="text-sm font-medium text-blue-600">
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="px-6 py-8 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <SettingsIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
          <p className="text-gray-600 mb-8">
            Manage your account and application preferences
          </p>
          <p className="text-sm text-gray-500">
            This feature is coming soon. Check back later!
          </p>
          <Link 
            href="/"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
