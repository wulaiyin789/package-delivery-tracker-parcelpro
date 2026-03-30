// Models
const User = require('../models/User');

// GET /api/users/search?q=
// Search users by name/email/phone with pagination
// Admin only
const searchUsers = async (req, res) => {
  try {
    const { q, role, page = 1, limit = 10 } = req.query;

    const filter = {};

    // Search by name or email (case-insensitive)
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ];
    }

    // Search by role
    if (role) {
      filter.role = role.toString().toUpperCase();
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);

    // Exclude password and get the newest users first
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/activate/:id
// sets status = 'ACTIVE' instead of removing from DB
// Admin only
const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot activate your own account' });
    }

    // Prevent deleting another admin
    if (user.role === 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Cannot activate another admin account' });
    }

    // Soft delete
    user.status = 'ACTIVE';
    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        status: user.status
      },
      message: `User ${user.name} (${user.email}) has been activated`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/deactivate/:id
// Soft delete: sets status = 'INACTIVE' instead of removing from DB
// Admin only
const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own account' });
    }

    // Prevent deleting another admin
    if (user.role === 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Cannot deactivate another admin account' });
    }

    // Soft delete
    user.status = 'INACTIVE';
    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        status: user.status
      },
      message: `User ${user.name} (${user.email}) has been deactivated`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/users/:id
// Hard delete: Removing from DB
// Admin only
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    // Prevent deleting another admin
    if (user.role === 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Cannot delete another admin account' });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: `User ${user.name} (${user.email}) has been deleted`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/:id/role
// Update user role
// Admin only
const updateRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role value
    const allowedRoles = ['CUSTOMER', 'COURIER', 'ADMIN'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`
      });
    }

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent admin from changing their own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot change your own role' });
    }

    const previousRole = user.role;
    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated from '${previousRole}' to '${role}'`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateRole,
  activateUser,
  deactivateUser,
  deleteUser,
  searchUsers
};
