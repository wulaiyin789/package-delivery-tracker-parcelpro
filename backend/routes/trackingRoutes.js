const express = require('express');
const router = express.Router();

const { getTrackingStatus, getTrackingHistory, calculateCostAndTime } = require('../controllers/trackingController');

const { protect, getUserFromToken } = require('../middleware/authMiddleware');

// GET /api/tracking/:trackingId
router.get('/:trackingId', getUserFromToken, getTrackingStatus);

// GET /api/tracking/:trackingId/history
router.get('/:trackingId/history', getTrackingHistory);

// GET /api/tracking/cost/:shipmentId
router.get('/cost/:shipmentId', protect, calculateCostAndTime);

module.exports = router;
