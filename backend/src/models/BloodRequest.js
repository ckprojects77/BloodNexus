import mongoose from 'mongoose'
import { BLOOD_GROUPS, REQUEST_STATUS, URGENCY } from '../constants/index.js'

const bloodRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      unique: true,
      default: () => `REQ-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      required: [true, 'Blood group is required'],
    },
    units: {
      type: Number,
      required: true,
      min: [1, 'Minimum 1 unit required'],
      max: [10, 'Maximum 10 units per request'],
    },
    urgency: {
      type: String,
      enum: Object.values(URGENCY),
      default: URGENCY.MEDIUM,
    },
    status: {
      type: String,
      enum: Object.values(REQUEST_STATUS),
      default: REQUEST_STATUS.PENDING,
    },
    hospital: {
      name: { type: String, required: true },
      address: { type: String },
      phone: { type: String },
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
      address: { type: String },
    },
    assignedDonor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedAmbulance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ambulance',
      default: null,
    },
    assignedBloodBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    notes: { type: String, maxlength: 500 },
    cancelReason: { type: String },
    fulfilledAt: { type: Date },
    notifiedDonors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    responseHistory: [
      {
        action: String,
        by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        at: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

// ── Indexes ──────────────────────────────────────────────────────────────────
bloodRequestSchema.index({ location: '2dsphere' })
bloodRequestSchema.index({ status: 1, urgency: 1 })
bloodRequestSchema.index({ patient: 1 })
bloodRequestSchema.index({ bloodGroup: 1, status: 1 })
bloodRequestSchema.index({ createdAt: -1 })

const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema)
export default BloodRequest
