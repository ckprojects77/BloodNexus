import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { ROLES, BLOOD_GROUPS } from '../constants/index.js'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.PATIENT,
    },
    phone: { type: String, trim: true },
    bloodType: {
      type: String,
      enum: [...BLOOD_GROUPS, null],
      default: null,
    },
    location: {
      address: { type: String },
      city: { type: String },
      state: { type: String },
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
      },
    },
    avatar: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isSuspended: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },

    // Donor-specific
    isAvailable: { type: Boolean, default: false },
    lastDonated: { type: Date, default: null },
    totalDonations: { type: Number, default: 0 },
    weight: { type: Number },
    age: { type: Number },

    // Auth tokens
    refreshToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    // Push / notification prefs
    notificationsEnabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// ── Indexes ─────────────────────────────────────────────────────────────────
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ 'location.coordinates': '2dsphere' })
userSchema.index({ bloodType: 1, isAvailable: 1, isSuspended: 1 })

// ── Pre-save: hash password ──────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12
  this.password = await bcrypt.hash(this.password, rounds)
  next()
})

// ── Instance method: compare password ────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// ── Virtual: public safe profile ─────────────────────────────────────────────
userSchema.methods.toPublicProfile = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.refreshToken
  delete obj.passwordResetToken
  delete obj.passwordResetExpires
  return obj
}

const User = mongoose.model('User', userSchema)
export default User
