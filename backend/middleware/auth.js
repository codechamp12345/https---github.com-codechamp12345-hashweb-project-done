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

    // Check for token in cookies (if used)
    // else if (req.cookies.token) {
    //   token = req.cookies.token;
    // }

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

      if (role === 'admin') {
        console.log('Protect middleware: Decoded role is admin. Attempting to find admin by ID:', decoded.id);
        const admin = await Admin.findById(decoded.id).select('-password');
        console.log('Protect middleware: Admin findById result:', admin ? 'Found' : 'Not Found');
        
        if (!admin) {
          console.log('Protect middleware: Admin not found for ID from token:', decoded.id);
          return res.status(401).json({
            success: false,
            message: 'Admin not found'
          });
        }
        
        req.user = admin;
        req.user.role = 'admin';
        console.log('Protect middleware: Admin authenticated and user object set.', admin.username);
      } else {
        console.log('Protect middleware: Decoded role is non-admin (', role, '). Attempting to find user by ID:', decoded.id);
        const user = await User.findById(decoded.id).select('-password');
        console.log('Protect middleware: User findById result:', user ? 'Found' : 'Not Found');
        
        if (!user) {
          console.log('Protect middleware: User not found for ID from token:', decoded.id);
          // If a token with a non-admin role doesn't match a user, it's an invalid token for protected routes
          return res.status(401).json({
            success: false,
            message: 'User not found'
          });
        }
        
        req.user = user;
        req.user.role = role || 'user';
        console.log('Protect middleware: User authenticated and user object set.', user.name);
      }

      console.log('Protect middleware: Authentication successful. Proceeding to next middleware/route.');
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
