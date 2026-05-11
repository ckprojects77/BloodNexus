import asyncHandler from '../utils/asyncHandler.js'
import { successResponse, paginatedResponse } from '../utils/apiResponse.js'
import * as ambulanceService from '../services/ambulanceService.js'
import { HTTP } from '../constants/index.js'

export const createAmbulanceRequest = asyncHandler(async (req, res) => {
  const request = await ambulanceService.createAmbulanceRequest(req.user.id, req.body)
  return successResponse(res, HTTP.CREATED, 'Ambulance request created', { request })
})

export const updateStatus = asyncHandler(async (req, res) => {
  const request = await ambulanceService.updateAmbulanceStatus(
    req.params.id,
    req.body.status,
    req.user.id,
    req.body.note
  )
  return successResponse(res, HTTP.OK, 'Status updated', { request })
})

export const getAllRequests = asyncHandler(async (req, res) => {
  const result = await ambulanceService.getAllAmbulanceRequests(req.query)
  return paginatedResponse(res, result.requests, result.total, req.query.page, req.query.limit || 20)
})

export const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await ambulanceService.getMyAmbulanceRequests(req.user.id)
  return successResponse(res, HTTP.OK, 'Requests fetched', { requests })
})
