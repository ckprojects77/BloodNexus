export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const ROLES = {
  PATIENT: 'patient',
  DONOR: 'donor',
  BLOOD_BANK: 'bloodbank',
  AMBULANCE: 'ambulance',
  ADMIN: 'admin',
}

export const ROLE_LABELS = {
  patient: 'Patient',
  donor: 'Donor',
  bloodbank: 'Blood Bank',
  ambulance: 'Ambulance',
  admin: 'Admin',
}

export const ROLE_DASHBOARDS = {
  patient: '/dashboard/patient',
  donor: '/dashboard/donor',
  bloodbank: '/dashboard/bloodbank',
  ambulance: '/dashboard/ambulance',
  admin: '/dashboard/admin',
}

export const REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  FULFILLED: 'fulfilled',
  EMERGENCY: 'emergency',
}

export const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  fulfilled: 'bg-blue-100 text-blue-700',
  emergency: 'bg-red-600 text-white',
  assigned: 'bg-purple-100 text-purple-700',
  en_route: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
}

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export const getBloodTypeColor = (type) => {
  const colors = {
    'A+': 'bg-red-100 text-red-700',
    'A-': 'bg-red-200 text-red-800',
    'B+': 'bg-orange-100 text-orange-700',
    'B-': 'bg-orange-200 text-orange-800',
    'AB+': 'bg-purple-100 text-purple-700',
    'AB-': 'bg-purple-200 text-purple-800',
    'O+': 'bg-blue-100 text-blue-700',
    'O-': 'bg-blue-200 text-blue-800',
  }
  return colors[type] || 'bg-gray-100 text-gray-700'
}

export const classNames = (...classes) => classes.filter(Boolean).join(' ')
