import { Router } from 'express'
import {
  getInventory, updateStock, updateBulkStock,
  getBankRequests, respondToRequest
} from '../controllers/bloodbank.controller.js'
import { protect, authorize } from '../middleware/auth.js'
import { ROLES } from '../constants/index.js'

const router = Router()

router.use(protect)
router.use(authorize(ROLES.BLOOD_BANK, ROLES.ADMIN))

router.get('/inventory', getInventory)
router.patch('/update-stock', updateStock)
router.patch('/bulk-stock', updateBulkStock)
router.get('/requests', getBankRequests)
router.post('/request/:id/respond', respondToRequest)

export default router
