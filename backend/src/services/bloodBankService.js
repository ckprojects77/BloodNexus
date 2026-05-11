import BloodInventory from '../models/BloodInventory.js'
import BloodRequest from '../models/BloodRequest.js'
import Notification from '../models/Notification.js'
import { REQUEST_STATUS, BLOOD_GROUPS } from '../constants/index.js'
import { getSocketIO } from '../sockets/socketManager.js'
import logger from '../utils/logger.js'

export const getOrCreateInventory = async (bankId) => {
  let inventory = await BloodInventory.findOne({ bloodBank: bankId })
  if (!inventory) {
    inventory = await BloodInventory.create({
      bloodBank: bankId,
      stock: BLOOD_GROUPS.map((bg) => ({ bloodGroup: bg, units: 0 })),
    })
  }
  return inventory
}

export const getInventory = async (bankId) => {
  const inventory = await getOrCreateInventory(bankId)
  await inventory.populate('bloodBank', 'name email phone location')
  return inventory
}

export const updateStock = async (bankId, bloodGroup, units, operation = 'set') => {
  const inventory = await getOrCreateInventory(bankId)

  if (operation === 'set') {
    const item = inventory.stock.find((s) => s.bloodGroup === bloodGroup)
    if (item) {
      item.units = Math.max(0, units)
      item.lastUpdated = new Date()
    } else {
      inventory.stock.push({ bloodGroup, units: Math.max(0, units) })
    }
  } else {
    inventory.adjustStock(bloodGroup, units) // delta
  }

  await inventory.save()

  // Alert if low stock
  const item = inventory.stock.find((s) => s.bloodGroup === bloodGroup)
  if (item && item.units <= item.minThreshold) {
    logger.warn(`Low stock alert: ${bloodGroup} at ${item.units} units for bank ${bankId}`)
    const io = getSocketIO()
    if (io) {
      io.to(`bank_${bankId}`).emit('notification', {
        type: 'low_stock',
        message: `Low stock: ${bloodGroup} — only ${item.units} units remaining`,
      })
    }
  }

  return inventory
}

export const updateBulkStock = async (bankId, stockUpdates) => {
  const inventory = await getOrCreateInventory(bankId)
  for (const { bloodGroup, units } of stockUpdates) {
    const item = inventory.stock.find((s) => s.bloodGroup === bloodGroup)
    if (item) {
      item.units = Math.max(0, units)
      item.lastUpdated = new Date()
    } else {
      inventory.stock.push({ bloodGroup, units: Math.max(0, units) })
    }
  }
  await inventory.save()
  return inventory
}

export const getBankRequests = async (bankId, query = {}) => {
  const { page = 1, limit = 20, status } = query
  const filter = { assignedBloodBank: bankId }
  if (status) filter.status = status

  const [requests, total] = await Promise.all([
    BloodRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('patient', 'name phone'),
    BloodRequest.countDocuments(filter),
  ])
  return { requests, total }
}

export const respondToRequest = async (bankId, requestId, action, note) => {
  const request = await BloodRequest.findById(requestId)
  if (!request) {
    const err = new Error('Request not found')
    err.statusCode = 404
    throw err
  }

  if (action === 'accept') {
    request.status = REQUEST_STATUS.ACCEPTED
    request.assignedBloodBank = bankId
  } else {
    request.status = REQUEST_STATUS.REJECTED
  }

  request.responseHistory.push({ action, by: bankId, note })
  await request.save()

  // Notify patient
  await Notification.create({
    recipient: request.patient,
    type: action === 'accept' ? 'request_accepted' : 'request_rejected',
    title: action === 'accept' ? '✅ Request Accepted' : '❌ Request Rejected',
    message: action === 'accept'
      ? `Your blood request has been accepted by a blood bank`
      : `Your blood request was rejected. Please try another bank.`,
    meta: { requestId: request._id },
  })

  const io = getSocketIO()
  if (io) {
    io.to(`user_${request.patient}`).emit('notification', {
      type: action === 'accept' ? 'request_accepted' : 'request_rejected',
      requestId: request._id,
    })
  }

  return request
}
