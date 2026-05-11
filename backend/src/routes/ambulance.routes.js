import { Router } from 'express'
import {
  createAmbulanceRequest, updateStatus,
  getAllRequests, getMyRequests
} from '../controllers/ambulance.controller.js'
import { protect, authorize } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import {
  createAmbulanceRequestValidator,
  updateAmbulanceStatusValidator
} from '../validators/ambulance.validators.js'
import { ROLES } from '../constants/index.js'

const router = Router()

router.use(protect)

router.post('/request', createAmbulanceRequestValidator, validate, createAmbulanceRequest)
router.get('/my', getMyRequests)
router.get('/all', authorize(ROLES.AMBULANCE, ROLES.ADMIN), getAllRequests)
router.patch('/status/:id', authorize(ROLES.AMBULANCE, ROLES.ADMIN), updateAmbulanceStatusValidator, validate, updateStatus)

export default router
