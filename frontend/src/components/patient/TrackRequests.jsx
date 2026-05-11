import React, { useState } from 'react'
import { Droplet, Clock, CheckCircle, XCircle, Search } from 'lucide-react'
import PageHeader from '../layout/PageHeader'
import { Card, Badge, Table, Tr, Td, EmptyState } from '../ui/index'
import { formatDate, getBloodTypeColor } from '../../utils/constants'

const MOCK = [
  { id: 'REQ001', bloodType: 'O+', units: 2, status: 'pending', hospital: 'KIMS Hospital', createdAt: new Date(Date.now() - 3600000), urgency: 'urgent' },
  { id: 'REQ002', bloodType: 'O+', units: 1, status: 'accepted', hospital: 'Apollo Clinic', createdAt: new Date(Date.now() - 86400000), urgency: 'normal' },
  { id: 'REQ003', bloodType: 'O+', units: 3, status: 'fulfilled', hospital: 'City Hospital', createdAt: new Date(Date.now() - 172800000), urgency: 'emergency' },
  { id: 'REQ004', bloodType: 'O+', units: 1, status: 'rejected', hospital: 'Sunrise Medical', createdAt: new Date(Date.now() - 259200000), urgency: 'normal' },
]

const FILTERS = ['all', 'pending', 'accepted', 'fulfilled', 'rejected']

const TrackRequests = () => {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = MOCK.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false
    if (search && !r.hospital.toLowerCase().includes(search.toLowerCase()) && !r.bloodType.includes(search)) return false
    return true
  })

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader title="My Requests" subtitle="Track all your blood requests" />

      {/* Status summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: MOCK.length, color: 'text-slate-900', bg: 'bg-slate-100' },
          { label: 'Pending', value: MOCK.filter(r => r.status === 'pending').length, color: 'text-amber-700', bg: 'bg-amber-100' },
          { label: 'Accepted', value: MOCK.filter(r => r.status === 'accepted').length, color: 'text-green-700', bg: 'bg-green-100' },
          { label: 'Fulfilled', value: MOCK.filter(r => r.status === 'fulfilled').length, color: 'text-blue-700', bg: 'bg-blue-100' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className={`text-xs font-medium ${color} opacity-80`}>{label}</p>
          </div>
        ))}
      </div>

      <Card>
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative sm:ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests..."
              className="pl-8 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Droplet} title="No requests found" description="No blood requests match your current filter" />
        ) : (
          <Table headers={['Request ID', 'Blood Type', 'Units', 'Hospital', 'Urgency', 'Date', 'Status']}>
            {filtered.map((req) => (
              <Tr key={req.id}>
                <Td><span className="font-mono text-xs text-slate-500">{req.id}</span></Td>
                <Td>
                  <span className={`badge ${getBloodTypeColor(req.bloodType)} font-bold`}>{req.bloodType}</span>
                </Td>
                <Td>{req.units}</Td>
                <Td className="font-medium">{req.hospital}</Td>
                <Td>
                  <Badge status={req.urgency === 'emergency' ? 'emergency' : undefined}
                    color={req.urgency === 'urgent' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}>
                    {req.urgency}
                  </Badge>
                </Td>
                <Td className="text-xs text-slate-500 whitespace-nowrap">{formatDate(req.createdAt)}</Td>
                <Td><Badge status={req.status}>{req.status}</Badge></Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  )
}

export default TrackRequests
