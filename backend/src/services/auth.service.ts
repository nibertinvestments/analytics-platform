import crypto from 'node:crypto'

import bcrypt from 'bcrypt'
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken'

import { environment } from '../config/environment'
import { sessionRepository } from '../repositories/session.repository'
import { userRepository } from '../repositories/user.repository'

const DURATION_MULTIPLIERS: Record<string, number> = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
}

const parseDurationToMs = (value: string): number => {
  const trimmed = value.trim()

  if (!Number.isNaN(Number(trimmed))) {
    return Number(trimmed) * 1_000
  }

  const match = trimmed.match(/^(\d+)([smhd])$/i)
  if (!match) {
    return 0
  }

  const amount = Number.parseInt(match[1] ?? '0', 10)
  const unit = (match[2] ?? 's').toLowerCase()
  const multiplier = DURATION_MULTIPLIERS[unit]

  if (!multiplier || Number.isNaN(amount)) {
    return 0
  }

  return amount * multiplier
}

const refreshTtlMs = (() => {
  const parsed = parseDurationToMs(environment.auth.refreshExpiresIn)
  return parsed > 0 ? parsed : 7 * 24 * 60 * 60 * 1_000
})()

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

const generateAccessToken = (user: Awaited<ReturnType<typeof userRepository.createUser>>): string => {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  }

  const secret: Secret = environment.auth.jwtSecret
  const options: SignOptions = {
    expiresIn: environment.auth.jwtExpiresIn as SignOptions['expiresIn'],
  }

  return jwt.sign(payload, secret, options)
}

const generateRefreshToken = async (userId: string) => {
  const rawToken = crypto.randomBytes(48).toString('hex')
  const expiresAt = new Date(Date.now() + refreshTtlMs)
  await sessionRepository.createSession({
    userId,
    token: hashToken(rawToken),
    expiresAt,
  })

  return {
    refreshToken: rawToken,
    refreshExpiresAt: expiresAt,
  }
}

const sanitizeUser = (user: Awaited<ReturnType<typeof userRepository.createUser>>) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
})

export type AuthErrorCode = 'EMAIL_IN_USE' | 'INVALID_CREDENTIALS' | 'SESSION_NOT_FOUND'

export class AuthError extends Error {
  constructor(public readonly code: AuthErrorCode, message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export interface RegisterInput {
  email: string
  password: string
  name?: string | null
}

export interface LoginInput {
  email: string
  password: string
}

export interface RefreshInput {
  refreshToken: string
}

export interface AuthResult {
  user: ReturnType<typeof sanitizeUser>
  tokens: {
    accessToken: string
    refreshToken: string
    expiresIn: string
    refreshExpiresAt: string
  }
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existingUser = await userRepository.findByEmail(input.email)
    if (existingUser) {
      throw new AuthError('EMAIL_IN_USE', 'Email is already registered')
    }

    const passwordHash = await bcrypt.hash(input.password, environment.auth.bcryptSaltRounds)
    const user = await userRepository.createUser({
      email: input.email,
      passwordHash,
      name: input.name ?? null,
    })

    const accessToken = generateAccessToken(user)
    const { refreshToken, refreshExpiresAt } = await generateRefreshToken(user.id)

    return {
      user: sanitizeUser(user),
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: environment.auth.jwtExpiresIn,
        refreshExpiresAt: refreshExpiresAt.toISOString(),
      },
    }
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await userRepository.findByEmail(input.email)

    if (!user) {
      throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password')
    }

    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash)
    if (!isValidPassword) {
      throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password')
    }

    const accessToken = generateAccessToken(user)
    const { refreshToken, refreshExpiresAt } = await generateRefreshToken(user.id)

    return {
      user: sanitizeUser(user),
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: environment.auth.jwtExpiresIn,
        refreshExpiresAt: refreshExpiresAt.toISOString(),
      },
    }
  },

  async refresh(input: RefreshInput): Promise<AuthResult> {
    const hashedToken = hashToken(input.refreshToken)
    const session = await sessionRepository.findByToken(hashedToken)

    if (!session || session.expiresAt < new Date()) {
      throw new AuthError('SESSION_NOT_FOUND', 'Session expired or not found')
    }

    const user = await userRepository.findById(session.userId)
    if (!user) {
      throw new AuthError('SESSION_NOT_FOUND', 'Session expired or not found')
    }

    await sessionRepository.deleteByToken(hashedToken)

    const accessToken = generateAccessToken(user)
    const { refreshToken, refreshExpiresAt } = await generateRefreshToken(user.id)

    return {
      user: sanitizeUser(user),
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: environment.auth.jwtExpiresIn,
        refreshExpiresAt: refreshExpiresAt.toISOString(),
      },
    }
  },

  async logout(refreshToken: string): Promise<void> {
    const hashedToken = hashToken(refreshToken)
    await sessionRepository.deleteByToken(hashedToken)
  },
}
