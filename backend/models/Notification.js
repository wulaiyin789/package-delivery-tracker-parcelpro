const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment'
    },
    type: { type: String, enum: ['EMAIL', 'SMS', 'PUSH'], default: 'PUSH' },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false }
  },
  // Automatically add createdAt and updatedAt timestamps
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
