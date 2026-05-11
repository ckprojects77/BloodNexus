import { Router } from 'express'
import {
  getAllUsers, suspendUser, unsuspendUser,
  deleteUser, getAnalytics
} from '../controllers/admin.controller.js'
import { protect, authorize } from '../middleware/auth.js'
import { ROLES } from '../constants/index.js'

const router = Router()

router.use(protect)
router.use(authorize(ROLES.ADMIN))

router.get('/users', getAllUsers)
router.patch('/suspend/:id', suspendUser)
router.patch('/unsuspend/:id', unsuspendUser)
router.delete('/delete/:id', deleteUser)
router.get('/analytics', getAnalytics)

export default router
