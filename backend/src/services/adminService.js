import User from '../models/User.js'
import BloodRequest from '../models/BloodRequest.js'
import AmbulanceRequest from '../models/AmbulanceRequest.js'
import BloodInventory from '../models/BloodInventory.js'
import DonationHistory from '../models/DonationHistory.js'
import { ROLES, REQUEST_STATUS, BLOOD_GROUPS } from '../constants/index.js'

export const getAllUsers = async (query = {}) => {
  const { page = 1, limit = 20, role, search, status } = query
  const filter = {}
  if (role) filter.role = role
  if (status === 'suspended') filter.isSuspended = true
  if (status === 'active') filter.isSuspended = false
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password -refreshToken -passwordResetToken')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ])
  return { users, total, page, limit }
}

export const suspendUser = async (userId, suspend = true) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isSuspended: suspend },
    { new: true }
  ).select('-password')

  if (!user) {
    const err = new Error('User not found')
    err.statusCode = 404
    throw err
  }
  return user
}

export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId)
  if (!user) {
    const err = new Error('User not found')
    err.statusCode = 404
    throw err
  }
  return user
}

export const getAnalytics = async () => {
  const now = new Date()
  const startOfDay = new Date(now.setHours(0, 0, 0, 0))
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalUsers,
    usersByRole,
    totalRequests,
    requestsToday,
    requestsByStatus,
    requestsByUrgency,
    activeDonors,
    totalDonations,
    donationsThisMonth,
    ambulanceRequests,
    lowStockAlerts,
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]),
    BloodRequest.countDocuments(),
    BloodRequest.countDocuments({ createdAt: { $gte: startOfDay } }),
    BloodRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    BloodRequest.aggregate([
      { $group: { _id: '$urgency', count: { $sum: 1 } } },
    ]),
    User.countDocuments({ role: ROLES.DONOR, isAvailable: true, isActive: true }),
    DonationHistory.countDocuments(),
    DonationHistory.countDocuments({ donatedAt: { $gte: startOfMonth } }),
    AmbulanceRequest.countDocuments(),
    BloodInventory.aggregate([
      { $unwind: '$stock' },
      {
        $match: {
          $expr: { $lte: ['$stock.units', '$stock.minThreshold'] },
        },
      },
      { $count: 'count' },
    ]),
  ])

  const requestsByBloodGroup = await BloodRequest.aggregate([
    { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])

  return {
    users: {
      total: totalUsers,
      byRole: Object.fromEntries(usersByRole.map((r) => [r._id, r.count])),
      activeDonors,
    },
    requests: {
      total: totalRequests,
      today: requestsToday,
      byStatus: Object.fromEntries(requestsByStatus.map((r) => [r._id, r.count])),
      byUrgency: Object.fromEntries(requestsByUrgency.map((r) => [r._id, r.count])),
      byBloodGroup: requestsByBloodGroup,
    },
    donations: {
      total: totalDonations,
      thisMonth: donationsThisMonth,
    },
    ambulance: {
      totalRequests: ambulanceRequests,
    },
    alerts: {
      lowStock: lowStockAlerts[0]?.count || 0,
    },
  }
}
