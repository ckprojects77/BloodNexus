import asyncHandler from '../utils/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.js'
import { processChat } from '../ai/chatbotService.js'
import { HTTP } from '../constants/index.js'

export const chat = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message is required' })
  }

  const result = await processChat(message.trim(), history)

  return successResponse(res, HTTP.OK, 'AI response', {
    message: result.message,
    provider: result.provider,
  })
})
