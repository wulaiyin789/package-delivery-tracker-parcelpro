const mongoose = require('mongoose');

const TrackingStatusSchema = new mongoose.Schema(
  {
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment',
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_OF_DELIVERY', 'DELIVERED', 'CANCELLED'],
      required: true
    },
    location: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  // Automatically add createdAt and updatedAt timestamps
  { timestamps: true }
);

module.exports = mongoose.model('TrackingStatus', TrackingStatusSchema);
