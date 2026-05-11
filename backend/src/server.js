import 'dotenv/config'
import http from 'http'
import app from './app.js'
import connectDB from './config/db.js'
import { initSocket } from './sockets/socketManager.js'
import logger from './utils/logger.js'

const PORT = process.env.PORT || 5000

const startServer = async () => {
  // 1. Connect to MongoDB
  await connectDB()

  // 2. Create HTTP server from Express app
  const httpServer = http.createServer(app)

  // 3. Attach Socket.IO
  initSocket(httpServer)

  // 4. Start listening
  httpServer.listen(PORT, () => {
    logger.info(`
╔══════════════════════════════════════════════╗
║   🩸 BloodLink Backend API                   ║
║   Port     : ${PORT}                             ║
║   Env      : ${process.env.NODE_ENV || 'development'}                   ║
║   DB       : Connected                       ║
║   Sockets  : Active                          ║
╚══════════════════════════════════════════════╝
    `)
  })

  // ── Graceful Shutdown ──────────────────────────────────────────────────
  const shutdown = (signal) => {
    logger.info(`${signal} received — shutting down gracefully`)
    httpServer.close(() => {
      logger.info('HTTP server closed')
      process.exit(0)
    })
    setTimeout(() => process.exit(1), 10000)
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}\nReason: ${reason}`)
  })

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`)
    process.exit(1)
  })
}

startServer()
