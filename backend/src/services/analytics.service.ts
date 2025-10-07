import type { AnalyticsQuery } from '../repositories/analytics.repository'
import { analyticsRepository } from '../repositories/analytics.repository'

export interface AnalyticsDataPoint {
  id: string
  metric: string
  value: number
  timestamp: string
  userId?: string
}

export interface AnalyticsMeta {
  count: number
}

type AnalyticsRecord = Awaited<ReturnType<typeof analyticsRepository.findAnalytics>>[number]

const mapAnalyticsRecord = (record: AnalyticsRecord): AnalyticsDataPoint => ({
  id: record.id,
  metric: record.metric,
  value: record.value,
  timestamp: record.timestamp.toISOString(),
  userId: record.userId,
})

export const analyticsService = {
  async listAnalytics(query: AnalyticsQuery = {}): Promise<{
    data: AnalyticsDataPoint[]
    meta: AnalyticsMeta
  }> {
    const records = await analyticsRepository.findAnalytics(query)

    return {
      data: records.map(mapAnalyticsRecord),
      meta: {
        count: records.length,
      },
    }
  },
}
