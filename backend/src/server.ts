import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { config } from '@/config/env';
import { logger } from '@/config/logger';
import { errorHandler, notFoundHandler } from '@/middleware/error';
import { requestLogger } from '@/middleware/logging';

import { healthRouter } from '@/controllers/health';
import { authRouter } from '@/controllers/auth';
import { analyticsRouter } from '@/controllers/analytics';

/**
 * Create and configure Express application
 */
function createApp(): express.Application {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: config.cors.origin,
    credentials: true
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', limiter);

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Logging
  app.use(requestLogger);

  // Health check (no auth required)
  app.use('/health', healthRouter);

  // API routes
  app.use('/api/auth', authRouter);
  app.use('/api/analytics', analyticsRouter);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}

/**
 * Start the server
 */
async function startServer(): Promise<void> {
  try {
    const app = createApp();
    const server = createServer(app);
    
    // Initialize Socket.IO
    const io = new Server(server, {
      cors: {
        origin: config.cors.origin,
        methods: ['GET', 'POST']
      }
    });

    // Socket.IO connection handling
    io.on('connection', (socket) => {
      logger.info('WebSocket client connected', { socketId: socket.id });
      
      socket.on('disconnect', () => {
        logger.info('WebSocket client disconnected', { socketId: socket.id });
      });
    });

    // Start server
    server.listen(config.port, () => {
      logger.info(`Analytics Platform Backend started`, {
        port: config.port,
        environment: config.nodeEnv,
        timestamp: new Date().toISOString()
      });
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

export { createApp, startServer };