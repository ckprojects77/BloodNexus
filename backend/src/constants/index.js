// ─── ROLES ─────────────────────────────────────────────────────────────────
export const ROLES = {
  PATIENT: 'patient',
  DONOR: 'donor',
  BLOOD_BANK: 'bloodbank',
  AMBULANCE: 'ambulance',
  ADMIN: 'admin',
}

// ─── BLOOD GROUPS ───────────────────────────────────────────────────────────
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

// ─── REQUEST STATUS ─────────────────────────────────────────────────────────
export const REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  FULFILLED: 'fulfilled',
  CANCELLED: 'cancelled',
  EMERGENCY: 'emergency',
}

// ─── URGENCY LEVELS ─────────────────────────────────────────────────────────
export const URGENCY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
}

// ─── AMBULANCE STATUS ───────────────────────────────────────────────────────
export const AMBULANCE_STATUS = {
  AVAILABLE: 'available',
  ASSIGNED: 'assigned',
  EN_ROUTE: 'en_route',
  REACHED: 'reached',
  COMPLETED: 'completed',
}

// ─── SOCKET EVENTS ──────────────────────────────────────────────────────────
export const SOCKET_EVENTS = {
  EMERGENCY_NEW: 'emergency:new',
  DONOR_ASSIGNED: 'donor:assigned',
  AMBULANCE_ASSIGNED: 'ambulance:assigned',
  AMBULANCE_STATUS: 'ambulance:status',
  REQUEST_COMPLETED: 'request:completed',
  NOTIFICATION: 'notification',
  JOIN_ROOM: 'join:room',
}

// ─── HTTP STATUS CODES ──────────────────────────────────────────────────────
export const HTTP = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
}
