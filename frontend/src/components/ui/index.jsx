import React from 'react'
import { X } from 'lucide-react'
import { classNames, STATUS_COLORS } from '../../utils/constants'

// Card
export const Card = ({ children, className = '', ...props }) => (
  <div
    className={classNames(
      'bg-white rounded-2xl border border-slate-100 shadow-card',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={classNames('flex items-start justify-between p-5 border-b border-slate-100', className)}>
    <div>
      <h3 className="font-semibold text-slate-900 text-base">{title}</h3>
      {subtitle && <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
)

export const CardBody = ({ children, className = '' }) => (
  <div className={classNames('p-5', className)}>{children}</div>
)

// Badge
export const Badge = ({ children, status, color, className = '' }) => {
  const colorClass = status ? STATUS_COLORS[status] : color || 'bg-slate-100 text-slate-700'
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
        colorClass,
        className
      )}
    >
      {children}
    </span>
  )
}

// Spinner
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' }
  return (
    <div
      className={classNames(
        'border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin',
        sizes[size],
        className
      )}
    />
  )
}

export const LoadingScreen = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
    <Spinner size="lg" />
    <p className="text-slate-500 text-sm">{text}</p>
  </div>
)

// EmptyState
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    {Icon && (
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <Icon size={22} className="text-slate-400" />
      </div>
    )}
    <h3 className="text-slate-700 font-medium text-base">{title}</h3>
    {description && <p className="text-slate-500 text-sm mt-1 max-w-sm">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
)

// Modal
export const Modal = ({ open, onClose, title, children, maxWidth = 'max-w-md' }) => {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className={classNames(
          'bg-white rounded-2xl shadow-2xl w-full animate-slide-up',
          maxWidth
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900 text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// StatCard
export const StatCard = ({ icon: Icon, label, value, trend, color = 'blue', bgClass }) => {
  const colorMap = {
    red: 'text-red-600 bg-red-50',
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    amber: 'text-amber-600 bg-amber-50',
    purple: 'text-purple-600 bg-purple-50',
  }
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <div className={classNames('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', colorMap[color])}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
          {trend && <p className="text-xs text-slate-500 mt-0.5">{trend}</p>}
        </div>
      </div>
    </Card>
  )
}

// Divider
export const Divider = ({ label, className = '' }) => (
  <div className={classNames('flex items-center gap-3', className)}>
    <div className="flex-1 h-px bg-slate-200" />
    {label && <span className="text-xs text-slate-400 font-medium">{label}</span>}
    <div className="flex-1 h-px bg-slate-200" />
  </div>
)

// Table
export const Table = ({ headers, children, className = '' }) => (
  <div className={classNames('overflow-x-auto', className)}>
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-100">
          {headers.map((h, i) => (
            <th
              key={i}
              className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">{children}</tbody>
    </table>
  </div>
)

export const Tr = ({ children, className = '', onClick }) => (
  <tr
    className={classNames(
      'hover:bg-slate-50 transition-colors',
      onClick && 'cursor-pointer',
      className
    )}
    onClick={onClick}
  >
    {children}
  </tr>
)

export const Td = ({ children, className = '' }) => (
  <td className={classNames('px-4 py-3 text-slate-700', className)}>{children}</td>
)
