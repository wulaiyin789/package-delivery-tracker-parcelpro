const express = require('express');

// Controllers
const { searchUsers, deleteUser, updateRole, activateUser, deactivateUser } = require('../controllers/userController');

// Middleware
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

//TODO Add User Creation Route (Admin only) in the future
// POST router.post('/add', protect, authorize('ADMIN'), addUser);

//TODO Add Forgot Password feature (Admin only) in the future (PDT-62)
// POST router.post('/forgot-password', protect, authorize('ADMIN'), forgotPassword);

// GET /api/users/search?q= (PDT-66)
router.get('/search', protect, authorize('ADMIN'), searchUsers);

// PUT /api/users/activate/:id (PDT-73)
router.put('/activate/:id', protect, authorize('ADMIN'), activateUser);

// PUT /api/users/deactivate/:id (PDT-73, PDT-74, PDT-75)
router.put('/deactivate/:id', protect, authorize('ADMIN'), deactivateUser);

// DELETE /api/users/:id (PDT-73, PDT-74, PDT-75)
router.delete('/:id', protect, authorize('ADMIN'), deleteUser);

// PUT /api/users/:id/role (PDT-78, PDT-79, PDT-80)
router.put('/:id/role', protect, authorize('ADMIN'), updateRole);

module.exports = router;
