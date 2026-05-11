import Ambulance from '../models/Ambulance.js'
import AmbulanceRequest from '../models/AmbulanceRequest.js'
import Notification from '../models/Notification.js'
import { AMBULANCE_STATUS } from '../constants/index.js'
import { getSocketIO } from '../sockets/socketManager.js'
import logger from '../utils/logger.js'

export const createAmbulanceRequest = async (userId, data) => {
  // Find available ambulance
  const ambulance = await Ambulance.findOne({
    status: AMBULANCE_STATUS.AVAILABLE,
    isActive: true,
  })

  const request = await AmbulanceRequest.create({
    requestedBy: userId,
    assignedAmbulance: ambulance?._id || null,
    status: ambulance ? AMBULANCE_STATUS.ASSIGNED : AMBULANCE_STATUS.ASSIGNED,
    ...data,
  })

  if (ambulance) {
    ambulance.status = AMBULANCE_STATUS.ASSIGNED
    ambulance.activeRequest = request._id
    await ambulance.save()
    logger.info(`Ambulance ${ambulance.unitId} assigned to request ${request.requestId}`)
  }

  await request.populate('assignedAmbulance')
  await request.populate('requestedBy', 'name phone')

  // Real-time update
  const io = getSocketIO()
  if (io) {
    io.to('ambulance').emit('ambulance:assigned', {
      requestId: request._id,
      ambulanceId: ambulance?._id,
      urgency: request.urgency,
      pickup: request.pickup,
    })

    io.to(`user_${userId}`).emit('ambulance:assigned', {
      requestId: request._id,
      ambulance: ambulance
        ? { unitId: ambulance.unitId, driverName: ambulance.driverName, driverPhone: ambulance.driverPhone }
        : null,
    })
  }

  return request
}

export const updateAmbulanceStatus = async (requestId, status, operatorId, note) => {
  const request = await AmbulanceRequest.findById(requestId)
    .populate('assignedAmbulance')
    .populate('requestedBy', 'name')

  if (!request) {
    const err = new Error('Ambulance request not found')
    err.statusCode = 404
    throw err
  }

  request.status = status
  request.statusHistory.push({ status, note })

  if (status === AMBULANCE_STATUS.COMPLETED) {
    request.completedAt = new Date()
    if (request.assignedAmbulance) {
      await Ambulance.findByIdAndUpdate(request.assignedAmbulance._id, {
        status: AMBULANCE_STATUS.AVAILABLE,
        activeRequest: null,
        $inc: { totalTrips: 1 },
      })
    }
  }

  await request.save()

  const io = getSocketIO()
  if (io) {
    io.emit('ambulance:status', {
      requestId: request._id,
      status,
      unitId: request.assignedAmbulance?.unitId,
    })
    io.to(`user_${request.requestedBy._id}`).emit('notification', {
      type: 'ambulance_status',
      message: `Ambulance status updated: ${status.replace('_', ' ')}`,
    })
  }

  return request
}

export const getAllAmbulanceRequests = async (query = {}) => {
  const { page = 1, limit = 20, status } = query
  const filter = {}
  if (status) filter.status = status

  const [requests, total] = await Promise.all([
    AmbulanceRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('assignedAmbulance', 'unitId driverName driverPhone vehicleNumber')
      .populate('requestedBy', 'name phone'),
    AmbulanceRequest.countDocuments(filter),
  ])
  return { requests, total }
}

export const getMyAmbulanceRequests = async (userId) => {
  return AmbulanceRequest.find({ requestedBy: userId })
    .sort({ createdAt: -1 })
    .populate('assignedAmbulance', 'unitId driverName driverPhone')
}
