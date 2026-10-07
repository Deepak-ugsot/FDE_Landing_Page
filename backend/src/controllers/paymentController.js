import crypto from 'crypto';
import Payment from '../models/Payment.js';
import { getRazorpay, isMockMode } from '../utils/razorpay.js';

const getPrice = () => Number(process.env.COURSE_PRICE || 9900); // paise (9900 = ₹99)
const getCurrency = () => process.env.CURRENCY || 'INR';

/**
 * GET /api/payments/config
 * Pricing info for the frontend (price, currency, mock flag, key id, LMS url).
 */
export const getPaymentConfig = (req, res) => {
  res.json({
    amount: getPrice(),
    currency: getCurrency(),
    mock: isMockMode(),
    keyId: process.env.RAZORPAY_KEY_ID || null,
    lmsUrl: process.env.LMS_URL || null,
  });
};

/**
 * POST /api/payments/create-order
 * Creates a Razorpay order (or a mock order if keys are absent) for the logged-in user.
 */
export const createOrder = async (req, res, next) => {
  try {
    if (req.user.hasPaid) {
      return res.status(400).json({ message: 'You have already unlocked full access' });
    }

    const amount = getPrice();
    const currency = getCurrency();

    // ---- Mock mode (no Razorpay keys configured) ----
    if (isMockMode()) {
      const orderId = `order_mock_${crypto.randomBytes(8).toString('hex')}`;
      await Payment.create({
        user: req.user._id,
        orderId,
        amount,
        currency,
        status: 'created',
        method: 'mock',
      });
      return res.json({
        mock: true,
        orderId,
        amount,
        currency,
        keyId: null,
        name: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone,
      });
    }

    // ---- Real Razorpay ----
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `rcpt_${req.user._id}_${Date.now()}`,
      notes: { userId: String(req.user._id), email: req.user.email },
    });

    await Payment.create({
      user: req.user._id,
      orderId: order.id,
      amount,
      currency,
      status: 'created',
      method: 'razorpay',
    });

    return res.json({
      mock: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      name: req.user.fullName,
      email: req.user.email,
      phone: req.user.phone,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/payments/verify
 * Verifies a payment and unlocks access for the logged-in user.
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mock } = req.body;

    const orderId = razorpay_order_id;
    if (!orderId) {
      return res.status(400).json({ message: 'Missing order id' });
    }

    const paymentRecord = await Payment.findOne({ orderId, user: req.user._id });
    if (!paymentRecord) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ---- Mock verification ----
    if (mock || isMockMode()) {
      paymentRecord.status = 'paid';
      paymentRecord.paymentId = `pay_mock_${crypto.randomBytes(8).toString('hex')}`;
      paymentRecord.method = 'mock';
      await paymentRecord.save();
    } else {
      // ---- Real signature verification ----
      if (!razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: 'Missing payment verification fields' });
      }

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        paymentRecord.status = 'failed';
        await paymentRecord.save();
        return res.status(400).json({ message: 'Payment signature verification failed' });
      }

      paymentRecord.status = 'paid';
      paymentRecord.paymentId = razorpay_payment_id;
      paymentRecord.signature = razorpay_signature;
      await paymentRecord.save();
    }

    // ---- Unlock access ----
    const user = req.user;
    user.hasPaid = true;
    user.paidAt = new Date();
    await user.save();

    return res.json({
      message: 'Payment successful',
      user: user.toJSON(),
      lmsUrl: process.env.LMS_URL || null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payments/history
 * Returns the current user's payment records.
 */
export const getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ payments });
  } catch (err) {
    next(err);
  }
};
