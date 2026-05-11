import React from 'react'
import { Ambulance, Clock, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatCard, Card, Badge } from '../ui/index'
import PageHeader from '../layout/PageHeader'
import { formatRelativeTime } from '../../utils/constants'

const REQUESTS = [
  { id: 'AMB001', patient: 'Patient A', from: 'KIMS Hospital', to: 'Apollo Blood Bank', status: 'assigned', time: new Date(Date.now() - 600000), urgency: 'emergency' },
  { id: 'AMB002', patient: 'Patient B', from: 'City Clinic', to: 'Red Cross', status: 'en_route', time: new Date(Date.now() - 1800000), urgency: 'urgent' },
  { id: 'AMB003', patient: 'Patient C', from: 'Sunrise Medical', to: 'KIMS', status: 'completed', time: new Date(Date.now() - 7200000), urgency: 'normal' },
]

const AmbulanceDashboard = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Ambulance Command" subtitle="Track and manage emergency response units" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Ambulance} label="Total Requests" value="24" color="amber" />
        <StatCard icon={AlertTriangle} label="Active Now" value="2" trend="En route" color="red" />
        <StatCard icon={Clock} label="Avg Response" value="8m" trend="This week" color="blue" />
        <StatCard icon={CheckCircle} label="Completed" value="21" trend="This month" color="green" />
      </div>

      <Card>
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-semibold text-slate-900">Recent Requests</h3>
          <Link to="/dashboard/ambulance/requests" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {REQUESTS.map((req) => (
            <div key={req.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${req.status === 'en_route' ? 'bg-blue-100' : req.status === 'assigned' ? 'bg-amber-100' : 'bg-green-100'}`}>
                    <Ambulance size={16} className={req.status === 'en_route' ? 'text-blue-600' : req.status === 'assigned' ? 'text-amber-600' : 'text-green-600'} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{req.id} — {req.patient}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{req.from} → {req.to}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatRelativeTime(req.time)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge status={req.status}>{req.status.replace('_', ' ')}</Badge>
                  <Badge status={req.urgency === 'emergency' ? 'emergency' : undefined}
                    color={req.urgency === 'urgent' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}>
                    {req.urgency}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default AmbulanceDashboard
