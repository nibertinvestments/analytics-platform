import { PrismaClient } from '@prisma/client'

import { environment } from './environment'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: environment.databaseUrl,
    },
  },
  log: environment.nodeEnv === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
})

const shutdownPrisma = async () => {
  await prisma.$disconnect()
}

export { prisma, shutdownPrisma }
