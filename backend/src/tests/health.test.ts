import request from 'supertest';
import { createApp } from '../server';

describe('Health Endpoints', () => {
  const app = createApp();

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          status: 'healthy',
          timestamp: expect.any(String),
          uptime: expect.any(Number),
          version: expect.any(String),
          services: expect.objectContaining({
            database: expect.any(String),
            redis: expect.any(String),
          }),
        }),
      });
    });
  });

  describe('GET /health/live', () => {
    it('should return liveness status', async () => {
      const response = await request(app)
        .get('/health/live')
        .expect(200);

      expect(response.body).toEqual({
        status: 'alive',
      });
    });
  });

  describe('GET /health/ready', () => {
    it('should return readiness status', async () => {
      const response = await request(app)
        .get('/health/ready')
        .expect(200);

      expect(response.body).toEqual({
        status: 'ready',
      });
    });
  });
});