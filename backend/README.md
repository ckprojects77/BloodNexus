# 🩸 BloodLink — Backend API
### AI-Powered Emergency Blood & Ambulance Platform

Production-grade Node.js + Express + MongoDB REST API with Socket.IO real-time events, JWT auth, role-based access, AI chatbot, and full blood/ambulance management.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env .env.local
# Edit .env with your MongoDB URI, JWT secrets, etc.

# 3. Seed demo data (optional)
npm run seed

# 4. Start dev server
npm run dev

# 5. Start production
npm start
```

> API runs at: `http://localhost:5000`  
> Health check: `http://localhost:5000/health`

---

## 🔑 Demo Credentials (after seed)

| Role        | Email                     | Password    |
|-------------|---------------------------|-------------|
| Admin       | admin@bloodlink.app       | Admin@1234  |
| Patient     | patient@bloodlink.app     | Demo@1234   |
| Donor       | donor@bloodlink.app       | Demo@1234   |
| Blood Bank  | bank@bloodlink.app        | Demo@1234   |
| Ambulance   | ambulance@bloodlink.app   | Demo@1234   |

---

## 📁 Folder Structure

```
src/
├── ai/                  # Chatbot service + prompt templates
│   ├── chatbotService.js
│   └── promptTemplates.js
├── config/              # DB + Cloudinary config
├── constants/           # Roles, status enums, HTTP codes
├── controllers/         # Route handlers (thin layer)
├── database/            # Seed script
├── jobs/                # Background cleanup tasks
├── middleware/          # Auth, error handler, rate limiter, upload
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── BloodRequest.js
│   ├── BloodInventory.js
│   ├── Ambulance.js
│   ├── AmbulanceRequest.js
│   ├── DonationHistory.js
│   └── Notification.js
├── routes/              # Express routers
├── services/            # Business logic layer
├── sockets/             # Socket.IO manager
├── utils/               # Logger, JWT, email, geo, async handler
├── validators/          # express-validator rules
├── app.js               # Express app setup
└── server.js            # HTTP + Socket.IO bootstrap
```

---

## 🌐 API Reference

### AUTH
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login + get JWT
POST   /api/auth/logout            Logout (clears refresh token)
POST   /api/auth/refresh           Refresh access token
POST   /api/auth/forgot-password   Send reset email
POST   /api/auth/reset-password    Reset with token
GET    /api/auth/me                Get current user profile
```

### BLOOD REQUESTS
```
POST   /api/request/create         Create emergency blood request
GET    /api/request/my             My requests (patient)
GET    /api/request/all            All requests (admin/bank/ambulance)
GET    /api/request/:id            Single request detail
PATCH  /api/request/cancel/:id     Cancel a request
```

### DONOR
```
GET    /api/donor/nearby           Search nearby donors (public)
GET    /api/donor/profile          My donor profile
PATCH  /api/donor/profile          Update profile
PATCH  /api/donor/availability     Toggle availability
GET    /api/donor/history          Donation history
GET    /api/donor/requests         Nearby emergency requests
```

### BLOOD BANK
```
GET    /api/bank/inventory         View inventory
PATCH  /api/bank/update-stock      Update single blood group stock
PATCH  /api/bank/bulk-stock        Update all blood groups at once
GET    /api/bank/requests          Incoming requests
POST   /api/bank/request/:id/respond  Accept or reject a request
```

### AMBULANCE
```
POST   /api/ambulance/request      Create ambulance request
GET    /api/ambulance/my           My requests
GET    /api/ambulance/all          All requests (admin/ambulance)
PATCH  /api/ambulance/status/:id   Update request status
```

### ADMIN
```
GET    /api/admin/users            All users (paginated + filterable)
PATCH  /api/admin/suspend/:id      Suspend user
PATCH  /api/admin/unsuspend/:id    Reinstate user
DELETE /api/admin/delete/:id       Delete user
GET    /api/admin/analytics        Full platform analytics
```

### AI CHATBOT
```
POST   /api/ai/chat                AI response (OpenAI / Gemini / fallback)
```

---

## 🔌 Socket.IO Events

Connect with:
```js
const socket = io('http://localhost:5000', {
  auth: { token: '<accessToken>' }
})
```

| Event                | Direction      | Description                        |
|----------------------|----------------|------------------------------------|
| `emergency:new`      | Server → Client | New critical blood request         |
| `donor:assigned`     | Server → Client | Donor assigned to request          |
| `ambulance:assigned` | Server → Client | Ambulance assigned                 |
| `ambulance:status`   | Server → Client | Ambulance status changed           |
| `request:completed`  | Server → Client | Request fulfilled                  |
| `notification`       | Server → Client | General user notification          |
| `ambulance:location` | Client → Server | Ambulance sends live GPS update    |
| `join:room`          | Client → Server | Join a specific room               |

---

## 🤖 AI Chatbot Setup

### Option 1: OpenAI
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

### Option 2: Google Gemini
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=AIza...
```

