import BloodRequest from '../models/BloodRequest.js'
import Notification from '../models/Notification.js'
import { REQUEST_STATUS } from '../constants/index.js'
import logger from '../utils/logger.js'

/**
 * Auto-expire stale pending requests older than 48 hours
 */
export const expireStaleRequests = async () => {
  try {
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000)
    const result = await BloodRequest.updateMany(
      {
        status: REQUEST_STATUS.PENDING,
        createdAt: { $lt: cutoff },
      },
      {
        $set: { status: REQUEST_STATUS.CANCELLED, cancelReason: 'Auto-expired after 48 hours' },
      }
    )
    if (result.modifiedCount > 0) {
      logger.info(`Expired ${result.modifiedCount} stale blood requests`)
    }
  } catch (err) {
    logger.error(`expireStaleRequests job failed: ${err.message}`)
  }
}

/**
 * Delete read notifications older than 30 days
 */
export const cleanOldNotifications = async () => {
  try {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const result = await Notification.deleteMany({
      isRead: true,
      createdAt: { $lt: cutoff },
    })
    if (result.deletedCount > 0) {
      logger.info(`Deleted ${result.deletedCount} old notifications`)
    }
  } catch (err) {
    logger.error(`cleanOldNotifications job failed: ${err.message}`)
  }
}

/**
 * Start all background jobs using setInterval
 * (For production, replace with node-cron or BullMQ)
 */
export const startJobs = () => {
  // Run every hour
  setInterval(expireStaleRequests, 60 * 60 * 1000)
  // Run every 24 hours
  setInterval(cleanOldNotifications, 24 * 60 * 60 * 1000)
  logger.info('Background jobs started')
}
