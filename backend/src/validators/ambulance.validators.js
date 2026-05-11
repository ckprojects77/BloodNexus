import { body, param } from 'express-validator'
import { URGENCY, AMBULANCE_STATUS } from '../constants/index.js'

export const createAmbulanceRequestValidator = [
  body('patientName').notEmpty().withMessage('Patient name is required'),
  body('patientPhone').notEmpty().withMessage('Patient phone is required'),
  body('pickup.address').notEmpty().withMessage('Pickup address is required'),
  body('destination.name').notEmpty().withMessage('Destination name is required'),
  body('urgency').optional().isIn(Object.values(URGENCY)),
]

export const updateAmbulanceStatusValidator = [
  param('id').isMongoId().withMessage('Invalid request ID'),
  body('status').notEmpty().isIn(Object.values(AMBULANCE_STATUS)).withMessage('Invalid status'),
]
