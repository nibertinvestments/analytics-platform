// Test setup file for backend
import { config } from 'dotenv'

// Load test environment variables
config({ path: '.env.test' })

// Mock console.log in tests to reduce noise
const consoleMock = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
}

Object.defineProperty(globalThis, 'console', {
  value: consoleMock,
})

// Set test timeout
jest.setTimeout(30000)

// Setup test database cleanup
beforeEach(() => {
  // Reset mocks
  jest.clearAllMocks()
})

afterEach(() => {
  // Cleanup after each test
  jest.restoreAllMocks()
})