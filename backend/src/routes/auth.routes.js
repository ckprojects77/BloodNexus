import { Router } from 'express'
import {
  register, login, logout, refreshToken,
  forgotPassword, resetPassword, getMe
} from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import {
  registerValidator, loginValidator,
  forgotPasswordValidator, resetPasswordValidator
} from '../validators/auth.validators.js'

const router = Router()

router.post('/register', authLimiter, registerValidator, validate, register)
router.post('/login', authLimiter, loginValidator, validate, login)
router.post('/logout', protect, logout)
router.post('/refresh', refreshToken)
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validate, forgotPassword)
router.post('/reset-password', resetPasswordValidator, validate, resetPassword)
router.get('/me', protect, getMe)

export default router
