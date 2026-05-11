import { validationResult } from 'express-validator'
import { errorResponse } from '../utils/apiResponse.js'
import { HTTP } from '../constants/index.js'

/**
 * Run express-validator results and respond with errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return errorResponse(
      res,
      HTTP.UNPROCESSABLE,
      'Validation failed',
      errors.array().map((e) => ({ field: e.path, message: e.msg }))
    )
  }
  next()
}

export default validate
