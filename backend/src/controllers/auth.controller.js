import asyncHandler from '../utils/asyncHandler.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'
import * as authService from '../services/authService.js'
import { HTTP } from '../constants/index.js'

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
}

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body)
  res.cookie('refreshToken', result.refreshToken, COOKIE_OPTS)
  return successResponse(res, HTTP.CREATED, 'Registration successful', {
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  })
})

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body)
  res.cookie('refreshToken', result.refreshToken, COOKIE_OPTS)
  return successResponse(res, HTTP.OK, 'Login successful', {
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  })
})

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user.id)
  res.clearCookie('refreshToken')
  return successResponse(res, HTTP.OK, 'Logged out successfully')
})

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || req.cookies.refreshToken
  if (!token) return errorResponse(res, HTTP.UNAUTHORIZED, 'Refresh token required')

  const tokens = await authService.refreshTokens(token)
  res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTS)
  return successResponse(res, HTTP.OK, 'Tokens refreshed', tokens)
})

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email)
  // Always success to prevent email enumeration
  return successResponse(res, HTTP.OK, 'If that email exists, a reset link has been sent')
})

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password)
  return successResponse(res, HTTP.OK, 'Password reset successfully')
})

export const getMe = asyncHandler(async (req, res) => {
  return successResponse(res, HTTP.OK, 'Profile fetched', { user: req.user })
})
