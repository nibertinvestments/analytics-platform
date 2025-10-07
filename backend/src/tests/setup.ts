/**
 * Test setup file for Jest
 */

// Set test environment variables BEFORE any imports
process.env['NODE_ENV'] = 'test';
process.env['PORT'] = '3001';
process.env['JWT_SECRET'] = 'test-secret-key-for-jest-minimum-32-characters';
process.env['DATABASE_URL'] = 'postgresql://test:test@localhost:5432/test_db';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['LOG_LEVEL'] = 'error';
process.env['CORS_ORIGIN'] = 'http://localhost:3000';
process.env['JWT_EXPIRE'] = '24h';

// Global test timeout
jest.setTimeout(10000);

// Mock console methods in tests to keep output clean
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};