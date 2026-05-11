import User from '../models/User.js'
import BloodRequest from '../models/BloodRequest.js'
import DonationHistory from '../models/DonationHistory.js'
import { ROLES, REQUEST_STATUS } from '../constants/index.js'

export const getNearbyDonors = async ({ bloodGroup, latitude, longitude, radiusKm = 10, page = 1, limit = 20 }) => {
  const filter = {
    role: ROLES.DONOR,
    isAvailable: true,
    isActive: true,
    isSuspended: false,
  }
  if (bloodGroup) filter.bloodType = bloodGroup

  // Geo query if coordinates provided
  if (latitude && longitude) {
    filter['location.coordinates'] = {
      $geoWithin: {
        $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], radiusKm / 6378.1],
      },
    }
  }

  const [donors, total] = await Promise.all([
    User.find(filter)
      .select('name phone bloodType location isAvailable totalDonations lastDonated')
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ])

  return { donors, total, page, limit }
}

export const toggleAvailability = async (donorId, available) => {
  const donor = await User.findByIdAndUpdate(
    donorId,
    { isAvailable: available },
    { new: true }
  ).select('-password')

  if (!donor) {
    const err = new Error('Donor not found')
    err.statusCode = 404
    throw err
  }

  return donor
}

export const getDonorProfile = async (donorId) => {
  const donor = await User.findById(donorId).select('-password -refreshToken')
  if (!donor) {
    const err = new Error('Donor not found')
    err.statusCode = 404
    throw err
  }
  return donor
}

export const updateDonorProfile = async (donorId, updates) => {
  const allowed = ['name', 'phone', 'location', 'age', 'weight', 'notificationsEnabled']
  const filtered = Object.fromEntries(
    Object.entries(updates).filter(([k]) => allowed.includes(k))
  )

  const donor = await User.findByIdAndUpdate(donorId, filtered, {
    new: true,
    runValidators: true,
  }).select('-password -refreshToken')

  return donor
}

export const getDonationHistory = async (donorId, query = {}) => {
  const { page = 1, limit = 10 } = query
  const [history, total] = await Promise.all([
    DonationHistory.find({ donor: donorId })
      .sort({ donatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('bloodRequest', 'hospital bloodGroup'),
    DonationHistory.countDocuments({ donor: donorId }),
  ])
  return { history, total, page, limit }
}

export const getNearbyRequests = async (donorId) => {
  const donor = await User.findById(donorId).select('bloodType')
  const requests = await BloodRequest.find({
    bloodGroup: donor.bloodType,
    status: { $in: [REQUEST_STATUS.PENDING, REQUEST_STATUS.EMERGENCY] },
  })
    .sort({ urgency: -1, createdAt: -1 })
    .limit(20)
    .populate('patient', 'name phone')
  return requests
}
