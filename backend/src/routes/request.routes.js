import { Router } from 'express'
import {
  createRequest, getMyRequests, getRequestById,
  cancelRequest, getAllRequests
} from '../controllers/request.controller.js'
import { protect, authorize } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { createRequestValidator, cancelRequestValidator } from '../validators/request.validators.js'
import { emergencyLimiter } from '../middleware/rateLimiter.js'
import { ROLES } from '../constants/index.js'

const router = Router()

router.use(protect)

router.post('/create', emergencyLimiter, createRequestValidator, validate, createRequest)
router.get('/my', getMyRequests)
router.get('/all', authorize(ROLES.ADMIN, ROLES.BLOOD_BANK, ROLES.AMBULANCE), getAllRequests)
router.get('/:id', getRequestById)
router.patch('/cancel/:id', cancelRequestValidator, validate, cancelRequest)

export default router
