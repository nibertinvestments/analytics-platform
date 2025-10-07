import type { Request, Response } from 'express'

import { environment } from '../config/environment'

export const getHealthStatus = (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: environment.serviceName,
    version: environment.version,
  })
}
