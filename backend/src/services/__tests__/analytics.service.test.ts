jest.mock('../../repositories/analytics.repository', () => ({
  analyticsRepository: {
    findAnalytics: jest.fn(),
  },
}))

import { analyticsService } from '../analytics.service'
import { analyticsRepository } from '../../repositories/analytics.repository'

const findAnalyticsMock = analyticsRepository.findAnalytics as jest.Mock

describe('analyticsService', () => {
  beforeEach(() => {
    findAnalyticsMock.mockReset()
  })

  it('maps repository results into DTOs with timestamps', async () => {
    const now = new Date()
    findAnalyticsMock.mockResolvedValue([
      {
        id: 'abc123',
        metric: 'users',
        value: 100,
        timestamp: now,
        userId: 'user-1',
      },
    ])

    const result = await analyticsService.listAnalytics()

    expect(result.data).toEqual([
      {
        id: 'abc123',
        metric: 'users',
        value: 100,
        timestamp: now.toISOString(),
        userId: 'user-1',
      },
    ])
    expect(result.meta).toEqual({ count: 1 })
  })

  it('forwards query parameters to the repository', async () => {
    findAnalyticsMock.mockResolvedValue([])

    await analyticsService.listAnalytics({
      metric: 'sessions',
      limit: 25,
    })

    expect(findAnalyticsMock).toHaveBeenCalledWith({
      metric: 'sessions',
      limit: 25,
    })
  })
})
