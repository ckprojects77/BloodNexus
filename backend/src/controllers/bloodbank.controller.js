import asyncHandler from '../utils/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.js'
import * as bloodBankService from '../services/bloodBankService.js'
import { HTTP } from '../constants/index.js'

export const getInventory = asyncHandler(async (req, res) => {
  const inventory = await bloodBankService.getInventory(req.user.id)
  return successResponse(res, HTTP.OK, 'Inventory fetched', { inventory })
})

export const updateStock = asyncHandler(async (req, res) => {
  const { bloodGroup, units, operation } = req.body
  const inventory = await bloodBankService.updateStock(req.user.id, bloodGroup, units, operation)
  return successResponse(res, HTTP.OK, 'Stock updated', { inventory })
})

export const updateBulkStock = asyncHandler(async (req, res) => {
  const inventory = await bloodBankService.updateBulkStock(req.user.id, req.body.stock)
  return successResponse(res, HTTP.OK, 'Bulk stock updated', { inventory })
})

export const getBankRequests = asyncHandler(async (req, res) => {
  const result = await bloodBankService.getBankRequests(req.user.id, req.query)
  return successResponse(res, HTTP.OK, 'Requests fetched', result)
})

export const respondToRequest = asyncHandler(async (req, res) => {
  const { action, note } = req.body
  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ success: false, message: 'Action must be accept or reject' })
  }
  const request = await bloodBankService.respondToRequest(req.user.id, req.params.id, action, note)
  return successResponse(res, HTTP.OK, `Request ${action}ed`, { request })
})
