const express = require('express');

// Controllers
const { searchUsers, deleteUser, updateRole, activateUser, deactivateUser } = require('../controllers/userController');

// Middleware
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

//TODO Add User Create Route (Admin only) in the future

// GET /api/users/search?q=
router.get('/search', protect, authorize('ADMIN'), searchUsers);

// PUT /api/users/activate/:id
router.put('/activate/:id', protect, authorize('ADMIN'), activateUser);

// PUT /api/users/deactivate/:id
router.put('/deactivate/:id', protect, authorize('ADMIN'), deactivateUser);

// DELETE /api/users/:id
router.delete('/:id', protect, authorize('ADMIN'), deleteUser);

// PUT /api/users/:id/role
router.put('/:id/role', protect, authorize('ADMIN'), updateRole);

module.exports = router;
