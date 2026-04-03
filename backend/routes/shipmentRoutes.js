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

// POST /api/shipments (PDT-50, PDT-52, PDT-53)
router.post('/', protect, authorize('CUSTOMER', 'ADMIN'), createShipment);

// GET /api/shipments
router.get('/', protect, getShipments);

// GET /api/shipments/:id
router.get('/:id', protect, getShipmentById);

// PUT /api/shipments/:id (PDT-28, PDT-29, PDT-30, PDT-32, PDT-33, PDT-34, PDT-35)
router.put('/:id', protect, authorize('CUSTOMER', 'ADMIN'), updateShipment);

// PUT /api/shipments/:id/status (PDT-28, PDT-29, PDT-30, PDT-32, PDT-33, PDT-34, PDT-35)
router.put('/:id/status', protect, authorize('COURIER', 'ADMIN'), updateShipmentStatus);

// DELETE /api/shipments/:id/cancel (PDT-24, PDT-25, PDT-26)
router.delete('/:id/cancel', protect, authorize('CUSTOMER', 'ADMIN'), cancelShipment);

// DELETE /api/shipments/:id/hard
router.delete('/:id/hard', protect, authorize('ADMIN'), deleteShipment);

module.exports = router;
