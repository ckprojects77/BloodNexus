import asyncHandler from '../utils/asyncHandler.js'
import { successResponse, paginatedResponse } from '../utils/apiResponse.js'
import * as adminService from '../services/adminService.js'
import { HTTP } from '../constants/index.js'

export const getAllUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getAllUsers(req.query)
  return paginatedResponse(res, result.users, result.total, result.page, result.limit)
})

export const suspendUser = asyncHandler(async (req, res) => {
  const user = await adminService.suspendUser(req.params.id, true)
  return successResponse(res, HTTP.OK, 'User suspended', { user })
})

export const unsuspendUser = asyncHandler(async (req, res) => {
  const user = await adminService.suspendUser(req.params.id, false)
  return successResponse(res, HTTP.OK, 'User reinstated', { user })
})

export const deleteUser = asyncHandler(async (req, res) => {
  await adminService.deleteUser(req.params.id)
  return successResponse(res, HTTP.OK, 'User deleted')
})

export const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await adminService.getAnalytics()
  return successResponse(res, HTTP.OK, 'Analytics fetched', { analytics })
})
