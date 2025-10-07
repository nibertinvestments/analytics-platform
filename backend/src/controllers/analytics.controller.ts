import type { NextFunction, Request, Response } from 'express'

import { analyticsService } from '../services/analytics.service'

const parseLimit = (value: unknown): number | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

const parseDate = (value: unknown): Date | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export const listAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await analyticsService.listAnalytics({
      metric: typeof req.query.metric === 'string' ? req.query.metric : undefined,
      limit: parseLimit(req.query.limit),
      startDate: parseDate(req.query.start),
      endDate: parseDate(req.query.end),
    })

    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
    })
  } catch (error) {
    next(error)
  }
}
