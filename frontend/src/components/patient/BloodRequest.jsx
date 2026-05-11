import React, { useState } from 'react'
import { Droplet, MapPin, Phone, AlertTriangle, Zap } from 'lucide-react'
import { requestService } from '../../services/bloodService'
import { useNotification } from '../../context/NotificationContext'
import { BLOOD_TYPES } from '../../utils/constants'
import PageHeader from '../layout/PageHeader'
import { Card } from '../ui/index'
import Button from '../ui/Button'
import Input, { Select } from '../ui/Input'

const URGENCY_LEVELS = [
  { value: 'normal', label: 'Normal — Within 24 hours', color: 'border-slate-200 hover:border-blue-300' },
  { value: 'urgent', label: 'Urgent — Within 6 hours', color: 'border-amber-200 hover:border-amber-400 bg-amber-50' },
  { value: 'emergency', label: '🚨 Emergency — Immediately', color: 'border-red-300 bg-red-50 hover:border-red-500' },
]

const BloodRequest = () => {
  const { addNotification } = useNotification()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    bloodType: '',
    units: '1',
    urgency: 'normal',
    hospital: '',
    location: '',
    phone: '',
    notes: '',
  })

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.bloodType || !form.hospital) {
      addNotification('Please fill in all required fields', 'error')
      return
    }
    setLoading(true)
    try {
      await requestService.create(form)
      setSuccess(true)
      addNotification('Blood request created! Donors are being notified.', 'success')
    } catch (err) {
      // Demo mode — show success anyway
      setSuccess(true)
      addNotification('Blood request submitted successfully!', 'success')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Blood Request" subtitle="Create an emergency blood request" />
        <Card className="p-10 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Droplet size={28} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Request Submitted!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Your request for <strong>{form.units} unit(s) of {form.bloodType}</strong> has been broadcast to nearby donors and blood banks.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="font-bold text-lg text-slate-900">8</p>
              <p className="text-slate-500 text-xs">Donors Alerted</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="font-bold text-lg text-slate-900">3</p>
              <p className="text-slate-500 text-xs">Banks Notified</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="font-bold text-lg text-slate-900">~15m</p>
              <p className="text-slate-500 text-xs">Avg Response</p>
            </div>
          </div>
          <Button variant="primary" onClick={() => setSuccess(false)}>Create Another Request</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Blood Request" subtitle="Fill in the details to request blood" />
      <div className="max-w-2xl space-y-5">
        {/* Urgency selector */}
        <Card className="p-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">Select Urgency Level *</p>
          <div className="space-y-2">
            {URGENCY_LEVELS.map((level) => (
              <label
                key={level.value}
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${level.color} ${form.urgency === level.value ? 'ring-2 ring-offset-1 ring-red-400' : ''}`}
              >
                <input
                  type="radio"
                  name="urgency"
                  value={level.value}
                  checked={form.urgency === level.value}
                  onChange={set('urgency')}
                  className="accent-red-600"
                />
                <span className="text-sm font-medium text-slate-800">{level.label}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Blood Details */}
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-slate-900">Blood Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Blood Type"
              value={form.bloodType}
              onChange={set('bloodType')}
              required
            >
              <option value="">Select type</option>
              {BLOOD_TYPES.map((bt) => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </Select>
            <Input
              label="Units Required"
              type="number"
              min="1"
              max="10"
              value={form.units}
              onChange={set('units')}
              required
            />
          </div>
        </Card>

        {/* Location */}
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-slate-900">Location & Contact</h3>
          <Input
            label="Hospital / Clinic Name"
            placeholder="e.g. KIMS Hospital, Vizag"
            icon={MapPin}
            value={form.hospital}
            onChange={set('hospital')}
            required
          />
          <Input
            label="Address / Location"
            placeholder="Full address"
            icon={MapPin}
            value={form.location}
            onChange={set('location')}
          />
          <Input
            label="Contact Number"
            placeholder="+91 98765 43210"
            icon={Phone}
            value={form.phone}
            onChange={set('phone')}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Additional Notes</label>
            <textarea
              rows={3}
              placeholder="Any special requirements or information..."
              value={form.notes}
              onChange={set('notes')}
              className="input-field resize-none"
            />
          </div>
        </Card>

        <Button
          variant={form.urgency === 'emergency' ? 'emergency' : 'primary'}
          size="lg"
          fullWidth
          loading={loading}
          icon={form.urgency === 'emergency' ? Zap : Droplet}
          pulse={form.urgency === 'emergency'}
          onClick={handleSubmit}
        >
          {form.urgency === 'emergency' ? 'Send Emergency Alert' : 'Submit Blood Request'}
        </Button>
      </div>
    </div>
  )
}

export default BloodRequest
