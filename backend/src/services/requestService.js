import BloodRequest from '../models/BloodRequest.js'
import User from '../models/User.js'
import Notification from '../models/Notification.js'
import { REQUEST_STATUS, URGENCY, ROLES } from '../constants/index.js'
import { getSocketIO } from '../sockets/socketManager.js'
import logger from '../utils/logger.js'

export const createBloodRequest = async (patientId, data) => {
  const request = await BloodRequest.create({
    patient: patientId,
    ...data,
  })

  await request.populate('patient', 'name phone email bloodType')

  // Find nearby compatible donors
  const donors = await User.find({
    role: ROLES.DONOR,
    bloodType: data.bloodGroup,
    isAvailable: true,
    isSuspended: false,
    isActive: true,
  }).select('_id name email')

  // Notify donors via Socket.IO
  const io = getSocketIO()
  if (io && (data.urgency === URGENCY.CRITICAL || data.urgency === URGENCY.HIGH)) {
    io.to('donors').emit('emergency:new', {
      requestId: request._id,
      bloodGroup: request.bloodGroup,
      hospital: request.hospital,
      urgency: request.urgency,
      units: request.units,
    })

    // Persist notifications
    const notifications = donors.map((d) => ({
      recipient: d._id,
      type: 'emergency_request',
      title: '🚨 Emergency Blood Needed',
      message: `${request.bloodGroup} blood needed at ${request.hospital.name} — ${request.units} unit(s)`,
      meta: { requestId: request._id },
    }))
    if (notifications.length) await Notification.insertMany(notifications)

    // Track who was notified
    request.notifiedDonors = donors.map((d) => d._id)
    await request.save()
  }

  logger.info(`Blood request created: ${request.requestId} urgency=${request.urgency}`)
  return request
}

export const getMyRequests = async (patientId, query = {}) => {
  const { page = 1, limit = 10, status } = query
  const filter = { patient: patientId }
  if (status) filter.status = status

  const [requests, total] = await Promise.all([
    BloodRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('assignedDonor', 'name phone')
      .populate('assignedAmbulance'),
    BloodRequest.countDocuments(filter),
  ])

  return { requests, total, page, limit }
}

export const getRequestById = async (id, userId, role) => {
  const request = await BloodRequest.findById(id)
    .populate('patient', 'name phone email')
    .populate('assignedDonor', 'name phone bloodType')
    .populate('assignedAmbulance')
    .populate('assignedBloodBank', 'name phone')

  if (!request) {
    const err = new Error('Request not found')
    err.statusCode = 404
    throw err
  }

  // Non-admins can only view their own
  if (role !== ROLES.ADMIN && request.patient._id.toString() !== userId.toString()) {
    const err = new Error('Not authorized')
    err.statusCode = 403
    throw err
  }

  return request
}

export const cancelRequest = async (requestId, patientId, cancelReason) => {
  const request = await BloodRequest.findOne({ _id: requestId, patient: patientId })

  if (!request) {
    const err = new Error('Request not found')
    err.statusCode = 404
    throw err
  }

  if ([REQUEST_STATUS.FULFILLED, REQUEST_STATUS.CANCELLED].includes(request.status)) {
    const err = new Error(`Cannot cancel a ${request.status} request`)
    err.statusCode = 400
    throw err
  }

  request.status = REQUEST_STATUS.CANCELLED
  request.cancelReason = cancelReason
  request.responseHistory.push({ action: 'cancelled', by: patientId })
  await request.save()

  return request
}

export const getAllRequests = async (query = {}) => {
  const { page = 1, limit = 20, status, urgency, bloodGroup } = query
  const filter = {}
  if (status) filter.status = status
  if (urgency) filter.urgency = urgency
  if (bloodGroup) filter.bloodGroup = bloodGroup

  const [requests, total] = await Promise.all([
    BloodRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('patient', 'name phone'),
    BloodRequest.countDocuments(filter),
  ])

  return { requests, total, page, limit }
}
