import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Droplet, User, Building2, Ambulance, BarChart3,
  Bell, LogOut, Menu, X, Heart, ChevronRight, Settings
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS, classNames } from '../../utils/constants'

const roleNavItems = {
  patient: [
    { to: '/dashboard/patient', icon: Heart, label: 'Overview' },
    { to: '/dashboard/patient/request', icon: Droplet, label: 'Blood Request' },
    { to: '/dashboard/patient/track', icon: BarChart3, label: 'My Requests' },
    { to: '/dashboard/patient/donors', icon: User, label: 'Nearby Donors' },
  ],
  donor: [
    { to: '/dashboard/donor', icon: Heart, label: 'Overview' },
    { to: '/dashboard/donor/profile', icon: User, label: 'My Profile' },
    { to: '/dashboard/donor/requests', icon: Droplet, label: 'Nearby Requests' },
    { to: '/dashboard/donor/history', icon: BarChart3, label: 'Donation History' },
  ],
  bloodbank: [
    { to: '/dashboard/bloodbank', icon: Heart, label: 'Overview' },
    { to: '/dashboard/bloodbank/inventory', icon: Building2, label: 'Inventory' },
    { to: '/dashboard/bloodbank/requests', icon: Droplet, label: 'Requests' },
  ],
  ambulance: [
    { to: '/dashboard/ambulance', icon: Heart, label: 'Overview' },
    { to: '/dashboard/ambulance/requests', icon: Ambulance, label: 'Requests' },
    { to: '/dashboard/ambulance/map', icon: BarChart3, label: 'Live Map' },
  ],
  admin: [
    { to: '/dashboard/admin', icon: BarChart3, label: 'Analytics' },
    { to: '/dashboard/admin/users', icon: User, label: 'Users' },
    { to: '/dashboard/admin/system', icon: Settings, label: 'System' },
  ],
}

const roleColors = {
  patient: 'text-red-600 bg-red-50',
  donor: 'text-rose-600 bg-rose-50',
  bloodbank: 'text-blue-600 bg-blue-50',
  ambulance: 'text-amber-600 bg-amber-50',
  admin: 'text-purple-600 bg-purple-50',
}

const roleIcons = {
  patient: User,
  donor: Heart,
  bloodbank: Building2,
  ambulance: Ambulance,
  admin: BarChart3,
}

const Sidebar = () => {
  const { user, logout, role } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = roleNavItems[role] || []
  const RoleIcon = roleIcons[role] || User

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center">
            <Droplet size={18} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-base tracking-tight">BloodLink</span>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Emergency Platform</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 mx-3 mt-4 rounded-xl bg-slate-50 border border-slate-100">
        <div className="flex items-center gap-3">
          <div className={classNames('w-9 h-9 rounded-xl flex items-center justify-center', roleColors[role])}>
            <RoleIcon size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 text-sm truncate">{user?.name}</p>
            <p className="text-xs text-slate-500">{ROLE_LABELS[role]}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">Navigation</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length === 3}
            className={({ isActive }) =>
              classNames(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-red-50 text-red-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )
            }
            onClick={() => setMobileOpen(false)}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-100 space-y-0.5">
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all">
          <Bell size={17} />
          Notifications
          <span className="ml-auto bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">2</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 transition-all"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-white rounded-xl shadow-card border border-slate-100 flex items-center justify-center text-slate-700"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={classNames(
          'lg:hidden fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-100 z-40 transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  )
}

export default Sidebar
