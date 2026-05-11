import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Zap } from 'lucide-react'
import { aiService } from '../../services/bloodService'
import { classNames } from '../../utils/constants'

const QUICK_PROMPTS = [
  { label: 'I need blood urgently', icon: '🩸' },
  { label: 'Find nearest donor', icon: '📍' },
  { label: 'Emergency help', icon: '🚨' },
  { label: 'Blood bank nearby', icon: '🏥' },
]

const TypingIndicator = () => (
  <div className="flex items-start gap-2">
    <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
      <Bot size={13} className="text-red-600" />
    </div>
    <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
      <div className="flex gap-1 items-center">
        <span className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
        <span className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
        <span className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
      </div>
    </div>
  </div>
)

const Message = ({ msg }) => {
  const isBot = msg.role === 'assistant'
  return (
    <div className={classNames('flex items-start gap-2', !isBot && 'flex-row-reverse')}>
      <div
        className={classNames(
          'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
          isBot ? 'bg-red-100' : 'bg-blue-100'
        )}
      >
        {isBot ? <Bot size={13} className="text-red-600" /> : <User size={13} className="text-blue-600" />}
      </div>
      <div
        className={classNames(
          'max-w-[78%] px-4 py-2.5 rounded-2xl text-sm shadow-sm',
          isBot
            ? 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
            : 'bg-blue-600 text-white rounded-tr-sm'
        )}
      >
        {msg.content}
      </div>
    </div>
  )
}

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m BloodBot 🩸 — your emergency blood assistance AI. How can I help you today?',
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }
  }, [messages, open, typing])

  const sendMessage = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg) return
    setInput('')

    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setTyping(true)

    try {
      const history = newMessages.slice(-6).map((m) => ({ role: m.role, content: m.content }))
      const res = await aiService.chat(userMsg, history)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.message || res.reply || 'I\'m here to help. Can you tell me more?' }])
    } catch {
      // Fallback AI response for demo
      const fallbackResponses = {
        'i need blood urgently': 'I\'ve detected an emergency! 🚨 Please call 108 immediately. I\'m also alerting nearby donors and blood banks with your blood type. Stay calm — help is on the way!',
        'find nearest donor': 'Searching for donors near you... 📍 I found 3 compatible donors within 2km. Shall I send them an emergency alert?',
        'emergency help': '🚨 Emergency mode activated! I\'m contacting the nearest ambulance and blood bank. Please confirm your location and blood type needed.',
        'blood bank nearby': '🏥 Found 2 blood banks near you: City Blood Center (1.2km) and Red Cross Bank (2.8km). Both have O+ available. Would you like me to send a request?',
      }
      const lower = userMsg.toLowerCase()
      const fallback = Object.entries(fallbackResponses).find(([key]) => lower.includes(key.split(' ')[0]))
      const reply = fallback
        ? fallback[1]
        : 'I understand your concern. For immediate emergency blood assistance, please also call the national helpline at 104. I can help you find donors and blood banks — what blood type do you need?'
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } finally {
      setTyping(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className={classNames(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-glow_red flex items-center justify-center transition-all duration-200 active:scale-95',
          open ? 'bg-slate-700 hover:bg-slate-800' : 'bg-red-600 hover:bg-red-700 animate-pulse-emergency'
        )}
      >
        {open ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[370px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-slide-up"
          style={{ height: '500px' }}
        >
          {/* Header */}
          <div className="bg-red-600 px-4 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">BloodBot AI</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span className="text-red-100 text-xs">Online — Emergency Ready</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((msg, i) => (
              <Message key={i} msg={msg} />
            ))}
            {typing && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="px-3 py-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => sendMessage(p.label)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200 transition-all text-xs font-medium text-slate-600 whitespace-nowrap"
                >
                  <span>{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-slate-100 bg-white flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your message..."
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent placeholder-slate-400"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || typing}
              className="w-10 h-10 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all active:scale-95 flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatbotWidget
