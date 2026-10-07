import { Router } from 'express';
import { body } from 'express-validator';
import {
  signup,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post(
  '/signup',
  [
    body('fullName').trim().isLength({ min: 2, max: 80 }).withMessage('Please enter your full name'),
    body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('phone')
      .trim()
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Enter a valid 10-digit phone number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('city').optional().trim().isLength({ max: 60 }),
    body('currentStatus')
      .optional()
      .isIn(['student', 'working_professional', 'fresher', 'other'])
      .withMessage('Invalid status'),
  ],
  validate,
  signup
);

router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post(
  '/forgot-password',
  [body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail()],
  validate,
  forgotPassword
);

router.post(
  '/reset-password/:token',
  [body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')],
  validate,
  resetPassword
);

router.get('/me', protect, getMe);

export default router;
