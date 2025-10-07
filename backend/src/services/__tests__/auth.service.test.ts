import crypto from 'node:crypto'

type UserRole = 'ADMIN' | 'USER'

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}))

jest.mock('../../repositories/user.repository', () => ({
  userRepository: {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    findById: jest.fn(),
  },
}))

jest.mock('../../repositories/session.repository', () => ({
  sessionRepository: {
    createSession: jest.fn(),
    findByToken: jest.fn(),
    deleteByToken: jest.fn(),
    deleteByUserId: jest.fn(),
    deleteExpired: jest.fn(),
  },
}))

jest.mock('node:crypto', () => {
  const actual = jest.requireActual('node:crypto')
  return {
    ...actual,
    randomBytes: jest.fn(() => Buffer.from('refresh-token-value', 'utf-8')),
  }
})

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { authService, AuthError } from '../auth.service'
import { environment } from '../../config/environment'
import { sessionRepository } from '../../repositories/session.repository'
import { userRepository } from '../../repositories/user.repository'

const mockedBcryptHash = bcrypt.hash as unknown as jest.Mock
const mockedBcryptCompare = bcrypt.compare as unknown as jest.Mock
const mockedJwtSign = jwt.sign as unknown as jest.Mock
const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>
const mockedSessionRepository = sessionRepository as jest.Mocked<typeof sessionRepository>

const sampleUser: {
  id: string
  email: string
  passwordHash: string
  name: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
} = {
  id: 'user-1',
  email: 'user@example.com',
  passwordHash: 'stored-hash',
  name: 'Jane Doe',
  role: 'USER' as UserRole,
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  updatedAt: new Date('2025-01-02T00:00:00.000Z'),
}

const rawRefreshToken = Buffer.from('refresh-token-value', 'utf-8').toString('hex')
const hashedRefreshToken = crypto.createHash('sha256').update(rawRefreshToken).digest('hex')

const sampleSession = {
  id: 'session-1',
  userId: sampleUser.id,
  token: hashedRefreshToken,
  expiresAt: new Date(Date.now() + 60_000),
  createdAt: new Date(),
}

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedJwtSign.mockReturnValue('signed-token')
    mockedBcryptHash.mockResolvedValue('hashed-password')
    mockedBcryptCompare.mockResolvedValue(true)
  })

  describe('register', () => {
    it('hashes password, creates a user, and returns tokens', async () => {
  mockedUserRepository.findByEmail.mockResolvedValue(null)
  mockedUserRepository.createUser.mockResolvedValue(sampleUser)
  mockedSessionRepository.createSession.mockResolvedValue(sampleSession)

      const result = await authService.register({
        email: 'user@example.com',
        password: 'Secret123',
        name: 'Jane Doe',
      })

      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith('user@example.com')
  expect(mockedBcryptHash).toHaveBeenCalledWith('Secret123', environment.auth.bcryptSaltRounds)
      expect(mockedUserRepository.createUser).toHaveBeenCalledWith({
        email: 'user@example.com',
        passwordHash: 'hashed-password',
        name: 'Jane Doe',
      })

      expect(mockedSessionRepository.createSession).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: sampleUser.id,
          token: hashedRefreshToken,
        })
      )

      expect(result.tokens.accessToken).toBe('signed-token')
  expect(result.tokens.refreshToken).toBe(rawRefreshToken)
      expect(result.user).toMatchObject({
        id: sampleUser.id,
        email: sampleUser.email,
        name: sampleUser.name,
      })
    })

    it('throws an AuthError when email is already registered', async () => {
      mockedUserRepository.findByEmail.mockResolvedValue(sampleUser)

      await expect(
        authService.register({
          email: 'user@example.com',
          password: 'Secret123',
        })
      ).rejects.toMatchObject({
        code: 'EMAIL_IN_USE',
      })
    })
  })

  describe('login', () => {
    it('validates credentials and returns tokens', async () => {
  mockedUserRepository.findByEmail.mockResolvedValue(sampleUser)
  mockedSessionRepository.createSession.mockResolvedValue(sampleSession)

      const result = await authService.login({
        email: 'user@example.com',
        password: 'Secret123',
      })

  expect(mockedBcryptCompare).toHaveBeenCalledWith('Secret123', 'stored-hash')
      expect(result.tokens.accessToken).toBe('signed-token')
    })

    it('throws AuthError for invalid credentials', async () => {
      mockedUserRepository.findByEmail.mockResolvedValue(sampleUser)
  mockedBcryptCompare.mockResolvedValue(false)

      await expect(
        authService.login({
          email: 'user@example.com',
          password: 'WrongPass1',
        })
      ).rejects.toBeInstanceOf(AuthError)
    })
  })

  describe('refresh', () => {
    it('rotates refresh tokens and returns a new pair', async () => {
      mockedSessionRepository.findByToken.mockResolvedValue(sampleSession)
      mockedSessionRepository.deleteByToken.mockResolvedValue(sampleSession)
      mockedSessionRepository.createSession.mockResolvedValue(sampleSession)
      mockedUserRepository.findById.mockResolvedValue(sampleUser)

  const result = await authService.refresh({ refreshToken: rawRefreshToken })

      expect(mockedSessionRepository.deleteByToken).toHaveBeenCalledWith(sampleSession.token)
  expect(result.tokens.refreshToken).toBe(rawRefreshToken)
    })

    it('throws when session not found', async () => {
      mockedSessionRepository.findByToken.mockResolvedValue(null)

      await expect(authService.refresh({ refreshToken: 'invalid' })).rejects.toMatchObject({
        code: 'SESSION_NOT_FOUND',
      })
    })
  })

  describe('logout', () => {
    it('deletes session by hashed token', async () => {
      mockedSessionRepository.deleteByToken.mockResolvedValue(sampleSession)

  await authService.logout(rawRefreshToken)

      expect(mockedSessionRepository.deleteByToken).toHaveBeenCalledWith(hashedRefreshToken)
    })
  })
})
