/**
 * 404 handler for unknown routes.
 */
export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

/**
 * Centralised error handler. Logs the error and returns a clean JSON message.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  if (process.env.NODE_ENV !== 'test') {
    console.error('❌', err.message);
  }
  res.status(status).json({
    message: err.message || 'Internal server error',
  });
};
