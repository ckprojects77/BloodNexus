# 🩸 BloodLink — AI-Powered Emergency Blood Platform

A production-grade React frontend for a blood ambulance emergency response system with AI chatbot, role-based dashboards, and real-time request management.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

> App runs at: `http://localhost:5173`

---

## 🔐 Demo Accounts (No Backend Needed)

Click any demo account on the login page:

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@demo.com | demo123 |
| Donor | donor@demo.com | demo123 |
| Blood Bank | bank@demo.com | demo123 |
| Ambulance | amb@demo.com | demo123 |
| Admin | admin@demo.com | demo123 |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/             # Button, Input, Card, Badge, Modal, Table, Toast
│   ├── layout/         # Sidebar, DashboardLayout, PageHeader
│   ├── chatbot/        # ChatbotWidget (AI-powered)
│   ├── patient/        # Dashboard, BloodRequest, TrackRequests, NearbyDonors
│   ├── donor/          # Dashboard, Profile, NearbyRequests, DonationHistory
│   ├── bloodbank/      # Dashboard, Inventory, BankRequests
│   ├── ambulance/      # Dashboard, Requests, Map
│   └── admin/          # Dashboard, UserManagement, SystemOverview
├── pages/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── UnauthorizedPage.jsx
├── routes/
│   ├── AppRoutes.jsx   # Full route config
│   └── ProtectedRoute.jsx
├── context/
│   ├── AuthContext.jsx     # JWT auth, user state
│   └── NotificationContext.jsx
├── services/
│   ├── api.js          # Axios instance with interceptors
│   ├── authService.js
│   └── bloodService.js # All domain services
└── utils/
    ├── constants.js    # Blood types, roles, helpers
    └── hooks.js        # useAsync, useDebounce, useLocalStorage
```

---

## 🌐 Backend Integration

Update the base URL in `src/services/api.js`:

```js
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})
```

### API Endpoints Expected:
- `POST /auth/login` → `{ token, user: { id, name, email, role, bloodType } }`
- `POST /auth/register` → `{ token, user }`
- `POST /request/create`
- `GET /donor/nearby`
- `GET /bank/inventory`
- `POST /ambulance/request`
- `POST /ai/chat` → `{ message: string }`

---

## 🤖 AI Chatbot

The chatbot (`ChatbotWidget`) connects to `POST /api/ai/chat`. In demo mode, it includes intelligent fallback responses for:
- "I need blood urgently"
- "Find nearest donor"
- "Emergency help"
- "Blood bank nearby"

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Emergency Red | `#DC2626` |
| Action Blue | `#2563EB` |
| Background | `#f8fafc` |
| Font | DM Sans |

---

## 🛠 Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS 3**
- **React Router DOM 6**
- **Axios** (with JWT interceptors)
- **Lucide React** icons

---

## 📦 Build Output

```
dist/assets/index.css   ~40 kB (gzip: 6.6 kB)
dist/assets/index.js   ~316 kB (gzip: 93 kB)
```
