import { prisma } from '../config/prisma'

export interface AnalyticsQuery {
  metric?: string
  limit?: number
  startDate?: Date
  endDate?: Date
  userId?: string
}

export const analyticsRepository = {
  async findAnalytics(query: AnalyticsQuery = {}) {
    const timestampFilter = query.startDate || query.endDate
      ? {
          timestamp: {
            ...(query.startDate ? { gte: query.startDate } : {}),
            ...(query.endDate ? { lte: query.endDate } : {}),
          },
        }
      : {}

    const where = {
      ...(query.metric ? { metric: query.metric } : {}),
      ...(query.userId ? { userId: query.userId } : {}),
      ...timestampFilter,
    }

    const limitCandidate = typeof query.limit === 'number' && Number.isFinite(query.limit)
      ? Math.floor(query.limit)
      : undefined

    const sanitizedLimit = limitCandidate && limitCandidate > 0
      ? Math.min(limitCandidate, 500)
      : 50

    const records = await prisma.userAnalytics.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: sanitizedLimit,
    })

    return records
  },
}
