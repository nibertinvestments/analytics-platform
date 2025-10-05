import { config } from '../config/env';

describe('Environment Configuration', () => {
  it('should load configuration from environment variables', () => {
    expect(config).toBeDefined();
    expect(config.nodeEnv).toBe('test');
    expect(config.port).toBe(3001);
    expect(config.jwt.secret).toBe('test-secret-key-for-jest-minimum-32-characters');
    expect(config.database.url).toBe('postgresql://test:test@localhost:5432/test_db');
    expect(config.redis.url).toBe('redis://localhost:6379');
  });

  it('should have correct structure', () => {
    expect(config).toMatchObject({
      nodeEnv: expect.any(String),
      port: expect.any(Number),
      database: {
        url: expect.any(String),
      },
      redis: {
        url: expect.any(String),
      },
      jwt: {
        secret: expect.any(String),
        expire: expect.any(String),
      },
      cors: {
        origin: expect.any(String),
      },
      logging: {
        level: expect.any(String),
      },
    });
  });
});