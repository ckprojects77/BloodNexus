import { Server } from 'socket.io'
import { verifyAccessToken } from '../utils/jwtHelper.js'
import User from '../models/User.js'
import { SOCKET_EVENTS, ROLES } from '../constants/index.js'
import logger from '../utils/logger.js'

let io = null

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
  })

  // ── Auth Middleware ──────────────────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '')

      if (!token) return next(new Error('Authentication required'))

      const decoded = verifyAccessToken(token)
      const user = await User.findById(decoded.id).select('name role isActive isSuspended')

      if (!user || user.isSuspended || !user.isActive) {
        return next(new Error('Unauthorized'))
      }

      socket.user = user
      next()
    } catch (err) {
      next(new Error('Invalid token'))
    }
  })

  // ── Connection Handler ───────────────────────────────────────────────────
  io.on('connection', (socket) => {
    const { user } = socket
    logger.info(`Socket connected: ${user.name} (${user.role}) — ${socket.id}`)

    // Join personal room
    socket.join(`user_${user._id}`)

    // Join role-based rooms
    socket.join(user.role)
    if (user.role === ROLES.DONOR) socket.join('donors')
    if (user.role === ROLES.AMBULANCE) socket.join('ambulance')
    if (user.role === ROLES.ADMIN) socket.join('admin')

    // Custom room join
    socket.on(SOCKET_EVENTS.JOIN_ROOM, (room) => {
      socket.join(room)
      logger.debug(`${user.name} joined room: ${room}`)
    })

    // ── Ambulance live location update ─────────────────────────────────
    socket.on('ambulance:location', (data) => {
      io.to('admin').emit('ambulance:location', {
        userId: user._id,
        ...data,
      })
    })

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${user.name} — ${reason}`)
    })

    socket.on('error', (err) => {
      logger.error(`Socket error (${user.name}): ${err.message}`)
    })
  })

  logger.info('Socket.IO initialized')
  return io
}

export const getSocketIO = () => {
  if (!io) logger.warn('Socket.IO not initialized yet')
  return io
}

/**
 * Broadcast emergency to all donors
 */
export const broadcastEmergency = (requestData) => {
  if (!io) return
  io.to('donors').emit(SOCKET_EVENTS.EMERGENCY_NEW, requestData)
  io.to('ambulance').emit(SOCKET_EVENTS.EMERGENCY_NEW, requestData)
  io.to('admin').emit(SOCKET_EVENTS.EMERGENCY_NEW, requestData)
}

/**
 * Notify a specific user
 */
export const notifyUser = (userId, event, data) => {
  if (!io) return
  io.to(`user_${userId}`).emit(event, data)
}
