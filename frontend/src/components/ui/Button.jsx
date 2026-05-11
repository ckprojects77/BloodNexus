import React from 'react'
import { Loader2 } from 'lucide-react'
import { classNames } from '../../utils/constants'

const variants = {
  emergency: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg focus:ring-red-400',
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus:ring-blue-400',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-300',
  outline: 'border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-300',
  ghost: 'hover:bg-slate-100 text-slate-600 focus:ring-slate-300',
  danger: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 focus:ring-red-300',
  success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-400',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight,
  className = '',
  fullWidth = false,
  pulse = false,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={classNames(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        pulse && 'animate-pulse-emergency',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
      {!loading && iconRight && <span>{iconRight}</span>}
    </button>
  )
}

export default Button
