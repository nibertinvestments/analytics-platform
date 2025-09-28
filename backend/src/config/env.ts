import { z } from 'zod';

/**
 * Environment configuration schema
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.string().default('3001').transform(Number),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRE: z.string().default('24h'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

/**
 * Parse and validate environment variables
 */
function parseEnv() {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    if (process.env['NODE_ENV'] === 'test') {
      // In test environment, throw an error instead of exiting
      throw new Error(`Invalid environment configuration: ${JSON.stringify(result.error.format())}`);
    }
    
    console.error('Invalid environment configuration:', result.error.format());
    process.exit(1);
  }
  
  return result.data;
}

const env = parseEnv();

/**
 * Application configuration
 */
export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  database: {
    url: env.DATABASE_URL,
  },
  redis: {
    url: env.REDIS_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expire: env.JWT_EXPIRE,
  },
  cors: {
    origin: env.CORS_ORIGIN,
  },
  logging: {
    level: env.LOG_LEVEL,
  },
} as const;

export type Config = typeof config;