import request from 'supertest'

jest.mock('../services/auth.service', () => {
  const actual = jest.requireActual('../services/auth.service')
  return {
    ...actual,
    authService: {
      register: jest.fn(),
      login: jest.fn(),
      refresh: jest.fn(),
      logout: jest.fn(),
    },
  }
})

import app from '../app'
import { AuthError, authService } from '../services/auth.service'

type MockedAuthService = jest.Mocked<typeof authService>

const mockedAuthService = authService as MockedAuthService

const sampleUser = {
  id: 'user-1',
  email: 'user@example.com',
  name: 'Jane Doe',
  role: 'USER' as const,
  createdAt: new Date('2025-01-01T00:00:00.000Z').toISOString(),
  updatedAt: new Date('2025-01-02T00:00:00.000Z').toISOString(),
}

const sampleTokens = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  expiresIn: '1h',
  refreshExpiresAt: new Date(Date.now() + 3_600_000).toISOString(),
}

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/auth/register', () => {
    it('returns 201 with user and tokens', async () => {
      mockedAuthService.register.mockResolvedValue({
        user: sampleUser,
        tokens: sampleTokens,
      })

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user@example.com',
          password: 'Secret123',
          name: 'Jane Doe',
        })
        .expect(201)

      expect(response.body).toMatchObject({
        success: true,
        data: sampleUser,
        tokens: sampleTokens,
      })
    })

    it('returns 422 when validation fails', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'invalid-email', password: 'short' })
        .expect(422)

      expect(response.body).toMatchObject({
        success: false,
        errors: expect.any(Array),
      })
    })

    it('translates AuthError to 409 status', async () => {
      mockedAuthService.register.mockRejectedValue(new AuthError('EMAIL_IN_USE', 'Email already registered'))

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user@example.com',
          password: 'Secret123',
        })
        .expect(409)

      expect(response.body).toMatchObject({
        success: false,
        code: 'EMAIL_IN_USE',
      })
    })
  })

  describe('POST /api/auth/login', () => {
    it('returns tokens on successful login', async () => {
      mockedAuthService.login.mockResolvedValue({
        user: sampleUser,
        tokens: sampleTokens,
      })

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'Secret123' })
        .expect(200)

      expect(response.body).toMatchObject({ success: true, tokens: sampleTokens })
    })

    it('returns 401 for invalid credentials', async () => {
      mockedAuthService.login.mockRejectedValue(new AuthError('INVALID_CREDENTIALS', 'Invalid email or password'))

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'WrongPass1' })
        .expect(401)

      expect(response.body).toMatchObject({ success: false, code: 'INVALID_CREDENTIALS' })
    })
  })

  describe('POST /api/auth/refresh', () => {
    it('returns refreshed tokens', async () => {
      mockedAuthService.refresh.mockResolvedValue({
        user: sampleUser,
        tokens: sampleTokens,
      })

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'refresh-token' })
        .expect(200)

      expect(response.body).toMatchObject({ success: true, tokens: sampleTokens })
    })

    it('returns 401 when refresh token invalid', async () => {
      mockedAuthService.refresh.mockRejectedValue(new AuthError('SESSION_NOT_FOUND', 'Session not found'))

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401)

      expect(response.body).toMatchObject({ success: false, code: 'SESSION_NOT_FOUND' })
    })
  })

  describe('POST /api/auth/logout', () => {
    it('returns 400 if refresh token missing', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({})
        .expect(400)

      expect(response.body).toMatchObject({ success: false })
    })

    it('invokes logout and returns 204', async () => {
      mockedAuthService.logout.mockResolvedValue()

      await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken: 'refresh-token' })
        .expect(204)

      expect(mockedAuthService.logout).toHaveBeenCalledWith('refresh-token')
    })
  })
})
