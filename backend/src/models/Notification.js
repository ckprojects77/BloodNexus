import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'emergency_request',
        'request_accepted',
        'request_rejected',
        'request_fulfilled',
        'ambulance_assigned',
        'ambulance_status',
        'low_stock',
        'system',
        'welcome',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
)

notificationSchema.index({ recipient: 1, isRead: 1 })
notificationSchema.index({ createdAt: -1 })

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification
