'use client';

import { useEffect, useState } from 'react';

interface HealthData {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  services: {
    database: string;
    redis: string;
  };
}

export default function HomePage() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        if (data.success) {
          setHealthData(data.data);
        } else {
          setError('Failed to fetch health data');
        }
      } catch (err) {
        setError('Connection error - backend may not be running');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Welcome to Analytics Platform
        </h2>
        <p className="text-slate-600 mb-6">
          This is the foundation implementation of the Analytics Platform. The backend infrastructure
          is set up and ready for development.
        </p>
        
        <div className="bg-slate-50 rounded-lg p-4">
          <h3 className="font-semibold text-slate-800 mb-2">Implementation Status:</h3>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Backend API server with Express.js and TypeScript
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              PostgreSQL database with Prisma ORM
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Docker containerization for all services
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              CI/CD pipeline with GitHub Actions
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Health monitoring and logging
            </li>
            <li className="flex items-center">
              <span className="text-yellow-500 mr-2">⏳</span>
              Authentication system (Next phase)
            </li>
            <li className="flex items-center">
              <span className="text-yellow-500 mr-2">⏳</span>
              Analytics dashboards (Future phases)
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Backend Health Status</h3>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <span className="text-red-800 font-medium">Backend Offline</span>
            </div>
            <p className="text-red-600 text-sm mt-2">{error}</p>
          </div>
        ) : healthData ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-green-800 font-medium">Backend Online</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-slate-600">Status</div>
                <div className="font-medium">{healthData.status}</div>
              </div>
              <div>
                <div className="text-slate-600">Environment</div>
                <div className="font-medium">{healthData.environment}</div>
              </div>
              <div>
                <div className="text-slate-600">Uptime</div>
                <div className="font-medium">{Math.floor(healthData.uptime / 60)}m</div>
              </div>
              <div>
                <div className="text-slate-600">Version</div>
                <div className="font-medium">{healthData.version}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="text-slate-600 text-sm mb-2">Services Status:</div>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Database: {healthData.services.database}
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Redis: {healthData.services.redis}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}