import request from 'supertest'

jest.mock('../services/analytics.service', () => ({
  analyticsService: {
    listAnalytics: jest.fn(),
  },
}))

import app from '../app'
import { analyticsService } from '../services/analytics.service'

const mockListAnalytics = analyticsService.listAnalytics as jest.Mock

describe('Backend API', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200)

      expect(response.body).toMatchObject({
        status: 'ok',
        service: 'analytics-backend',
      })
      expect(response.body.timestamp).toBeDefined()
      expect(response.body.version).toBeDefined()
    })
  })

  describe('GET /api/analytics', () => {
    it('should return analytics data', async () => {
      const sampleData = [
        { id: '1', metric: 'users', value: 100, timestamp: new Date().toISOString() },
        { id: '2', metric: 'sessions', value: 250, timestamp: new Date().toISOString() },
      ]

      mockListAnalytics.mockResolvedValue({
        data: sampleData,
        meta: { count: sampleData.length },
      })

      const response = await request(app)
        .get('/api/analytics')
        .expect(200)

      expect(response.body).toMatchObject({
        success: true,
        data: expect.any(Array),
        meta: { count: sampleData.length },
      })

      expect(response.body.data).toHaveLength(2)
      expect(response.body.data[0]).toMatchObject({
        id: expect.any(String),
        metric: expect.any(String),
        value: expect.any(Number),
        timestamp: expect.any(String),
      })
    })
  })

  describe('Error handling', () => {
    it('should handle 404 routes', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404)

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('Route not found'),
      })
    })
  })
})