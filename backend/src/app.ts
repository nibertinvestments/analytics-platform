import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import type { Request, Response, NextFunction } from 'express'

import { environment } from './config/environment'
import { healthRouter } from './routes/health.routes'
import { analyticsRouter } from './routes/analytics.routes'
import { authRouter } from './routes/auth.routes'

const app = express()

app.set('env', environment.nodeEnv)

// Security middleware
app.use(helmet())
app.use(cors())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})
app.use(limiter)

// General middleware
app.use(compression())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/health', healthRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/auth', authRouter)

// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  })
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.originalUrl}`,
  })
})

export default app
