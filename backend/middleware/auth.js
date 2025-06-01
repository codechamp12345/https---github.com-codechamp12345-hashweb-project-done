import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  console.log('Protect middleware entered for route:', req.originalUrl);
  try {
    let token;

    // Get token from headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      console.log('Protect middleware: No token found');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route (no token)'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Protect middleware: Token verified. Decoded payload:', decoded);

      // Check if role is present
      const role = decoded.role;
      const userId = decoded.userId || decoded.id; // Handle both token formats

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token format'
        });
      }

      if (role === 'admin') {
        const admin = await Admin.findById(userId).select('-password');
        if (!admin) {
          return res.status(401).json({
            success: false,
            message: 'Admin not found'
          });
        }
        req.user = admin;
        req.user.role = 'admin';
      } else {
        const user = await User.findById(userId).select('-password');
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'User not found'
          });
        }
        req.user = user;
        req.user.role = role || 'user';
      }

      next();
    } catch (error) {
      console.error('Protect middleware: Token verification failed:', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route (invalid token)'
      });
    }
  } catch (error) {
    console.error('Protect middleware: Internal error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error in authentication'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Authorizing user with role:', req.user?.role, 'for route', req.originalUrl);
    
    // Ensure user object and role are available after protect middleware
    if (!req.user || !req.user._id || !req.user.role) {
      console.log('Authorization failed: User object or role missing');
      return res.status(401).json({
        success: false,
        message: 'User authentication required for authorization'
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log(`Authorization failed: Role ${req.user.role} not allowed for route ${req.originalUrl}`);
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource`
      });
    }
    
    console.log('Authorization successful for user', req.user._id, 'with role', req.user.role);
    next();
  };
};
