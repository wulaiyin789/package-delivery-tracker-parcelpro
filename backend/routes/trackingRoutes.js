const express = require('express');
const router = express.Router();

const { getTrackingStatus, getTrackingHistory, calculateCostAndTime } = require('../controllers/trackingController');

const { protect, getUserFromToken } = require('../middleware/authMiddleware');

// GET /api/tracking/:trackingId (PDT-48, PDT-49)
router.get('/:trackingId', getUserFromToken, getTrackingStatus);

// GET /api/tracking/:trackingId/history (PDT-48, PDT-49)
router.get('/:trackingId/history', getTrackingHistory);

// GET /api/tracking/cost/:shipmentId (PDT-37, PDT-38)
router.get('/cost/:shipmentId', protect, calculateCostAndTime);

module.exports = router;
