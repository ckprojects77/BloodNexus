import mongoose from 'mongoose'
import { AMBULANCE_STATUS, URGENCY } from '../constants/index.js'

const ambulanceRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      unique: true,
      default: () => `AMBR-${Date.now()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodRequest',
      default: null,
    },
    assignedAmbulance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ambulance',
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(AMBULANCE_STATUS),
      default: AMBULANCE_STATUS.ASSIGNED,
    },
    urgency: {
      type: String,
      enum: Object.values(URGENCY),
      default: URGENCY.HIGH,
    },
    pickup: {
      address: String,
      coordinates: { type: [Number], default: [0, 0] },
    },
    destination: {
      name: String,
      address: String,
      coordinates: { type: [Number], default: [0, 0] },
    },
    patientName: String,
    patientPhone: String,
    notes: String,
    estimatedArrival: Date,
    completedAt: Date,
    statusHistory: [
      {
        status: String,
        at: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
)

ambulanceRequestSchema.index({ requestedBy: 1 })
ambulanceRequestSchema.index({ status: 1 })
ambulanceRequestSchema.index({ createdAt: -1 })

const AmbulanceRequest = mongoose.model('AmbulanceRequest', ambulanceRequestSchema)
export default AmbulanceRequest
