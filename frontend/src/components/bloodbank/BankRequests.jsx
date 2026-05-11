import React, { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import PageHeader from '../layout/PageHeader'
import { Card, Badge, Table, Tr, Td } from '../ui/index'
import { useNotification } from '../../context/NotificationContext'
import { getBloodTypeColor, formatRelativeTime } from '../../utils/constants'

const INITIAL_REQUESTS = [
  { id: 'REQ001', bloodType: 'O+', units: 2, hospital: 'KIMS Hospital', contact: '+91 98765 43210', urgency: 'emergency', status: 'pending', time: new Date(Date.now() - 600000) },
  { id: 'REQ002', bloodType: 'A+', units: 1, hospital: 'Apollo Clinic', contact: '+91 87654 32109', urgency: 'urgent', status: 'pending', time: new Date(Date.now() - 3600000) },
  { id: 'REQ003', bloodType: 'B-', units: 3, hospital: 'City Hospital', contact: '+91 76543 21098', urgency: 'normal', status: 'accepted', time: new Date(Date.now() - 7200000) },
  { id: 'REQ004', bloodType: 'AB+', units: 1, hospital: 'Sunrise Medical', contact: '+91 65432 10987', urgency: 'normal', status: 'rejected', time: new Date(Date.now() - 86400000) },
]

const BankRequests = () => {
  const { addNotification } = useNotification()
  const [requests, setRequests] = useState(INITIAL_REQUESTS)

  const respond = (id, action) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r))
    addNotification(`Request ${action} successfully`, action === 'accepted' ? 'success' : 'warning')
  }

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader title="Blood Requests" subtitle="Accept or reject incoming requests" />

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', count: requests.filter(r => r.status === 'pending').length, color: 'bg-amber-50 text-amber-700' },
          { label: 'Accepted', count: requests.filter(r => r.status === 'accepted').length, color: 'bg-green-50 text-green-700' },
          { label: 'Rejected', count: requests.filter(r => r.status === 'rejected').length, color: 'bg-red-50 text-red-700' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`card text-center py-4 ${color}`}>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-sm font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <Card>
        <Table headers={['Request ID', 'Blood Type', 'Units', 'Hospital', 'Urgency', 'Time', 'Status', 'Actions']}>
          {requests.map((req) => (
            <Tr key={req.id}>
              <Td><span className="font-mono text-xs text-slate-500">{req.id}</span></Td>
              <Td><span className={`badge ${getBloodTypeColor(req.bloodType)} font-bold`}>{req.bloodType}</span></Td>
              <Td className="font-medium">{req.units}</Td>
              <Td className="font-medium">{req.hospital}</Td>
              <Td>
                <Badge status={req.urgency === 'emergency' ? 'emergency' : undefined}
                  color={req.urgency === 'urgent' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}>
                  {req.urgency}
                </Badge>
              </Td>
              <Td className="text-xs text-slate-500 whitespace-nowrap">{formatRelativeTime(req.time)}</Td>
              <Td><Badge status={req.status}>{req.status}</Badge></Td>
              <Td>
                {req.status === 'pending' && (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => respond(req.id, 'accepted')}
                      className="w-7 h-7 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg flex items-center justify-center transition-colors"
                      title="Accept"
                    >
                      <CheckCircle size={14} />
                    </button>
                    <button
                      onClick={() => respond(req.id, 'rejected')}
                      className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors"
                      title="Reject"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}

export default BankRequests
