import React, { useState } from 'react'
import { User, Phone, MapPin, Mail, Heart, Save } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import PageHeader from '../layout/PageHeader'
import { Card } from '../ui/index'
import Button from '../ui/Button'
import Input, { Select } from '../ui/Input'
import { BLOOD_TYPES } from '../../utils/constants'

const DonorProfile = () => {
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bloodType: user?.bloodType || '',
    location: user?.location || '',
    age: user?.age || '',
    weight: user?.weight || '',
  })

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSave = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    addNotification('Profile updated successfully!', 'success')
    setLoading(false)
  }

  return (
    <div className="animate-fade-in space-y-5 max-w-2xl">
      <PageHeader title="My Profile" subtitle="Manage your donor profile" />
      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-slate-900">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Full Name" icon={User} value={form.name} onChange={set('name')} />
          <Input label="Email" icon={Mail} type="email" value={form.email} onChange={set('email')} />
          <Input label="Phone" icon={Phone} value={form.phone} onChange={set('phone')} />
          <Select label="Blood Type" value={form.bloodType} onChange={set('bloodType')}>
            <option value="">Select</option>
            {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
          </Select>
          <Input label="Age" type="number" value={form.age} onChange={set('age')} />
          <Input label="Weight (kg)" type="number" value={form.weight} onChange={set('weight')} hint="Must be ≥ 50kg to donate" />
        </div>
        <Input label="Location" icon={MapPin} value={form.location} onChange={set('location')} />
        <Button icon={Save} loading={loading} onClick={handleSave}>Save Changes</Button>
      </Card>

      {/* Eligibility */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-900 mb-3">Donation Eligibility</h3>
        <div className="space-y-2">
          {[
            { label: 'Age 18-65', ok: true },
            { label: 'Weight ≥ 50kg', ok: true },
            { label: 'Last donation > 56 days ago', ok: true },
            { label: 'Haemoglobin ≥ 12.5 g/dL', ok: null },
          ].map(({ label, ok }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${ok === true ? 'bg-green-100 text-green-600' : ok === false ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                {ok === true ? '✓' : ok === false ? '✕' : '?'}
              </span>
              <span className={ok === null ? 'text-slate-400' : 'text-slate-700'}>{label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default DonorProfile
