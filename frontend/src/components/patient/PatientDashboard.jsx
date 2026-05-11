import React from 'react'
import { Link } from 'react-router-dom'
import { Droplet, AlertTriangle, Clock, CheckCircle, MapPin, Zap, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { StatCard, Card, Badge } from '../ui/index'
import PageHeader from '../layout/PageHeader'
import Button from '../ui/Button'
import { formatRelativeTime, getBloodTypeColor } from '../../utils/constants'

const MOCK_REQUESTS = [
  { id: 1, bloodType: 'O+', units: 2, status: 'pending', hospital: 'KIMS Hospital', createdAt: new Date(Date.now() - 3600000) },
  { id: 2, bloodType: 'O+', units: 1, status: 'accepted', hospital: 'Apollo Clinic', createdAt: new Date(Date.now() - 86400000) },
]

const PatientDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Hello, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Monitor your blood requests and find donors near you"
        action={
          <Link to="/dashboard/patient/request">
            <Button variant="emergency" icon={Zap}>Emergency Request</Button>
          </Link>
        }
      />

      {/* Emergency Banner */}
      <div className="bg-red-600 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="font-bold text-base">Need Blood Urgently?</p>
            <p className="text-red-100 text-sm">Tap the button to broadcast an emergency alert to all nearby donors</p>
          </div>
        </div>
        <Link to="/dashboard/patient/request">
          <button className="flex-shrink-0 bg-white hover:bg-red-50 text-red-600 font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap">
            <Zap size={16} />
            Alert Now
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Droplet} label="Total Requests" value="3" color="red" />
        <StatCard icon={Clock} label="Pending" value="1" trend="Awaiting response" color="amber" />
        <StatCard icon={CheckCircle} label="Fulfilled" value="2" trend="All time" color="green" />
        <StatCard icon={MapPin} label="Donors Nearby" value="8" trend="Within 5km" color="blue" />
      </div>

      {/* Recent Requests */}
      <Card>
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-semibold text-slate-900">Recent Requests</h3>
          <Link to="/dashboard/patient/track" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {MOCK_REQUESTS.map((req) => (
            <div key={req.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`badge ${getBloodTypeColor(req.bloodType)} font-bold text-sm px-3 py-1 rounded-full`}>
                  {req.bloodType}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-800">{req.hospital}</p>
                  <p className="text-xs text-slate-500">{req.units} unit(s) • {formatRelativeTime(req.createdAt)}</p>
                </div>
              </div>
              <Badge status={req.status}>{req.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/dashboard/patient/donors" className="card hover:border-blue-200 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <MapPin size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Nearby Donors</p>
              <p className="text-xs text-slate-500">8 available</p>
            </div>
          </div>
        </Link>
        <Link to="/dashboard/patient/request" className="card hover:border-red-200 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <Droplet size={18} className="text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">New Request</p>
              <p className="text-xs text-slate-500">Create blood request</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default PatientDashboard
