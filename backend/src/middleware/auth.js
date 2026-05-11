import { verifyAccessToken } from '../utils/jwtHelper.js'
import User from '../models/User.js'
import { errorResponse } from '../utils/apiResponse.js'
import { HTTP } from '../constants/index.js'

/**
 * Verify JWT access token and attach user to req
 */
export const protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken
    }

    if (!token) {
      return errorResponse(res, HTTP.UNAUTHORIZED, 'Access token required')
    }

    const decoded = verifyAccessToken(token)
    const user = await User.findById(decoded.id).select('-password -refreshToken')

    if (!user) {
      return errorResponse(res, HTTP.UNAUTHORIZED, 'User not found')
    }

    if (user.isSuspended) {
      return errorResponse(res, HTTP.FORBIDDEN, 'Account suspended. Contact support.')
    }

    if (!user.isActive) {
      return errorResponse(res, HTTP.FORBIDDEN, 'Account deactivated')
    }

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, HTTP.UNAUTHORIZED, 'Token expired')
    }
    return errorResponse(res, HTTP.UNAUTHORIZED, 'Invalid token')
  }
}

/**
 * Restrict access to specific roles
 * Usage: authorize('admin', 'bloodbank')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return errorResponse(
        res,
        HTTP.FORBIDDEN,
        `Role '${req.user?.role}' is not authorized for this action`
      )
    }
    next()
  }
}
