import React from 'react'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import AppRoutes from './routes/AppRoutes'
import NotificationContainer from './components/ui/Toast'
import ChatbotWidget from './components/chatbot/ChatbotWidget'
import { useAuth } from './context/AuthContext'

const ChatbotGate = () => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <ChatbotWidget /> : null
}

const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AppRoutes />
        <NotificationContainer />
        <ChatbotGate />
      </AuthProvider>
    </NotificationProvider>
  )
}

export default App
