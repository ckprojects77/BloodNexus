import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'

const UnauthorizedPage = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div className="text-center max-w-sm">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <ShieldOff size={28} className="text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
      <p className="text-slate-500 mb-6 text-sm">You don't have permission to view this page.</p>
      <Link to="/" className="btn-primary inline-flex">Go Home</Link>
    </div>
  </div>
)

export default UnauthorizedPage
