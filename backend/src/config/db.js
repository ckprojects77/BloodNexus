import mongoose from 'mongoose'
import logger from '../utils/logger.js'

const connectDB = async () => {
  const uri = process.env.MONGO_URI

  if (!uri) {
    logger.error('MONGO_URI not defined in environment variables')
    process.exit(1)
  }

  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    logger.info(`MongoDB connected: ${conn.connection.host}`)

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting reconnect...')
    })

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB error: ${err.message}`)
    })
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`)
    process.exit(1)
  }
}

export default connectDB
