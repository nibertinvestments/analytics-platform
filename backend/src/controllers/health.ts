import { Router, Request, Response } from 'express';
import { logger } from '@/config/logger';

const router = Router();

/**
 * Health check endpoint
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env['NODE_ENV'],
      version: process.env['npm_package_version'] || '1.0.0',
      services: {
        database: 'connected', // TODO: Add actual database health check
        redis: 'connected',    // TODO: Add actual Redis health check
      }
    };

    logger.debug('Health check requested', healthData);

    res.json({
      success: true,
      data: healthData,
    });
  } catch (error) {
    logger.error('Health check failed', { error });
    
    res.status(503).json({
      success: false,
      error: 'Service unhealthy',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Liveness probe (for Kubernetes)
 */
router.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'alive' });
});

/**
 * Readiness probe (for Kubernetes)
 */
router.get('/ready', async (_req: Request, res: Response) => {
  // TODO: Add checks for database connection, Redis, etc.
  res.status(200).json({ status: 'ready' });
});

export { router as healthRouter };