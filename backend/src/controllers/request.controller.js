import asyncHandler from '../utils/asyncHandler.js'
import { successResponse, paginatedResponse } from '../utils/apiResponse.js'
import * as requestService from '../services/requestService.js'
import { HTTP } from '../constants/index.js'

export const createRequest = asyncHandler(async (req, res) => {
  const request = await requestService.createBloodRequest(req.user.id, req.body)
  return successResponse(res, HTTP.CREATED, 'Blood request created successfully', { request })
})

export const getMyRequests = asyncHandler(async (req, res) => {
  const result = await requestService.getMyRequests(req.user.id, req.query)
  return paginatedResponse(res, result.requests, result.total, result.page, result.limit)
})

export const getRequestById = asyncHandler(async (req, res) => {
  const request = await requestService.getRequestById(req.params.id, req.user.id, req.user.role)
  return successResponse(res, HTTP.OK, 'Request fetched', { request })
})

export const cancelRequest = asyncHandler(async (req, res) => {
  const request = await requestService.cancelRequest(req.params.id, req.user.id, req.body.cancelReason)
  return successResponse(res, HTTP.OK, 'Request cancelled', { request })
})

export const getAllRequests = asyncHandler(async (req, res) => {
  const result = await requestService.getAllRequests(req.query)
  return paginatedResponse(res, result.requests, result.total, result.page, result.limit)
})
