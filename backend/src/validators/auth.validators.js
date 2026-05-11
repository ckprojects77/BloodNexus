import { body } from 'express-validator'
import { ROLES, BLOOD_GROUPS } from '../constants/index.js'

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(Object.values(ROLES)).withMessage('Invalid role'),

  body('phone')
    .optional()
    .isMobilePhone().withMessage('Invalid phone number'),

  body('bloodType')
    .optional()
    .isIn(BLOOD_GROUPS).withMessage('Invalid blood type'),
]

export const loginValidator = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
]

export const forgotPasswordValidator = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail(),
]

export const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]
