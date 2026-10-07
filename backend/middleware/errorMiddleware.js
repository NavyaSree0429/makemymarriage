const { sendError } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error(`[API Error] ${req.method} ${req.url}:`, err);

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, 400, `Invalid ID format for ${err.path}`, 'INVALID_ID');
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(res, 409, `A record with this ${field} already exists.`, 'DUPLICATE_KEY');
  }

  // Default Error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';

  return sendError(res, statusCode, message, errorCode, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};

const notFoundHandler = (req, res, next) => {
  return sendError(res, 404, `Route not found - ${req.originalUrl}`, 'NOT_FOUND');
};

module.exports = {
  errorHandler,
  notFoundHandler
};
