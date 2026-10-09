const { z } = require('zod');

const photoCategoryEnum = z.enum(['HALDI', 'MEHENDI', 'SANGEET', 'WEDDING', 'RECEPTION', 'GENERAL']);

const createPhotoSchema = z.object({
  category: photoCategoryEnum.optional().default('GENERAL'),
  imageUrl: z.string().url('Image URL must be a valid HTTP/HTTPS URL'),
  caption: z.string().max(500, 'Caption cannot exceed 500 characters').optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  isPublic: z.boolean().optional().default(true),
});

const updatePhotoSchema = z.object({
  category: photoCategoryEnum.optional(),
  caption: z.string().max(500, 'Caption cannot exceed 500 characters').optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
});

const validatePhoto = (req, res, next) => {
  try {
    req.body = createPhotoSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid photo data payload',
          details: error.errors,
        },
      });
    }
    next(error);
  }
};

const validateUpdatePhoto = (req, res, next) => {
  try {
    req.body = updatePhotoSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid photo update payload',
          details: error.errors,
        },
      });
    }
    next(error);
  }
};

module.exports = {
  validatePhoto,
  validateUpdatePhoto,
};
