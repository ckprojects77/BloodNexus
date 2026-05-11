import mongoose from 'mongoose'
import { BLOOD_GROUPS } from '../constants/index.js'

const donationHistorySchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodRequest',
      default: null,
    },
    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      required: true,
    },
    units: { type: Number, default: 1 },
    donatedAt: { type: Date, default: Date.now },
    hospital: {
      name: String,
      address: String,
    },
    certificateId: {
      type: String,
      default: () => `CERT-${Date.now().toString(36).toUpperCase()}`,
    },
    notes: String,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
)

donationHistorySchema.index({ donor: 1, donatedAt: -1 })
donationHistorySchema.index({ bloodRequest: 1 })

const DonationHistory = mongoose.model('DonationHistory', donationHistorySchema)
export default DonationHistory
