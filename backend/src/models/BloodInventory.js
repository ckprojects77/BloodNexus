import mongoose from 'mongoose'
import { BLOOD_GROUPS } from '../constants/index.js'

const bloodStockSchema = new mongoose.Schema({
  bloodGroup: { type: String, enum: BLOOD_GROUPS, required: true },
  units: { type: Number, default: 0, min: 0 },
  minThreshold: { type: Number, default: 10 },
  lastUpdated: { type: Date, default: Date.now },
  expiryAlerts: [{ units: Number, expiresAt: Date }],
})

const bloodInventorySchema = new mongoose.Schema(
  {
    bloodBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    stock: [bloodStockSchema],
    address: { type: String },
    phone: { type: String },
    operatingHours: { type: String, default: '24/7' },
    isAcceptingRequests: { type: Boolean, default: true },
    totalDonationsReceived: { type: Number, default: 0 },
    totalRequestsFulfilled: { type: Number, default: 0 },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  { timestamps: true }
)

// ── Indexes ──────────────────────────────────────────────────────────────────
bloodInventorySchema.index({ location: '2dsphere' })
bloodInventorySchema.index({ bloodBank: 1 })

// ── Virtual: low stock types ─────────────────────────────────────────────────
bloodInventorySchema.virtual('lowStockTypes').get(function () {
  return this.stock.filter((s) => s.units <= s.minThreshold).map((s) => s.bloodGroup)
})

// ── Method: get units for a blood group ─────────────────────────────────────
bloodInventorySchema.methods.getUnits = function (bloodGroup) {
  const item = this.stock.find((s) => s.bloodGroup === bloodGroup)
  return item ? item.units : 0
}

// ── Method: update stock ─────────────────────────────────────────────────────
bloodInventorySchema.methods.adjustStock = function (bloodGroup, delta) {
  const item = this.stock.find((s) => s.bloodGroup === bloodGroup)
  if (!item) {
    this.stock.push({ bloodGroup, units: Math.max(0, delta) })
  } else {
    item.units = Math.max(0, item.units + delta)
    item.lastUpdated = new Date()
  }
}

const BloodInventory = mongoose.model('BloodInventory', bloodInventorySchema)
export default BloodInventory
