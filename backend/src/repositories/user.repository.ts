import type { Prisma } from '@prisma/client'

import { prisma } from '../config/prisma'

export interface CreateUserInput {
  email: string
  passwordHash: string
  name?: string | null
  role?: UserRole
}

export interface UpdateUserInput {
  name?: string | null
  role?: UserRole
}

type UserEntity = Awaited<ReturnType<typeof prisma.user.create>>
type UserRole = UserEntity['role']

export const userRepository = {
  async createUser(data: CreateUserInput): Promise<UserEntity> {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name ?? null,
        role: data.role ?? 'USER',
      },
    })
  },

  async findByEmail(email: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({
      where: { email },
    })
  },

  async findById(id: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({
      where: { id },
    })
  },

  async updateUser(id: string, data: UpdateUserInput): Promise<UserEntity> {
    return prisma.user.update({
      where: { id },
      data,
    })
  },

  async deleteUser(id: string): Promise<UserEntity> {
    return prisma.user.delete({
      where: { id },
    })
  },

  async withTransaction<T>(handler: (tx: Prisma.TransactionClient) => Promise<T>) {
    return prisma.$transaction((tx: Prisma.TransactionClient) => handler(tx))
  },
}
