import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes: requires a valid Bearer token.
 * Attaches the authenticated user to req.user.
 */
export const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user no longer exists' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

/**
 * Restrict a route to users who have completed payment.
 */
export const requirePaid = (req, res, next) => {
  if (!req.user?.hasPaid) {
    return res.status(403).json({ message: 'Payment required to access this resource' });
  }
  next();
};
