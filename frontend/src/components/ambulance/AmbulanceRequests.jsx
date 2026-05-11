import React, { useState } from 'react'
import { Ambulance, MapPin, Clock } from 'lucide-react'
import PageHeader from '../layout/PageHeader'
import { Card, Badge, Table, Tr, Td } from '../ui/index'
import { useNotification } from '../../context/NotificationContext'
import { formatRelativeTime } from '../../utils/constants'

const STATUSES = ['assigned', 'en_route', 'completed']

const INITIAL = [
  { id: 'AMB001', patient: 'Ravi K.', from: 'KIMS Hospital', to: 'Apollo Blood Bank', status: 'assigned', time: new Date(Date.now() - 600000), urgency: 'emergency', driver: 'Suresh D.' },
  { id: 'AMB002', patient: 'Meena P.', from: 'City Clinic', to: 'Red Cross', status: 'en_route', time: new Date(Date.now() - 1800000), urgency: 'urgent', driver: 'Arjun R.' },
  { id: 'AMB003', patient: 'Priya S.', from: 'Sunrise Medical', to: 'KIMS', status: 'completed', time: new Date(Date.now() - 7200000), urgency: 'normal', driver: 'Kumar V.' },
]

const AmbulanceRequests = () => {
  const { addNotification } = useNotification()
  const [requests, setRequests] = useState(INITIAL)

  const updateStatus = (id, status) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    addNotification(`Status updated to "${status}"`, 'success')
  }

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader title="Ambulance Requests" subtitle="Manage all emergency transport requests" />

      <Card>
        <Table headers={['ID', 'Patient', 'From', 'To', 'Driver', 'Urgency', 'Time', 'Status', 'Update']}>
          {requests.map((req) => (
            <Tr key={req.id}>
              <Td><span className="font-mono text-xs">{req.id}</span></Td>
              <Td className="font-medium">{req.patient}</Td>
              <Td className="text-xs text-slate-500 max-w-[120px] truncate">{req.from}</Td>
              <Td className="text-xs text-slate-500 max-w-[120px] truncate">{req.to}</Td>
              <Td className="text-xs">{req.driver}</Td>
              <Td>
                <Badge status={req.urgency === 'emergency' ? 'emergency' : undefined}
                  color={req.urgency === 'urgent' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}>
                  {req.urgency}
                </Badge>
              </Td>
              <Td className="text-xs text-slate-500 whitespace-nowrap">{formatRelativeTime(req.time)}</Td>
              <Td><Badge status={req.status}>{req.status.replace('_', ' ')}</Badge></Td>
              <Td>
                <select
                  value={req.status}
                  onChange={(e) => updateStatus(req.id, e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}

export default AmbulanceRequests
