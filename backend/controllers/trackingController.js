// Models
const Shipment = require('../models/Shipment');
const TrackingStatus = require('../models/TrackingStatus');

// Enums
const { statusLabel, shippingRates } = require('../enums/enums');

// GET /api/tracking/:trackingId
// Track package by tracking ID, anyone can look up a tracking ID publicly
const getTrackingStatus = async (req, res) => {
  try {
    // Support regex for partial match (e.g. "PDT-1234" can be searched with "1234")
    const shipment = await Shipment.findOne({
      trackingId: new RegExp(req.params.trackingId, 'i')
    })
      .populate('courier', 'name phone')
      .populate('customer', 'name');

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Tracking ID not found. Please check your tracking number and try again.'
      });
    }

    // Get the most recent tracking event for "last known location"
    const latestEvent = await TrackingStatus.findOne({ shipment: shipment._id })
      .sort({ createdAt: -1 })
      .populate('updatedBy', 'name role');

    const responseData = {
        success: true,
        data: {
          trackingId: shipment.trackingId,
          status: shipment.status,
          statusLabel: statusLabel[shipment.status] || shipment.status,
          estimatedDelivery: shipment.estimatedDelivery,
          shippingCost: shipment.shippingCost,
          parcel: {
            weight: shipment.parcel?.weight ? `${shipment.parcel.weight} kg` : 'N/A',
            dimensions: shipment.parcel?.dimensions || 'N/A',
            description: shipment.parcel?.description || 'N/A',
            type: shipment.parcel?.type || 'STANDARD'
          },
          sender: {
            name: shipment.sender?.name,
            city: shipment.sender?.address?.city
          },
          recipient: {
            name: shipment.recipient?.name,
            city: shipment.recipient?.address?.city
          },
          courier: shipment.courier ? { name: shipment.courier.name, phone: shipment.courier.phone } : null,
          latestEvent: latestEvent
            ? {
                status: latestEvent.status,
                location: latestEvent.location,
                description: latestEvent.description,
                timestamp: latestEvent.createdAt
              }
            : null,
          createdAt: shipment.createdAt
        }
      }

    // Limit details if user is not logged in or not related to the shipment
    if (!req.user) {
      // Public view – only show basic info without sensitive details
      delete responseData.data.sender;
      delete responseData.data.recipient;
      
      res.status(200).json(responseData);
    } else {
      res.status(200).json(responseData);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/tracking/:trackingId/history
// Returns full event timeline (oldest → newest)
const getTrackingHistory = async (req, res) => {
  try {
    // Support regex for partial match (e.g. "PDT-1234" can be searched with "1234")
    const shipment = await Shipment.findOne({
      trackingId: new RegExp(req.params.trackingId, 'i')
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Tracking ID not found'
      });
    }

    // Fetch all events sorted oldest → newest (timeline order for Figma UI)
    const events = await TrackingStatus.find({ shipment: shipment._id })
      .populate('updatedBy', 'name role')
      .sort({ createdAt: 1 });

    // Build a structured timeline for the frontend
    const timeline = events.map((event, index) => ({
      step: index + 1,
      status: event.status,
      location: event.location || '',
      description: event.description || `Status updated to ${event.status}`,
      updatedBy: event.updatedBy ? { name: event.updatedBy.name, role: event.updatedBy.role } : null,
      timestamp: event.createdAt,
      isLatest: index === events.length - 1
    }));

    res.status(200).json({
      success: true,
      data: {
        trackingId: shipment.trackingId,
        currentStatus: shipment.status,
        totalEvents: events.length,
        timeline
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/tracking/cost/:shipmentId
// PROTECTED – all roles
// Returns shipping cost breakdown + ETA
const calculateCostAndTime = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      trackingId: new RegExp(req.params.shipmentId, 'i')
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    const type = shipment.parcel?.type || 'STANDARD';
    const weight = shipment.parcel?.weight || 1;
    const rate = shippingRates[type];

    const baseCost = rate.baseCost;
    const weightCharge = parseFloat((weight * rate.costPerKg).toFixed(2));
    const totalCost = parseFloat((baseCost + weightCharge).toFixed(2));

    // Calculate ETA from today
    const eta = new Date();
    eta.setDate(eta.getDate() + rate.days);

    res.status(200).json({
      success: true,
      data: {
        trackingId: shipment.trackingId,
        parcel: {
          type: type,
          label: rate.label,
          weight: `${weight} kg`,
          dimensions: shipment.parcel?.dimensions || 'N/A',
          description: shipment.parcel?.description || 'N/A'
        },
        costBreakdown: {
          baseCost: `$${baseCost.toFixed(2)}`,
          weightCharge: `$${weightCharge.toFixed(2)} (${weight}kg × $${rate.costPerKg}/kg)`,
          total: `$${totalCost}`
        },
        delivery: {
          estimatedDays: rate.days,
          estimatedDelivery: eta,
          cutoffMessage: `Order before 3pm for guaranteed ${rate.label}`
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTrackingStatus, getTrackingHistory, calculateCostAndTime };
