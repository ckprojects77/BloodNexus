import crypto from 'crypto'
import User from '../models/User.js'
import { generateTokenPair, verifyRefreshToken } from '../utils/jwtHelper.js'
import { sendWelcomeEmail, sendPasswordResetEmail } from '../utils/emailService.js'
import logger from '../utils/logger.js'

export const registerUser = async (userData) => {
  const existing = await User.findOne({ email: userData.email })
  if (existing) {
    const err = new Error('Email already registered')
    err.statusCode = 409
    throw err
  }

  const user = await User.create(userData)
  const tokens = generateTokenPair({ id: user._id, role: user.role })

  // Save refresh token
  user.refreshToken = tokens.refreshToken
  await user.save({ validateBeforeSave: false })

  // Fire-and-forget welcome email
  sendWelcomeEmail(user.email, user.name).catch((e) =>
    logger.warn(`Welcome email failed: ${e.message}`)
  )

  return { user: user.toPublicProfile(), ...tokens }
}

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password +refreshToken')
  if (!user || !(await user.comparePassword(password))) {
    const err = new Error('Invalid email or password')
    err.statusCode = 401
    throw err
  }

  if (user.isSuspended) {
    const err = new Error('Account suspended. Contact support.')
    err.statusCode = 403
    throw err
  }

  const tokens = generateTokenPair({ id: user._id, role: user.role })
  user.refreshToken = tokens.refreshToken
  await user.save({ validateBeforeSave: false })

  return { user: user.toPublicProfile(), ...tokens }
}

export const refreshTokens = async (token) => {
  let decoded
  try {
    decoded = verifyRefreshToken(token)
  } catch {
    const err = new Error('Invalid refresh token')
    err.statusCode = 401
    throw err
  }

  const user = await User.findById(decoded.id).select('+refreshToken')
  if (!user || user.refreshToken !== token) {
    const err = new Error('Refresh token mismatch')
    err.statusCode = 401
    throw err
  }

  const tokens = generateTokenPair({ id: user._id, role: user.role })
  user.refreshToken = tokens.refreshToken
  await user.save({ validateBeforeSave: false })

  return tokens
}

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email })
  // Always return success to prevent email enumeration
  if (!user) return

  const resetToken = crypto.randomBytes(32).toString('hex')
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000 // 15 min
  await user.save({ validateBeforeSave: false })

  await sendPasswordResetEmail(user.email, resetToken).catch((e) =>
    logger.error(`Reset email failed: ${e.message}`)
  )
}

export const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires')

  if (!user) {
    const err = new Error('Invalid or expired reset token')
    err.statusCode = 400
    throw err
  }

  user.password = newPassword
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()
}

export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null })
}
