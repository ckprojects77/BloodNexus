import asyncHandler from '../utils/asyncHandler.js'
import { successResponse, paginatedResponse } from '../utils/apiResponse.js'
import * as donorService from '../services/donorService.js'
import { HTTP } from '../constants/index.js'

export const getNearbyDonors = asyncHandler(async (req, res) => {
  const result = await donorService.getNearbyDonors(req.query)
  return paginatedResponse(res, result.donors, result.total, result.page, result.limit)
})

export const toggleAvailability = asyncHandler(async (req, res) => {
  const donor = await donorService.toggleAvailability(req.user.id, req.body.available)
  return successResponse(res, HTTP.OK, `Availability set to ${donor.isAvailable}`, { donor })
})

export const getDonorProfile = asyncHandler(async (req, res) => {
  const donor = await donorService.getDonorProfile(req.user.id)
  return successResponse(res, HTTP.OK, 'Profile fetched', { donor })
})

export const updateDonorProfile = asyncHandler(async (req, res) => {
  const donor = await donorService.updateDonorProfile(req.user.id, req.body)
  return successResponse(res, HTTP.OK, 'Profile updated', { donor })
})

export const getDonationHistory = asyncHandler(async (req, res) => {
  const result = await donorService.getDonationHistory(req.user.id, req.query)
  return paginatedResponse(res, result.history, result.total, result.page, result.limit)
})

export const getNearbyRequests = asyncHandler(async (req, res) => {
  const requests = await donorService.getNearbyRequests(req.user.id)
  return successResponse(res, HTTP.OK, 'Nearby requests fetched', { requests })
})
