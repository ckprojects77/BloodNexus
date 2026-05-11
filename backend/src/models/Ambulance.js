import mongoose from 'mongoose'
import { AMBULANCE_STATUS } from '../constants/index.js'

const ambulanceSchema = new mongoose.Schema(
  {
    unitId: {
      type: String,
      unique: true,
      default: () => `AMB-${Date.now().toString(36).toUpperCase()}`,
    },
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    driverName: { type: String, required: true },
    driverPhone: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    vehicleType: {
      type: String,
      enum: ['basic', 'advanced', 'icu'],
      default: 'basic',
    },
    status: {
      type: String,
      enum: Object.values(AMBULANCE_STATUS),
      default: AMBULANCE_STATUS.AVAILABLE,
    },
    currentLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
      address: { type: String },
      updatedAt: { type: Date, default: Date.now },
    },
    activeRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AmbulanceRequest',
      default: null,
    },
    totalTrips: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

ambulanceSchema.index({ 'currentLocation': '2dsphere' })
ambulanceSchema.index({ status: 1, isActive: 1 })

const Ambulance = mongoose.model('Ambulance', ambulanceSchema)
export default Ambulance
