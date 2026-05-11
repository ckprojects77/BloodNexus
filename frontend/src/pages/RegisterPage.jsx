import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Droplet, User, Mail, Lock, Phone, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { BLOOD_TYPES, ROLE_DASHBOARDS } from '../utils/constants'
import Button from '../components/ui/Button'
import Input, { Select } from '../components/ui/Input'

const ROLES = [
  { value: 'patient', label: 'Patient — I need blood' },
  { value: 'donor', label: 'Donor — I want to donate' },
  { value: 'bloodbank', label: 'Blood Bank — We store blood' },
  { value: 'ambulance', label: 'Ambulance — Emergency service' },
]

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { addNotification } = useNotification()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    role: 'patient', bloodType: '', location: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email) errs.email = 'Email is required'
    if (!form.password || form.password.length < 6) errs.password = 'Min 6 characters'
    if (!form.role) errs.role = 'Role is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const user = await register(form)
      addNotification(`Welcome to BloodLink, ${user.name}!`, 'success')
      navigate(ROLE_DASHBOARDS[user.role] || '/redirect')
    } catch (err) {
      addNotification(err.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center">
              <Droplet size={20} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-xl tracking-tight">BloodLink</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Join the emergency blood network</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                icon={User}
                value={form.name}
                onChange={set('name')}
                error={errors.name}
                required
              />
              <Input
                label="Phone Number"
                placeholder="+91 98765 43210"
                icon={Phone}
                value={form.phone}
                onChange={set('phone')}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min 6 characters"
              icon={Lock}
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              required
            />

            <Select
              label="Register As"
              value={form.role}
              onChange={set('role')}
              error={errors.role}
              required
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </Select>

            {(form.role === 'patient' || form.role === 'donor') && (
              <Select
                label="Blood Type"
                value={form.bloodType}
                onChange={set('bloodType')}
              >
                <option value="">Select blood type</option>
                {BLOOD_TYPES.map((bt) => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </Select>
            )}

            <Input
              label="Location / Address"
              placeholder="City, State"
              icon={MapPin}
              value={form.location}
              onChange={set('location')}
            />

            <Button type="submit" fullWidth loading={loading} size="lg" variant="emergency">
              Create Account
            </Button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
