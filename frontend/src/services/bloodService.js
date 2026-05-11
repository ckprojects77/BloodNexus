import api from './api'

export const requestService = {
  create: (data) => api.post('/request/create', data),
  getMyRequests: () => api.get('/request/my'),
  getAll: () => api.get('/request/all'),
  updateStatus: (id, status) => api.patch(`/request/${id}/status`, { status }),
  getNearbyDonors: (params) => api.get('/donor/nearby', { params }),
}

export const donorService = {
  getProfile: () => api.get('/donor/profile'),
  updateAvailability: (available) => api.patch('/donor/availability', { available }),
  getNearbyRequests: () => api.get('/donor/requests'),
  getDonationHistory: () => api.get('/donor/history'),
}

export const bloodBankService = {
  getInventory: () => api.get('/bank/inventory'),
  updateStock: (bloodType, units) => api.patch('/bank/inventory', { bloodType, units }),
  getRequests: () => api.get('/bank/requests'),
  respondToRequest: (id, action) => api.post(`/bank/request/${id}/${action}`),
}

export const ambulanceService = {
  createRequest: (data) => api.post('/ambulance/request', data),
  getRequests: () => api.get('/ambulance/requests'),
  updateStatus: (id, status) => api.patch(`/ambulance/request/${id}`, { status }),
}

export const adminService = {
  getUsers: () => api.get('/admin/users'),
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}`, { status }),
  getAnalytics: () => api.get('/admin/analytics'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
}

export const aiService = {
  chat: (message, history = []) =>
    api.post('/ai/chat', { message, history }),
}
