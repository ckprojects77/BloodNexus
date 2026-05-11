import React, { useState } from 'react'
import { Search, Trash2, UserX, UserCheck, Filter } from 'lucide-react'
import PageHeader from '../layout/PageHeader'
import { Card, Badge, Table, Tr, Td } from '../ui/index'
import { useNotification } from '../../context/NotificationContext'
import { formatDate, ROLE_LABELS, getBloodTypeColor } from '../../utils/constants'

const MOCK_USERS = [
  { id: 1, name: 'Ravi Kumar', email: 'ravi@demo.com', role: 'patient', bloodType: 'O+', status: 'active', joined: new Date(Date.now() - 2592000000) },
  { id: 2, name: 'Priya Sharma', email: 'priya@demo.com', role: 'donor', bloodType: 'A+', status: 'active', joined: new Date(Date.now() - 5184000000) },
  { id: 3, name: 'City Blood Bank', email: 'city@bank.com', role: 'bloodbank', bloodType: null, status: 'active', joined: new Date(Date.now() - 7776000000) },
  { id: 4, name: 'Emergency Ambulance Co.', email: 'amb@demo.com', role: 'ambulance', bloodType: null, status: 'suspended', joined: new Date(Date.now() - 10368000000) },
  { id: 5, name: 'Arjun Reddy', email: 'arjun@demo.com', role: 'patient', bloodType: 'B-', status: 'active', joined: new Date(Date.now() - 1296000000) },
]

const ROLE_FILTERS = ['all', 'patient', 'donor', 'bloodbank', 'ambulance', 'admin']

const UserManagement = () => {
  const { addNotification } = useNotification()
  const [users, setUsers] = useState(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u))
    addNotification('User status updated', 'success')
  }

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id))
    addNotification('User removed', 'warning')
  }

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader title="User Management" subtitle={`${users.length} total users`} />

      <Card>
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1.5 flex-wrap">
            {ROLE_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setRoleFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${roleFilter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {f === 'all' ? 'All Roles' : ROLE_LABELS[f]}
              </button>
            ))}
          </div>
          <div className="relative sm:ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-8 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-52"
            />
          </div>
        </div>

        <Table headers={['Name', 'Email', 'Role', 'Blood Type', 'Status', 'Joined', 'Actions']}>
          {filtered.map((user) => (
            <Tr key={user.id}>
              <Td className="font-medium">{user.name}</Td>
              <Td className="text-slate-500 text-xs">{user.email}</Td>
              <Td>
                <Badge color="bg-slate-100 text-slate-700">{ROLE_LABELS[user.role]}</Badge>
              </Td>
              <Td>
                {user.bloodType ? (
                  <span className={`badge ${getBloodTypeColor(user.bloodType)} font-bold`}>{user.bloodType}</span>
                ) : <span className="text-slate-300">—</span>}
              </Td>
              <Td>
                <Badge color={user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  {user.status}
                </Badge>
              </Td>
              <Td className="text-xs text-slate-500 whitespace-nowrap">{formatDate(user.joined)}</Td>
              <Td>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${user.status === 'active' ? 'bg-amber-50 hover:bg-amber-100 text-amber-600' : 'bg-green-50 hover:bg-green-100 text-green-600'}`}
                    title={user.status === 'active' ? 'Suspend' : 'Activate'}
                  >
                    {user.status === 'active' ? <UserX size={13} /> : <UserCheck size={13} />}
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}

export default UserManagement
