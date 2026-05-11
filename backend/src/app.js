import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import path from 'path'
import { fileURLToPath } from 'url'

import { globalLimiter } from './middleware/rateLimiter.js'
import errorHandler from './middleware/errorHandler.js'
import logger from './utils/logger.js'

// Routes
import authRoutes from './routes/auth.routes.js'
import requestRoutes from './routes/request.routes.js'
import donorRoutes from './routes/donor.routes.js'
import bloodbankRoutes from './routes/bloodbank.routes.js'
import ambulanceRoutes from './routes/ambulance.routes.js'
import adminRoutes from './routes/admin.routes.js'
import aiRoutes from './routes/ai.routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// ── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// ── Sanitize ─────────────────────────────────────────────────────────────────
app.use(mongoSanitize())

// ── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  }))
}

// ── Rate Limiting ────────────────────────────────────────────────────────────
app.use('/api', globalLimiter)

// ── Static uploads ───────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BloodLink API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/request', requestRoutes)
app.use('/api/donor', donorRoutes)
app.use('/api/bank', bloodbankRoutes)
app.use('/api/ambulance', ambulanceRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/ai', aiRoutes)

// ── 404 Handler ──────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  })
})

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler)

export default app
