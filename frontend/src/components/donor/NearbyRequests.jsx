import React from 'react'
import { MapPin, Clock, Droplet, Heart } from 'lucide-react'
import PageHeader from '../layout/PageHeader'
import { Card, Badge, EmptyState } from '../ui/index'
import { getBloodTypeColor, formatRelativeTime, formatDate } from '../../utils/constants'

const NEARBY = [
  { id: 1, bloodType: 'O+', hospital: 'KIMS Hospital', distance: '1.2 km', urgency: 'emergency', units: 2, time: new Date(Date.now() - 600000) },
  { id: 2, bloodType: 'O+', hospital: 'Apollo Clinic', distance: '2.5 km', urgency: 'urgent', units: 1, time: new Date(Date.now() - 3600000) },
  { id: 3, bloodType: 'AB+', hospital: 'City Medical', distance: '3.8 km', urgency: 'normal', units: 1, time: new Date(Date.now() - 7200000) },
]

export const NearbyRequests = () => (
  <div className="animate-fade-in space-y-5">
    <PageHeader title="Nearby Requests" subtitle="Emergency blood requests near you" />
    <div className="space-y-3">
      {NEARBY.map((req) => (
        <Card key={req.id} className={`p-4 ${req.urgency === 'emergency' ? 'border-red-200 bg-red-50/30' : ''}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className={`badge ${getBloodTypeColor(req.bloodType)} font-bold text-base px-3 py-1.5 mt-0.5`}>{req.bloodType}</span>
              <div>
                <p className="font-semibold text-slate-900">{req.hospital}</p>
                <p className="text-sm text-slate-500">{req.units} unit(s) needed</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin size={11} />{req.distance}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-500"><Clock size={11} />{formatRelativeTime(req.time)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge status={req.urgency === 'emergency' ? 'emergency' : undefined}
                color={req.urgency === 'urgent' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}>
                {req.urgency}
              </Badge>
              <button className="btn-emergency text-xs px-4 py-1.5 rounded-lg">Respond</button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
)

const HISTORY = [
  { id: 1, bloodType: 'O+', hospital: 'KIMS Hospital', date: new Date(Date.now() - 7776000000), units: 1, certificate: 'CERT-001' },
  { id: 2, bloodType: 'O+', hospital: 'Apollo Clinic', date: new Date(Date.now() - 15552000000), units: 1, certificate: 'CERT-002' },
  { id: 3, bloodType: 'O+', hospital: 'City Blood Bank', date: new Date(Date.now() - 23328000000), units: 1, certificate: 'CERT-003' },
]

export const DonationHistory = () => (
  <div className="animate-fade-in space-y-5">
    <PageHeader title="Donation History" subtitle="Your past blood donations" />
    <div className="grid grid-cols-3 gap-4">
      <div className="card text-center">
        <p className="text-3xl font-bold text-red-600">12</p>
        <p className="text-slate-500 text-sm mt-1">Total Donations</p>
      </div>
      <div className="card text-center">
        <p className="text-3xl font-bold text-blue-600">36</p>
        <p className="text-slate-500 text-sm mt-1">Lives Impacted</p>
      </div>
      <div className="card text-center">
        <p className="text-3xl font-bold text-green-600">15L</p>
        <p className="text-slate-500 text-sm mt-1">Blood Donated</p>
      </div>
    </div>

    <div className="space-y-3">
      {HISTORY.map((d) => (
        <Card key={d.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <Heart size={18} className="text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{d.hospital}</p>
                <p className="text-xs text-slate-500">{formatDate(d.date)} • {d.units} unit</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`badge ${getBloodTypeColor(d.bloodType)} font-bold`}>{d.bloodType}</span>
              <span className="text-xs text-slate-400 font-mono">{d.certificate}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
)

export default NearbyRequests
