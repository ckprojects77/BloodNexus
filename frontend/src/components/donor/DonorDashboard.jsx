import React, { useState } from 'react'
import { Heart, MapPin, Droplet, Clock, ToggleLeft, ToggleRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { StatCard, Card, Badge } from '../ui/index'
import PageHeader from '../layout/PageHeader'
import { getBloodTypeColor, formatRelativeTime } from '../../utils/constants'

const MOCK_NEARBY = [
  { id: 1, bloodType: 'O+', hospital: 'KIMS Hospital', distance: '1.2 km', urgency: 'emergency', time: new Date(Date.now() - 600000) },
  { id: 2, bloodType: 'O+', hospital: 'Apollo Clinic', distance: '2.5 km', urgency: 'urgent', time: new Date(Date.now() - 3600000) },
]

const DonorDashboard = () => {
  const { user } = useAuth()
  const [available, setAvailable] = useState(true)

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={`Hello, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Your donation availability and nearby requests"
      />

      {/* Availability Toggle */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900">Donation Availability</p>
            <p className="text-slate-500 text-sm mt-0.5">
              {available ? 'You are currently available to donate' : 'You are currently unavailable'}
            </p>
          </div>
          <button
            onClick={() => setAvailable(!available)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${available ? 'bg-green-500' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-200 ${available ? 'translate-x-7' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {available && (
          <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-green-700 text-sm font-medium">You're active — nearby patients can see you</p>
          </div>
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Heart} label="Total Donations" value="12" color="red" />
        <StatCard icon={Droplet} label="Units Donated" value="15" color="blue" />
        <StatCard icon={Clock} label="Last Donation" value="3mo" trend="ago" color="amber" />
        <StatCard icon={MapPin} label="Lives Impacted" value="36" trend="Estimated" color="green" />
      </div>

      {/* Nearby Emergency Requests */}
      <Card>
        <div className="px-5 pt-5 pb-3 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">🚨 Nearby Emergency Requests</h3>
          <p className="text-slate-500 text-xs mt-0.5">Compatible requests within 5km</p>
        </div>
        <div className="divide-y divide-slate-50">
          {MOCK_NEARBY.map((req) => (
            <div key={req.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <span className={`badge ${getBloodTypeColor(req.bloodType)} font-bold text-sm`}>{req.bloodType}</span>
                <div>
                  <p className="text-sm font-medium text-slate-800">{req.hospital}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={11} />{req.distance}</span>
                    <span className="text-xs text-slate-500">{formatRelativeTime(req.time)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge status={req.urgency === 'emergency' ? 'emergency' : undefined}
                  color="bg-amber-100 text-amber-700">
                  {req.urgency}
                </Badge>
                <button className="btn-emergency text-xs px-3 py-1.5 rounded-lg">Respond</button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Blood Type Card */}
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${getBloodTypeColor(user?.bloodType || 'O+')}`}>
            {user?.bloodType || 'O+'}
          </div>
          <div>
            <p className="font-semibold text-slate-900">Your Blood Type</p>
            <p className="text-slate-500 text-sm">Compatible with: O-, O+</p>
            <p className="text-slate-500 text-xs mt-0.5">You can donate to: A+, A-, B+, B-, AB+, AB-, O+, O-</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default DonorDashboard
