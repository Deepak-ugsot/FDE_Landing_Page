import { Router } from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/profile', protect, getProfile);

router.put(
  '/profile',
  protect,
  [
    body('fullName').optional().trim().isLength({ min: 2, max: 80 }).withMessage('Please enter a valid name'),
    body('phone')
      .optional()
      .trim()
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Enter a valid 10-digit phone number'),
    body('city').optional().trim().isLength({ max: 60 }),
    body('currentStatus')
      .optional()
      .isIn(['student', 'working_professional', 'fresher', 'other'])
      .withMessage('Invalid status'),
  ],
  validate,
  updateProfile
);

export default router;
