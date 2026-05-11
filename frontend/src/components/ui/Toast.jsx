import React from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useNotification } from '../../context/NotificationContext'
import { classNames } from '../../utils/constants'

const icons = {
  success: { icon: CheckCircle, class: 'text-green-600 bg-green-50 border-green-200' },
  error: { icon: XCircle, class: 'text-red-600 bg-red-50 border-red-200' },
  warning: { icon: AlertTriangle, class: 'text-amber-600 bg-amber-50 border-amber-200' },
  info: { icon: Info, class: 'text-blue-600 bg-blue-50 border-blue-200' },
}

const Toast = ({ notification }) => {
  const { removeNotification } = useNotification()
  const { icon: Icon, class: cls } = icons[notification.type] || icons.info

  return (
    <div
      className={classNames(
        'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm w-full animate-slide-up',
        cls
      )}
    >
      <Icon size={18} className="flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{notification.message}</p>
      <button
        onClick={() => removeNotification(notification.id)}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  )
}

const NotificationContainer = () => {
  const { notifications } = useNotification()

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {notifications.map((n) => (
        <Toast key={n.id} notification={n} />
      ))}
    </div>
  )
}

export default NotificationContainer
