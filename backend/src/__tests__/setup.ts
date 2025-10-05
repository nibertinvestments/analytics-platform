// Test setup file for backend
import { config } from 'dotenv'

// Load test environment variables
config({ path: '.env.test' })

// Mock console.log in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
}

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