import type { Prisma } from '@prisma/client'

import { prisma } from '../config/prisma'

export interface CreateSessionInput {
  userId: string
  token: string
  expiresAt: Date
}

export const sessionRepository = {
  async createSession(data: CreateSessionInput) {
    return prisma.session.create({
      data: {
        userId: data.userId,
        token: data.token,
        expiresAt: data.expiresAt,
      },
    })
  },

  async findByToken(token: string) {
    return prisma.session.findUnique({
      where: { token },
    })
  },

  async deleteByToken(token: string) {
    return prisma.session.delete({
      where: { token },
    })
  },

  async deleteByUserId(userId: string) {
    return prisma.session.deleteMany({
      where: { userId },
    })
  },

  async deleteExpired(now = new Date()) {
    return prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    })
  },

  async withTransaction<T>(handler: (tx: Prisma.TransactionClient) => Promise<T>) {
    return prisma.$transaction((tx: Prisma.TransactionClient) => handler(tx))
  },
}
