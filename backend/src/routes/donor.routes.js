import { Router } from 'express'
import {
  getNearbyDonors, toggleAvailability, getDonorProfile,
  updateDonorProfile, getDonationHistory, getNearbyRequests
} from '../controllers/donor.controller.js'
import { protect, authorize } from '../middleware/auth.js'
import { ROLES } from '../constants/index.js'

const router = Router()

// Public — anyone can search donors
router.get('/nearby', getNearbyDonors)

// Protected
router.use(protect)

router.get('/profile', authorize(ROLES.DONOR), getDonorProfile)
router.patch('/profile', authorize(ROLES.DONOR), updateDonorProfile)
router.patch('/availability', authorize(ROLES.DONOR), toggleAvailability)
router.get('/history', authorize(ROLES.DONOR), getDonationHistory)
router.get('/requests', authorize(ROLES.DONOR), getNearbyRequests)

export default router
