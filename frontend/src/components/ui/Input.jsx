import React, { forwardRef } from 'react'
import { classNames } from '../../utils/constants'

const Input = forwardRef(
  ({ label, error, icon: Icon, hint, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
              <Icon size={16} />
            </div>
          )}
          <input
            ref={ref}
            className={classNames(
              'w-full border rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all duration-150 bg-white focus:outline-none focus:ring-2 focus:border-transparent',
              Icon && 'pl-9',
              error
                ? 'border-red-300 focus:ring-red-400'
                : 'border-slate-200 focus:ring-blue-400',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export const Select = forwardRef(
  ({ label, error, children, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={classNames(
            'w-full border rounded-xl px-4 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-150',
            error
              ? 'border-red-300 focus:ring-red-400'
              : 'border-slate-200 focus:ring-blue-400',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Input
