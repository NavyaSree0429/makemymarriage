const { sendError } = require('../utils/apiResponse');

/**
 * Zod validation middleware generator
 * @param {import('zod').ZodSchema} schema 
 */
const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const formattedErrors = result.error.errors.map(err => ({
        field: err.path.join('.').replace(/^(body|query|params)\./, ''),
        message: err.message
      }));
      return sendError(res, 400, 'Validation failed for request parameters', 'VALIDATION_ERROR', formattedErrors);
    }

    // Attach parsed data back if needed
    req.validated = result.data;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validate;
