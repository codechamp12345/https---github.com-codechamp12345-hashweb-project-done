import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Protect routes - verify token and attach user to req object
export const protect = async (req, res, next) => {
  try {
    // First check the Authorization header
    let token = req.headers.authorization?.split(' ')[1];

    // If no token in Authorization header, check cookies
    if (!token && req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');

    // Get user from token but exclude password
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authorized as admin'
    });
  }
};