import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Droplet, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { ROLE_DASHBOARDS } from '../utils/constants'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const DEMO_ACCOUNTS = [
  { role: 'patient', email: 'patient@demo.com', password: 'demo123', label: 'Patient' },
  { role: 'donor', email: 'donor@demo.com', password: 'demo123', label: 'Donor' },
  { role: 'bloodbank', email: 'bank@demo.com', password: 'demo123', label: 'Blood Bank' },
  { role: 'ambulance', email: 'amb@demo.com', password: 'demo123', label: 'Ambulance' },
  { role: 'admin', email: 'admin@demo.com', password: 'demo123', label: 'Admin' },
]

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addNotification } = useNotification()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const user = await login(form)
      addNotification(`Welcome back, ${user.name}!`, 'success')
      navigate(ROLE_DASHBOARDS[user.role] || '/redirect')
    } catch (err) {
      addNotification(err.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loginAsDemo = async (account) => {
    setLoading(true)
    try {
      // Mock demo login — inject user directly for demo purposes
      const mockUser = { name: `Demo ${account.label}`, email: account.email, role: account.role, id: `demo-${account.role}` }
      const mockToken = `demo-token-${account.role}-${Date.now()}`
      localStorage.setItem('token', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))
      window.location.href = ROLE_DASHBOARDS[account.role]
    } catch {
      addNotification('Demo login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center">
              <Droplet size={20} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-xl tracking-tight">BloodLink</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`w-full border rounded-xl pl-9 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.password ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-400'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Register
            </Link>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="mt-5 bg-white rounded-2xl border border-slate-100 shadow-card p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 text-center">
            Quick Demo Access
          </p>
          <div className="grid grid-cols-5 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                onClick={() => loginAsDemo(acc)}
                disabled={loading}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-200 transition-all text-center"
              >
                <span className="text-[10px] font-semibold text-slate-600">{acc.label}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-1.5 mt-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                onClick={() => loginAsDemo(acc)}
                disabled={loading}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all text-xs text-slate-600 font-medium"
              >
                <span>Demo {acc.label}</span>
                <span className="text-slate-400">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
