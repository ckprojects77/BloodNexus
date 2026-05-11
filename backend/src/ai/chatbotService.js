import OpenAI from 'openai'
import axios from 'axios'
import { buildUserPrompt, FALLBACK_RESPONSES, detectIntent } from './promptTemplates.js'
import logger from '../utils/logger.js'

let openaiClient = null

const getOpenAIClient = () => {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return openaiClient
}

// ── OpenAI ───────────────────────────────────────────────────────────────────
const callOpenAI = async (messages) => {
  const client = getOpenAIClient()
  if (!client) throw new Error('OpenAI not configured')

  const response = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    max_tokens: 400,
    temperature: 0.7,
  })

  return response.choices[0].message.content.trim()
}

// ── Gemini ───────────────────────────────────────────────────────────────────
const callGemini = async (messages) => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('Gemini not configured')

  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

  const systemMsg = messages.find((m) => m.role === 'system')

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      system_instruction: systemMsg ? { parts: [{ text: systemMsg.content }] } : undefined,
      contents,
      generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
    }
  )

  return response.data.candidates[0].content.parts[0].text.trim()
}

// ── Main chat function ───────────────────────────────────────────────────────
export const processChat = async (message, history = []) => {
  const messages = buildUserPrompt(message, history)

  const provider = process.env.AI_PROVIDER || 'openai'

  try {
    let reply
    if (provider === 'gemini') {
      reply = await callGemini(messages)
    } else {
      reply = await callOpenAI(messages)
    }
    logger.debug(`AI response generated via ${provider}`)
    return { message: reply, provider }
  } catch (err) {
    logger.warn(`AI API failed (${provider}): ${err.message} — using fallback`)

    // Smart fallback based on intent
    const intent = detectIntent(message)
    const fallback = intent ? FALLBACK_RESPONSES[intent] : FALLBACK_RESPONSES.default
    return { message: fallback, provider: 'fallback' }
  }
}
