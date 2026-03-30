const express = require('express');
const router = express.Router();

const {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
  updateShipmentStatus,
  cancelShipment,
  deleteShipment
} = require('../controllers/shipmentController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/authMiddleware');

// POST /api/shipments
router.post('/', protect, authorize('CUSTOMER', 'ADMIN'), createShipment);

// GET /api/shipments
router.get('/', protect, getShipments);

// GET /api/shipments/:id
router.get('/:id', protect, getShipmentById);

// PUT /api/shipments/:id
router.put('/:id', protect, authorize('CUSTOMER', 'ADMIN'), updateShipment);

// PUT /api/shipments/:id/status
router.put('/:id/status', protect, authorize('COURIER', 'ADMIN'), updateShipmentStatus);

// PUT /api/shipments/:id
router.put('/:id', protect, authorize('CUSTOMER', 'ADMIN'), cancelShipment);

// DELETE /api/shipments/:id
// Admin only — permanently removes shipment
router.delete('/:id', protect, authorize('ADMIN'), deleteShipment);

module.exports = router;
