import { body, param } from 'express-validator'
import { BLOOD_GROUPS, URGENCY } from '../constants/index.js'

export const createRequestValidator = [
  body('bloodGroup')
    .notEmpty().withMessage('Blood group is required')
    .isIn(BLOOD_GROUPS).withMessage('Invalid blood group'),

  body('units')
    .notEmpty().withMessage('Units required')
    .isInt({ min: 1, max: 10 }).withMessage('Units must be between 1 and 10'),

  body('urgency')
    .optional()
    .isIn(Object.values(URGENCY)).withMessage('Invalid urgency level'),

  body('hospital.name')
    .notEmpty().withMessage('Hospital name is required'),

  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes max 500 chars'),
]

export const cancelRequestValidator = [
  param('id').isMongoId().withMessage('Invalid request ID'),
  body('cancelReason').optional().isLength({ max: 300 }),
]
