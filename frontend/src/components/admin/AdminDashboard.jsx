import React from 'react'
import { Users, Droplet, Ambulance, Building2, TrendingUp, AlertTriangle, BarChart3, Activity } from 'lucide-react'
import { StatCard, Card } from '../ui/index'
import PageHeader from '../layout/PageHeader'
import { BLOOD_TYPES, getBloodTypeColor } from '../../utils/constants'

const ACTIVITY = [
  { label: 'New patient registered', time: '2m ago', type: 'user' },
  { label: 'Emergency request #REQ-089 created', time: '5m ago', type: 'emergency' },
  { label: 'Blood Bank "City Blood Center" updated inventory', time: '12m ago', type: 'bank' },
  { label: 'Ambulance UNIT-02 completed mission AMB-045', time: '18m ago', type: 'ambulance' },
  { label: 'Donor Priya S. responded to emergency', time: '25m ago', type: 'donor' },
]

const REQUESTS_BY_TYPE = { 'A+': 23, 'B+': 18, 'O+': 45, 'AB+': 12, 'A-': 5, 'B-': 3, 'O-': 8, 'AB-': 2 }
const MAX = Math.max(...Object.values(REQUESTS_BY_TYPE))

const AdminDashboard = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Admin Analytics" subtitle="System-wide overview and management" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value="1,284" trend="+12 today" color="blue" />
        <StatCard icon={Droplet} label="Requests Today" value="47" trend="8 emergency" color="red" />
        <StatCard icon={Building2} label="Blood Banks" value="23" trend="Active" color="purple" />
        <StatCard icon={Ambulance} label="Active Units" value="8" trend="3 en route" color="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Requests by blood type */}
        <Card>
          <div className="px-5 pt-5 pb-3 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Requests by Blood Type</h3>
            <p className="text-slate-500 text-xs mt-0.5">This month</p>
          </div>
          <div className="p-5 space-y-3">
            {Object.entries(REQUESTS_BY_TYPE).map(([type, count]) => (
              <div key={type} className="flex items-center gap-3">
                <span className={`badge ${getBloodTypeColor(type)} font-bold w-12 justify-center flex-shrink-0`}>{type}</span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${(count / MAX) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-700 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="px-5 pt-5 pb-3 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Recent Activity</h3>
          </div>
          <div className="p-5 space-y-3">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.type === 'emergency' ? 'bg-red-500' : a.type === 'ambulance' ? 'bg-amber-500' : a.type === 'bank' ? 'bg-blue-500' : 'bg-green-500'}`} />
                <div>
                  <p className="text-sm text-slate-700">{a.label}</p>
                  <p className="text-xs text-slate-400">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* User breakdown */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-900 mb-4">User Distribution</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Patients', count: 756, color: 'bg-red-100 text-red-700', pct: 59 },
            { label: 'Donors', count: 312, color: 'bg-rose-100 text-rose-700', pct: 24 },
            { label: 'Blood Banks', count: 23, color: 'bg-blue-100 text-blue-700', pct: 2 },
            { label: 'Ambulance', count: 45, color: 'bg-amber-100 text-amber-700', pct: 4 },
            { label: 'Admins', count: 8, color: 'bg-purple-100 text-purple-700', pct: 1 },
          ].map(({ label, count, color, pct }) => (
            <div key={label} className={`rounded-xl p-4 text-center ${color}`}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs font-medium mt-0.5">{label}</p>
              <p className="text-xs opacity-70">{pct}%</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default AdminDashboard
