// Models
const Shipment = require('../models/Shipment');
const TrackingStatus = require('../models/TrackingStatus');
const Notification = require('../models/Notification');

// Utils
const { calculateCost, calculateETA } = require('../utils/calculate');

// POST /api/shipments
// Customer or Admin creates a new shipment
const createShipment = async (req, res) => {
  try {
    const { sender, recipient, parcel } = req.body;

    const shipment = await Shipment.create({
      customer: req.user._id,
      sender,
      recipient,
      parcel,
      shippingCost: calculateCost(parcel),
      estimatedDelivery: calculateETA(parcel)
    });

    // Create first tracking event
    await TrackingStatus.create({
      shipment: shipment._id,
      status: 'PENDING',
      location: sender.address?.city || '',
      description: 'Shipment created and pending pickup',
      updatedBy: req.user._id
    });

    // Notify customer
    await Notification.create({
      user: req.user._id,
      shipment: shipment._id,
      type: 'PUSH',
      message: `Your shipment ${shipment.trackingId} has been created successfully.`
    });

    res.status(201).json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/shipments
// Customer sees own, Admin sees all
const getShipments = async (req, res) => {
  try {
    const filter = req.user.role === 'ADMIN' ? {} : { customer: req.user._id };

    const shipments = await Shipment.find(filter)
      .populate('customer', 'name email')
      .populate('courier', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: shipments.length, data: shipments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/shipments/:id
// Get single shipment detail – owner, assigned courier, or admin
const getShipmentById = async (req, res) => {
  try {
    // Get shipment based on trackingId
    // Support regex for partial match (e.g. "PDT-1234" can be searched with "1234")
    const shipment = await Shipment.findOne({
      trackingId: new RegExp(req.params.id, 'i')
    })
      .populate('customer', 'name email phone')
      .populate('courier', 'name email phone');

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    // Only owner, assigned courier, or admin can view
    const isOwner = shipment.customer._id.toString() === req.user._id.toString();
    const isCourier = shipment.courier?._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isCourier && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorised to view this shipment' });
    }

    res.status(200).json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/shipments/:id
// Edit shipment details – owner or admin
// Only allowed if status is NOT delivered/cancelled
const updateShipment = async (req, res) => {
  try {
    let shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    // Only owner or admin can update
    const isOwner = shipment.customer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorised to update this shipment' });
    }

    // Prevent update if already delivered or cancelled
    if (['DELIVERED', 'CANCELLED'].includes(shipment.status)) {
      return res.status(400).json({ success: false, message: `Cannot modify a ${shipment.status} shipment` });
    }

    const { sender, recipient, parcel } = req.body;
    shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      { sender, recipient, parcel },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/shipments/:id/status
// Update delivery status – courier or admin only
const updateShipmentStatus = async (req, res) => {
  try {
    const { status, location, description } = req.body;

    const shipment = await Shipment.findById(req.params.id).populate('customer', 'name email');

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (shipment.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Cannot update a cancelled shipment' });
    }

    // Update Shipment current status
    shipment.status = status;
    await shipment.save();

    // Create Tracking
    await TrackingStatus.create({
      shipment: shipment._id,
      status,
      location: location || '',
      description: description || `Status updated to ${status}`,
      updatedBy: req.user._id
    });

    // 3. Notify customer
    const statusMessages = {
      picked_up: `Your shipment ${shipment.trackingId} has been picked up.`,
      in_transit: `Your shipment ${shipment.trackingId} is now in transit.`,
      out_for_delivery: `Your shipment ${shipment.trackingId} is out for delivery today!`,
      delivered: `Your shipment ${shipment.trackingId} has been delivered successfully.`,
      cancelled: `Your shipment ${shipment.trackingId} has been cancelled.`
    };

    await Notification.create({
      user: shipment.customer._id,
      shipment: shipment._id,
      type: 'PUSH',
      message: statusMessages[status] || `Shipment status updated to ${status}.`
    });

    res.status(200).json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/shipments/:id/cancel
// Cancel shipment – owner or admin
// Cannot cancel if already delivered
const cancelShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    const isOwner = shipment.customer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorised to cancel this shipment' });
    }

    if (shipment.status === 'DELIVERED') {
      return res.status(400).json({ success: false, message: 'Cannot cancel a delivered shipment' });
    }

    shipment.status = 'CANCELLED';
    shipment.isCancelled = true;
    await shipment.save();

    // Create cancellation Tracking
    await TrackingStatus.create({
      shipment: shipment._id,
      status: 'CANCELLED',
      description: 'Shipment was cancelled',
      updatedBy: req.user._id
    });

    // Notify customer
    await Notification.create({
      user: shipment.customer,
      shipment: shipment._id,
      type: 'PUSH',
      message: `Your shipment ${shipment.trackingId} has been cancelled.`
    });

    res.status(200).json({ success: true, message: 'Shipment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/shipments/:id/hard
// Admin only — permanently removes shipment
const deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    // Cascade delete all related documents
    const deletedEvents = await TrackingStatus.deleteMany({ shipment: shipment._id });

    // Hard delete the shipment itself
    await Shipment.findByIdAndDelete(req.params.id);

    // Notify customer about permanent deletion
    await Notification.create({
      user: shipment.customer,
      shipment: shipment._id,
      trackingId: shipment.trackingId,
      type: 'PUSH',
      message: `Your shipment ${shipment.trackingId} has been deleted due to policy reasons. Please contact support for more information.`
    });

    res.status(200).json({
      success: true,
      message: `Shipment ${shipment.trackingId} permanently deleted`,
      deleted: {
        shipment: shipment.trackingId,
        trackingStatus: deletedEvents.deletedCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
  updateShipmentStatus,
  cancelShipment,
  deleteShipment
};
