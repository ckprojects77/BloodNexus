import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLE_DASHBOARDS } from '../utils/constants'

// Layout
import DashboardLayout from '../components/layout/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'

// Auth pages
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import LandingPage from '../pages/LandingPage'
import UnauthorizedPage from '../pages/UnauthorizedPage'

// Patient pages
import PatientDashboard from '../components/patient/PatientDashboard'
import BloodRequest from '../components/patient/BloodRequest'
import TrackRequests from '../components/patient/TrackRequests'
import NearbyDonors from '../components/patient/NearbyDonors'

// Donor pages
import DonorDashboard from '../components/donor/DonorDashboard'
import DonorProfile from '../components/donor/DonorProfile'
import NearbyRequests from '../components/donor/NearbyRequests'
import DonationHistory from '../components/donor/DonationHistory'

// Blood Bank pages
import BloodBankDashboard from '../components/bloodbank/BloodBankDashboard'
import Inventory from '../components/bloodbank/Inventory'
import BankRequests from '../components/bloodbank/BankRequests'

// Ambulance pages
import AmbulanceDashboard from '../components/ambulance/AmbulanceDashboard'
import AmbulanceRequests from '../components/ambulance/AmbulanceRequests'
import AmbulanceMap from '../components/ambulance/AmbulanceMap'

// Admin pages
import AdminDashboard from '../components/admin/AdminDashboard'
import UserManagement from '../components/admin/UserManagement'
import SystemOverview from '../components/admin/SystemOverview'

const RoleRedirect = () => {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={ROLE_DASHBOARDS[role] || '/login'} replace />
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/redirect" element={<RoleRedirect />} />

      {/* Patient */}
      <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/patient" element={<PatientDashboard />} />
          <Route path="/dashboard/patient/request" element={<BloodRequest />} />
          <Route path="/dashboard/patient/track" element={<TrackRequests />} />
          <Route path="/dashboard/patient/donors" element={<NearbyDonors />} />
        </Route>
      </Route>

      {/* Donor */}
      <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/donor" element={<DonorDashboard />} />
          <Route path="/dashboard/donor/profile" element={<DonorProfile />} />
          <Route path="/dashboard/donor/requests" element={<NearbyRequests />} />
          <Route path="/dashboard/donor/history" element={<DonationHistory />} />
        </Route>
      </Route>

      {/* Blood Bank */}
      <Route element={<ProtectedRoute allowedRoles={['bloodbank']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/bloodbank" element={<BloodBankDashboard />} />
          <Route path="/dashboard/bloodbank/inventory" element={<Inventory />} />
          <Route path="/dashboard/bloodbank/requests" element={<BankRequests />} />
        </Route>
      </Route>

      {/* Ambulance */}
      <Route element={<ProtectedRoute allowedRoles={['ambulance']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/ambulance" element={<AmbulanceDashboard />} />
          <Route path="/dashboard/ambulance/requests" element={<AmbulanceRequests />} />
          <Route path="/dashboard/ambulance/map" element={<AmbulanceMap />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/users" element={<UserManagement />} />
          <Route path="/dashboard/admin/system" element={<SystemOverview />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
