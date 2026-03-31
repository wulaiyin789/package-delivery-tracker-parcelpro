const express = require('express');

// Controllers
const { registerUser, loginUser, logoutUser, updateUserProfile, getProfile } = require('../controllers/authController');

// Middleware
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

// POST /api/auth/logout
router.post('/logout', protect, logoutUser);

// GET /api/auth/profile
router.get('/profile', protect, getProfile);

// PUT /api/auth/profile
router.put('/profile', protect, updateUserProfile);

module.exports = router;
