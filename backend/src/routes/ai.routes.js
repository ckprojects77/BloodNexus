import { Router } from 'express'
import { chat } from '../controllers/ai.controller.js'
import { protect } from '../middleware/auth.js'
import { globalLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.post('/chat', protect, globalLimiter, chat)

export default router
