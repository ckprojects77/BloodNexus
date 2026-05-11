/**
 * Standardised API response helpers
 */

export const successResponse = (res, statusCode = 200, message = 'Success', data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

export const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const payload = { success: false, message }
  if (errors) payload.errors = errors
  return res.status(statusCode).json(payload)
}

export const paginatedResponse = (res, data, total, page, limit) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  })
}
