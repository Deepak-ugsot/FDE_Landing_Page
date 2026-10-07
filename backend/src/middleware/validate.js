import { validationResult } from 'express-validator';

/**
 * Collects express-validator results and returns a 400 with the first
 * message per field if validation failed.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formatted = {};
  errors.array().forEach((e) => {
    const key = e.path || e.param;
    if (!formatted[key]) formatted[key] = e.msg;
  });

  return res.status(400).json({
    message: 'Validation failed',
    errors: formatted,
  });
};
