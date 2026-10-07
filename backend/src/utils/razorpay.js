import Razorpay from 'razorpay';

/**
 * Returns a configured Razorpay instance, or null when keys are missing
 * (in which case the app falls back to MOCK payment mode).
 */
export const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

/**
 * Mock mode is active whenever either Razorpay key is blank. It lets the whole
 * ₹99 flow be demoed without a Razorpay account — no money moves.
 */
export const isMockMode = () =>
  !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET;
