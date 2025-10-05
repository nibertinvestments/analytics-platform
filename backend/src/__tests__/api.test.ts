import request from 'supertest'
import express from 'express'

// Create a basic Express app for testing
const createTestApp = () => {
  const app = express()
  
  app.use(express.json())
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'analytics-backend'
    })
  })
  
  // Basic API endpoint
  app.get('/api/analytics', (req, res) => {
    res.status(200).json({
      success: true,
      data: [
        { id: 1, metric: 'users', value: 100 },
        { id: 2, metric: 'sessions', value: 250 }
      ]
    })
  })
  
  return app
}

describe('Backend API', () => {
  let app: express.Application

  beforeAll(() => {
    app = createTestApp()
  })

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200)

      expect(response.body).toMatchObject({
        status: 'ok',
        service: 'analytics-backend'
      })
      expect(response.body.timestamp).toBeDefined()
    })
  })

  describe('GET /api/analytics', () => {
    it('should return analytics data', async () => {
      const response = await request(app)
        .get('/api/analytics')
        .expect(200)

      expect(response.body).toMatchObject({
        success: true,
        data: expect.any(Array)
      })

      expect(response.body.data).toHaveLength(2)
      expect(response.body.data[0]).toMatchObject({
        id: expect.any(Number),
        metric: expect.any(String),
        value: expect.any(Number)
      })
    })
  })

  describe('Error handling', () => {
    it('should handle 404 routes', async () => {
      await request(app)
        .get('/nonexistent')
        .expect(404)
    })
  })
})