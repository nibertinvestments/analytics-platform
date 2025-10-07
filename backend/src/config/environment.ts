import { config } from 'dotenv'

config()

type NodeEnvironment = 'development' | 'test' | 'production'

const parsePort = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

const parseNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

export const environment = {
  nodeEnv: (process.env['NODE_ENV'] ?? 'development') as NodeEnvironment,
  port: parsePort(process.env['PORT'], 3001),
  serviceName: process.env['SERVICE_NAME'] ?? 'analytics-backend',
  version: process.env['npm_package_version'] ?? '0.1.0',
  databaseUrl: process.env['DATABASE_URL'] ?? 'postgresql://postgres:postgres@localhost:5432/analytics_platform?schema=public',
  auth: {
    jwtSecret: process.env['JWT_SECRET'] ?? 'development-jwt-secret',
    jwtExpiresIn: process.env['JWT_EXPIRES_IN'] ?? '1h',
    refreshSecret: process.env['JWT_REFRESH_SECRET'] ?? 'development-refresh-secret',
    refreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] ?? '7d',
    bcryptSaltRounds: parseNumber(process.env['BCRYPT_SALT_ROUNDS'], 12),
  },
}
