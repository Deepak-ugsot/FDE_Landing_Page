import { Router } from 'express';
import {
  getPaymentConfig,
  createOrder,
  verifyPayment,
  getPaymentHistory,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Payment config is public (price/mock flag shown on the landing page);
// everything that touches an order requires a logged-in user.
router.get('/config', getPaymentConfig);
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/history', protect, getPaymentHistory);

export default router;
