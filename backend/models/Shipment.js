const mongoose = require('mongoose');
const crypto = require('crypto');

const AddressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    state: String,
    country: String,
    postcode: String
  },
  { _id: false }
);

const ShipmentSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      default: () => 'PDT-' + crypto.randomUUID().toString().slice(0, 8).toUpperCase(),
      unique: true
    },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sender: {
      name: { type: String, required: true },
      phone: String,
      address: AddressSchema
    },
    recipient: {
      name: { type: String, required: true },
      phone: String,
      address: AddressSchema
    },
    parcel: {
      weight: { type: Number }, // kg
      dimensions: { type: String }, // "30x20x10 cm" - "LxWxH cm"
      description: { type: String },
      type: { type: String, enum: ['STANDARD', 'EXPRESS', 'OVERNIGHT'], default: 'STANDARD' }
    },
    status: {
      type: String,
      enum: ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_OF_DELIVERY', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING'
    },
    estimatedDelivery: Date,
    shippingCost: Number,
    isCancelled: { type: Boolean, default: false }
  },
  // Automatically add createdAt and updatedAt timestamps
  { timestamps: true }
);

module.exports = mongoose.model('Shipment', ShipmentSchema);
