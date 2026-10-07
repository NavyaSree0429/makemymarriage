/**
 * Standardized API Response Utilities
 * Ensures consistent response envelopes across all endpoints
 */

const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, meta = undefined) => {
  const response = {
    success: true,
    message,
    data
  };
  if (meta !== undefined) {
    response.meta = meta;
  }
  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode = 500, message = 'An unexpected error occurred', errorCode = 'INTERNAL_ERROR', details = null) => {
  const response = {
    success: false,
    message,
    error: {
      code: errorCode,
      ...(details ? { details } : {})
    }
  };
  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError
};
