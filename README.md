# 🩸 BloodNexus
### AI-Powered Emergency Blood & Ambulance Platform

> *Connecting donors, patients, blood banks and ambulances in real-time — saving lives every second.*

![BloodNexus Banner](https://img.shields.io/badge/BloodNexus-Emergency%20Platform-red?style=for-the-badge&logo=heart&logoColor=white)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-8-green?style=for-the-badge&logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-black?style=for-the-badge&logo=socketdotio)

---

## 🚨 What is BloodNexus?

BloodNexus is a full-stack AI-powered emergency blood management platform that connects:

- 🧑‍⚕️ **Patients** — Request blood urgently with one tap
- 🩸 **Donors** — Respond to nearby emergencies instantly
- 🏥 **Blood Banks** — Manage inventory and requests in real-time
- 🚑 **Ambulances** — Dispatch and track emergency vehicles live
- 👨‍💼 **Admins** — Monitor the entire platform with analytics

---

## ✨ Features

- 🔐 JWT Authentication with Role-Based Access Control
- 🚨 Emergency SOS Button — broadcasts to all nearby donors instantly
- 🤖 AI Chatbot — powered by OpenAI / Gemini with smart fallback
- 📡 Real-time updates via Socket.IO
- 🗺️ Nearby donor & blood bank search
- 📊 Admin analytics dashboard
- 🏥 Blood inventory management (A+, A-, B+, B-, O+, O-, AB+, AB-)
- 🚑 Ambulance dispatch & live status tracking
- 📧 Email notifications for password reset
- 📱 Fully responsive UI

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 + Vite | UI Framework |
| Tailwind CSS | Styling |
| React Router DOM | Navigation |
| Axios | API calls |
| Lucide React | Icons |
| Socket.IO Client | Real-time |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 20 | Runtime |
| Express.js | Framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Socket.IO | Real-time events |
| bcryptjs | Password hashing |
| Nodemailer | Emails |
| Winston | Logging |
| OpenAI / Gemini | AI Chatbot |

---

## 📁 Project Structure

```
BloodNexus/
├── frontend/          # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── services/
│       ├── routes/
│       └── utils/
└── backend/           # Node.js + Express backend
    └── src/
        ├── controllers/
        ├── models/
        ├── routes/
        ├── services/
        ├── middleware/
        ├── sockets/
        ├── ai/
        └── utils/
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/BloodNexus.git
cd BloodNexus
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env .env.local
# Edit .env with your MongoDB URI and JWT secrets
npm run seed    # seed demo data
npm run dev     # starts on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev     # starts on http://localhost:5173
```

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 👨‍💼 Admin | admin@bloodlink.app | Admin@1234 |
| 🧑‍⚕️ Patient | patient@bloodlink.app | Demo@1234 |
| 🩸 Donor | donor@bloodlink.app | Demo@1234 |
| 🏥 Blood Bank | bank@bloodlink.app | Demo@1234 |
| 🚑 Ambulance | ambulance@bloodlink.app | Demo@1234 |

---

## 🌐 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/request/create
GET    /api/donor/nearby
GET    /api/bank/inventory
POST   /api/ambulance/request
GET    /api/admin/analytics
POST   /api/ai/chat
```

> Full API docs in `/backend/README.md`

---

## 📡 Socket.IO Events

| Event | Description |
|-------|-------------|
| `emergency:new` | New critical blood request |
| `ambulance:assigned` | Ambulance dispatched |
| `ambulance:status` | Status update |
| `request:completed` | Request fulfilled |
| `notification` | User notification |

---

## 🤖 AI Chatbot

Supports:
- **OpenAI GPT** — set `OPENAI_API_KEY` in `.env`
- **Google Gemini** — set `GEMINI_API_KEY` in `.env`
- **Smart Fallback** — works with no API key

---

## 🚀 Deployment

| Service | Platform | Cost |
|---------|----------|------|
| Frontend | Vercel | Free |
| Backend | Render | Free |
| Database | MongoDB Atlas | Free |

---

## 👨‍💻 Author

**Chaitanya**
- GitHub: [@ckprojects77](https://github.com/ckprojects77)

---

## 📄 License

MIT License — feel free to use and modify!

---

<div align="center">
  <strong>🩸 Built with ❤️ to save lives</strong>
</div>
