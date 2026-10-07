import crypto from 'crypto';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendPasswordResetEmail, isEmailConfigured } from '../utils/email.js';

// How long a password reset link stays valid.
const RESET_TOKEN_TTL_MINUTES = 60;

/**
 * POST /api/auth/signup
 * Register a new student and capture lead details.
 */
export const signup = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, city, currentStatus, source } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      city,
      currentStatus,
      source: source || 'youtube',
    });

    const token = generateToken(user._id);
    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    return res.json({
      message: 'Logged in successfully',
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Return the currently authenticated user.
 */
export const getMe = async (req, res) => {
  return res.json({ user: req.user.toJSON() });
};

/**
 * POST /api/auth/forgot-password
 * Generates a reset token and emails a reset link.
 * Always responds generically to avoid revealing which emails are registered.
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const genericMessage =
      'If an account with that email exists, a password reset link has been sent.';

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ message: genericMessage });
    }

    // Create a raw token for the URL; store only its hash.
    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:3000').split(',')[0].trim();
    const resetUrl = `${clientUrl}/reset-password/${rawToken}`;

    try {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.fullName,
        resetUrl,
        minutes: RESET_TOKEN_TTL_MINUTES,
      });
    } catch (err) {
      // Roll back the token so a retry is possible.
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(err);
    }

    // In local dev (no SMTP), return the link so the flow is testable without email.
    const devResetUrl =
      !isEmailConfigured() && process.env.NODE_ENV !== 'production' ? resetUrl : undefined;

    return res.json({ message: genericMessage, devResetUrl });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/reset-password/:token
 * Validates the reset token and sets a new password.
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+password +resetPasswordToken +resetPasswordExpires');

    if (!user) {
      return res
        .status(400)
        .json({ message: 'This password reset link is invalid or has expired.' });
    }

    user.password = password; // hashed by the pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: 'Your password has been reset. You can now log in.' });
  } catch (err) {
    next(err);
  }
};
