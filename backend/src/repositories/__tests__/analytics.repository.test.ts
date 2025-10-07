jest.mock('../../config/prisma', () => ({
  prisma: {
    userAnalytics: {
      findMany: jest.fn(),
    },
  },
  shutdownPrisma: jest.fn(),
}))

import { analyticsRepository } from '../analytics.repository'
import { prisma } from '../../config/prisma'

const findManyMock = prisma.userAnalytics.findMany as jest.Mock

describe('analyticsRepository', () => {
  beforeEach(() => {
    findManyMock.mockReset()
  })

  it('applies metric and date filters when provided', async () => {
    const now = new Date()
    findManyMock.mockResolvedValue([])

    await analyticsRepository.findAnalytics({
      metric: 'sessions',
      limit: 10,
      startDate: new Date(now.getTime() - 1000),
      endDate: now,
      userId: 'user-123',
    })

    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          metric: 'sessions',
          userId: 'user-123',
          timestamp: expect.objectContaining({
            gte: expect.any(Date),
            lte: expect.any(Date),
          }),
        },
        take: 10,
      }),
    )
  })

  it('defaults to limit of 50 when limit not provided', async () => {
    findManyMock.mockResolvedValue([])

    await analyticsRepository.findAnalytics({})

    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 50,
      }),
    )
  })

  it('caps limit at 500 to avoid excessive payloads', async () => {
    findManyMock.mockResolvedValue([])

    await analyticsRepository.findAnalytics({ limit: 1000 })

    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 500,
      }),
    )
  })
})
