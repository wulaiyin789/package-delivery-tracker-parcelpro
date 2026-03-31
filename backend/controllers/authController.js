const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Models
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      role: user.role,
      tokenVersion: user.tokenVersion
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d'
    }
  );
};

// POST /api/users/login
// Login User
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Specify role used for API testing purposes, but in production this should default to 'CUSTOMER' and only be changeable by an admin
    const user = await User.create({ name, email, password, role });

    res.status(201)
      .json({ success: true, id: user.id, name: user.name, email: user.email, role: user.role, token: generateToken(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/users/login
// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ success: true, id: user.id, name: user.name, email: user.email, role: user.role, token: generateToken(user) });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/users/logout
// Logout User
const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { tokenVersion: 1 }
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/profile
// Get User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      university: user.university,
      address: user.address
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// GET /api/users/profile
// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { name, email, university, address } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    user.university = university || user.university;
    user.address = address || user.address;

    const updatedUser = await user.save();

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      university: updatedUser.university,
      address: updatedUser.address,
      token: generateToken(updatedUser.id)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  getProfile
};