### Option 3: No API key (smart fallback)
The chatbot automatically uses intent-based fallback responses for:
- Emergency blood requests
- Donor guidance
- Finding nearby donors
- General blood bank queries

---

## 📊 Postman Examples

### Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Test@1234",
  "role": "patient",
  "bloodType": "O+",
  "phone": "+91 9876543210"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "patient@bloodlink.app",
  "password": "Demo@1234"
}
```

### Create Blood Request
```json
POST /api/request/create
Authorization: Bearer <token>
{
  "bloodGroup": "O+",
  "units": 2,
  "urgency": "critical",
  "hospital": {
    "name": "KIMS Hospital",
    "address": "Maharanipeta, Vizag",
    "phone": "+91 891 2222222"
  },
  "notes": "Post-surgery — urgent"
}
```

### Update Blood Bank Stock
```json
PATCH /api/bank/update-stock
Authorization: Bearer <token>
{
  "bloodGroup": "O+",
  "units": 45,
  "operation": "set"
}
```

### AI Chat
```json
POST /api/ai/chat
Authorization: Bearer <token>
{
  "message": "I need O+ blood urgently at KIMS hospital",
  "history": []
}
```

### Update Ambulance Status
```json
PATCH /api/ambulance/status/:id
Authorization: Bearer <token>
{
  "status": "en_route",
  "note": "Picked up from blood bank, heading to hospital"
}
```

---

## 🛡️ Security Features

- **Helmet** — HTTP security headers
- **CORS** — Configured for frontend origin only
- **Rate Limiting** — Global (100/15min), Auth (10/15min), Emergency (5/min)
- **MongoDB Sanitize** — Prevents NoSQL injection
- **bcryptjs** — Password hashing (12 rounds)
- **JWT** — Short-lived access tokens (15m) + refresh tokens (7d)
- **Role-based Auth** — Every sensitive route is role-protected
- **Input Validation** — express-validator on all POST/PATCH routes

---

## 🚀 Deployment

### Render / Railway
1. Set environment variables in the dashboard
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add MongoDB Atlas URI to `MONGO_URI`

### VPS (Ubuntu)
```bash
# Install Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Clone & setup
git clone <repo>
cd blood-ambulance-backend
npm install
cp .env.example .env
# Edit .env

# PM2 process manager
npm install -g pm2
pm2 start src/server.js --name bloodlink-api
pm2 save
pm2 startup
```

### Environment Variables Checklist
```
✅ MONGO_URI          — MongoDB Atlas connection string
✅ JWT_ACCESS_SECRET  — Strong random string (32+ chars)
✅ JWT_REFRESH_SECRET — Different strong random string
✅ CLIENT_URL         — Your frontend URL
✅ EMAIL_*            — SMTP credentials for password reset
✅ OPENAI_API_KEY     — Optional: for AI chatbot
✅ CLOUDINARY_*       — Optional: for image uploads
```

---

## 📦 Tech Stack

| Layer        | Technology              |
|--------------|-------------------------|
| Runtime      | Node.js 20+             |
| Framework    | Express.js 4.x          |
| Database     | MongoDB + Mongoose 8    |
| Auth         | JWT (access + refresh)  |
| Real-time    | Socket.IO 4             |
| Validation   | express-validator       |
| Security     | Helmet, CORS, sanitize  |
| Rate limit   | express-rate-limit      |
| Email        | Nodemailer              |
| AI           | OpenAI / Gemini         |
| Uploads      | Multer + Cloudinary     |
| Logging      | Winston                 |
| Process Mgr  | PM2 (production)        |
