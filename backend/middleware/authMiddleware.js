const jwt = require('jsonwebtoken');

// Models
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id).select('-password');

      if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists.'
        });
      }

      // Check tokenVersion — mismatch means user has logged out
      if (decoded.tokenVersion !== user.tokenVersion) {
        return res.status(401).json({
          success: false,
          message: 'Token has been invalidated. Please log in again.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }
};

// Get user from token and attach to req.user
const getUserFromToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id).select('-password');

      if (user) {
        // Check tokenVersion — mismatch means user has logged out
        if (decoded.tokenVersion === user.tokenVersion) {
          req.user = user;
        }
      }
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Token failed'
      });
    }
  }

  next();
};

// Authorize middleware (role-based access)
const authorize = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized for this action. Required: ${roles.join(', ')}`
      });
    }
    next();
  };
};

module.exports = { protect, getUserFromToken, authorize };
