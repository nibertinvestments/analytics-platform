import app from './app'
import { environment } from './config/environment'
import { shutdownPrisma } from './config/prisma'

const server = app.listen(environment.port, () => {
  console.log(`🚀 Server running on port ${environment.port}`)
  console.log(`📊 Health check: http://localhost:${environment.port}/health`)
})

const shutdown = async (signal: NodeJS.Signals) => {
  console.log(`${signal} signal received: closing HTTP server`)
  await new Promise<void>((resolve) => {
    server.close(() => {
      console.log('HTTP server closed')
      resolve()
    })
  })

  try {
    await shutdownPrisma()
    console.log('Prisma client disconnected')
  } catch (error) {
    console.error('Error disconnecting Prisma client', error)
  }

  process.exit(0)
}

process.on('SIGTERM', (signal) => {
  shutdown(signal).catch((error) => {
    console.error('Error during SIGTERM shutdown', error)
    process.exit(1)
  })
})

process.on('SIGINT', (signal) => {
  shutdown(signal).catch((error) => {
    console.error('Error during SIGINT shutdown', error)
    process.exit(1)
  })
})

export default app