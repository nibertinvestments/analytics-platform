'use client'

import { useEffect, useState } from 'react'
import { 
  BarChart3, 
  Users, 
  Activity, 
  TrendingUp,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

interface MetricCard {
  title: string
  value: string
  change: number
  icon: React.ReactNode
}

interface AnalyticsEvent {
  id: string
  metric: string
  value: number
  timestamp: string
  userId?: string
}

interface ApiResponse {
  success: boolean
  data: AnalyticsEvent[]
}

export default function Home() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Calculate metrics from real API data
  const metrics: MetricCard[] = [
    {
      title: 'Total Events',
      value: analyticsData.length.toString(),
      change: 0,
      icon: <BarChart3 className="h-6 w-6" />
    },
    {
      title: 'Unique Metrics',
      value: new Set(analyticsData.map(d => d.metric)).size.toString(),
      change: 0,
      icon: <Activity className="h-6 w-6" />
    },
    {
      title: 'Active Users',
      value: new Set(analyticsData.map(d => d.userId).filter(Boolean)).size.toString(),
      change: 0,
      icon: <Users className="h-6 w-6" />
    },
    {
      title: 'Avg Value',
      value: analyticsData.length > 0 
        ? (analyticsData.reduce((sum, d) => sum + d.value, 0) / analyticsData.length).toFixed(2)
        : '0',
      change: 0,
      icon: <TrendingUp className="h-6 w-6" />
    }
  ]

  useEffect(() => {
    // Fetch analytics data from the backend
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/analytics')
        const data: ApiResponse = await response.json()
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        if (data.success && Array.isArray(data.data)) {
          setAnalyticsData(data.data)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
              <a href="#" className="text-sm font-medium text-blue-600">Dashboard</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Reports</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Settings</a>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="px-6 py-8 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="mt-2 text-gray-600">Real-time analytics and performance metrics</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {metric.icon}
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change >= 0 ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization</p>
                <p className="text-sm text-gray-400 mt-1">Data will be displayed here</p>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization</p>
                <p className="text-sm text-gray-400 mt-1">Data will be displayed here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Analytics Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Analytics Events</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading analytics data...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4 mx-auto">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-red-600 font-medium">Error loading data</p>
                <p className="text-sm text-gray-500 mt-2">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : analyticsData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyticsData.slice(0, 10).map((item, index) => (
                      <tr key={item.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.metric}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.value}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(item.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.userId || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No analytics data available</p>
                <p className="text-sm text-gray-400 mt-2">Data will appear here once events are tracked</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
            <h4 className="text-sm font-medium opacity-90 mb-2">System Status</h4>
            <p className="text-2xl font-bold">Operational</p>
            <p className="text-sm opacity-90 mt-2">All systems running smoothly</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
            <h4 className="text-sm font-medium opacity-90 mb-2">Uptime</h4>
            <p className="text-2xl font-bold">99.9%</p>
            <p className="text-sm opacity-90 mt-2">Last 30 days</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
            <h4 className="text-sm font-medium opacity-90 mb-2">API Response</h4>
            <p className="text-2xl font-bold">145ms</p>
            <p className="text-sm opacity-90 mt-2">Average response time</p>
          </div>
        </div>
      </main>
    </div>
  )
}