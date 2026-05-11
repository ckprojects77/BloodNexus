import React from 'react'
import { Building2, Droplet, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { StatCard, Card, Badge } from '../ui/index'
import PageHeader from '../layout/PageHeader'
import { getBloodTypeColor, BLOOD_TYPES } from '../../utils/constants'

const INVENTORY = {
  'A+': 45, 'A-': 8, 'B+': 32, 'B-': 5,
  'AB+': 18, 'AB-': 3, 'O+': 60, 'O-': 12,
}

const MOCK_REQUESTS = [
  { id: 'REQ001', bloodType: 'O+', units: 2, hospital: 'KIMS Hospital', urgency: 'emergency', status: 'pending' },
  { id: 'REQ002', bloodType: 'A+', units: 1, hospital: 'Apollo Clinic', urgency: 'urgent', status: 'pending' },
]

const BloodBankDashboard = () => {
  const { user } = useAuth()
  const totalUnits = Object.values(INVENTORY).reduce((a, b) => a + b, 0)
  const criticalTypes = Object.entries(INVENTORY).filter(([, v]) => v < 10).length

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Blood Bank Overview" subtitle={user?.name || 'Inventory & Request Management'} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Droplet} label="Total Units" value={totalUnits} color="blue" />
        <StatCard icon={AlertTriangle} label="Critical Types" value={criticalTypes} trend="Below 10 units" color="red" />
        <StatCard icon={CheckCircle} label="Requests Today" value="7" trend="3 pending" color="amber" />
        <StatCard icon={Building2} label="Active Since" value="2018" color="green" />
      </div>

      {/* Inventory Overview */}
      <Card>
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-semibold text-slate-900">Blood Inventory</h3>
          <Link to="/dashboard/bloodbank/inventory" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
            Manage <ArrowRight size={14} />
          </Link>
        </div>
        <div className="px-5 pb-5 grid grid-cols-4 gap-3">
          {BLOOD_TYPES.map((type) => {
            const units = INVENTORY[type] || 0
            const level = units < 10 ? 'critical' : units < 25 ? 'low' : 'ok'
            const barColor = level === 'critical' ? 'bg-red-500' : level === 'low' ? 'bg-amber-400' : 'bg-green-500'
            const pct = Math.min((units / 80) * 100, 100)
            return (
              <div key={type} className="text-center">
                <span className={`badge ${getBloodTypeColor(type)} font-bold mb-2 block`}>{type}</span>
                <div className="h-16 bg-slate-100 rounded-lg overflow-hidden flex flex-col-reverse">
                  <div className={`${barColor} transition-all duration-500 rounded-lg`} style={{ height: `${pct}%` }} />
                </div>
                <p className="text-xs font-semibold text-slate-700 mt-1">{units}u</p>
                {level === 'critical' && <p className="text-[10px] text-red-600 font-medium">CRITICAL</p>}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Pending Requests */}
      <Card>
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-semibold text-slate-900">Pending Requests</h3>
          <Link to="/dashboard/bloodbank/requests" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {MOCK_REQUESTS.map((req) => (
            <div key={req.id} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className={`badge ${getBloodTypeColor(req.bloodType)} font-bold`}>{req.bloodType}</span>
                <div>
                  <p className="text-sm font-medium text-slate-800">{req.hospital}</p>
                  <p className="text-xs text-slate-500">{req.units} unit(s) needed</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge status={req.urgency === 'emergency' ? 'emergency' : undefined} color="bg-amber-100 text-amber-700">{req.urgency}</Badge>
                <button className="btn-primary text-xs px-3 py-1.5 rounded-lg">Accept</button>
                <button className="btn-outline text-xs px-3 py-1.5 rounded-lg">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default BloodBankDashboard
