const { z } = require('zod');

const eventSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title cannot exceed 100 characters'),
  eventType: z.enum(['HALDI', 'MEHENDI', 'SANGEET', 'WEDDING', 'RECEPTION', 'COCKTAIL', 'CUSTOM']).optional().default('CUSTOM'),
  date: z.string().min(1, 'Event date is required'),
  startTime: z.string().optional().default('10:00 AM'),
  endTime: z.string().optional().default('02:00 PM'),
  location: z.object({
    venueName: z.string().optional().default(''),
    address: z.string().optional().default(''),
    city: z.string().optional().default(''),
    googleMapsUrl: z.string().optional().default(''),
  }).optional().default({}),
  dressCode: z.string().optional().default(''),
  description: z.string().optional().default(''),
  liveStreamUrl: z.string().optional().default(''),
});

const updateEventSchema = eventSchema.partial();

const validateEvent = (req, res, next) => {
  const result = eventSchema.safeParse(req.body);
  if (!result.success) {
    const errorMessages = result.error.errors.map((e) => e.message).join(', ');
    return res.status(400).json({
      success: false,
      message: errorMessages,
      code: 'VALIDATION_ERROR',
      data: null,
    });
  }
  req.validatedBody = result.data;
  next();
};

const validateUpdateEvent = (req, res, next) => {
  const result = updateEventSchema.safeParse(req.body);
  if (!result.success) {
    const errorMessages = result.error.errors.map((e) => e.message).join(', ');
    return res.status(400).json({
      success: false,
      message: errorMessages,
      code: 'VALIDATION_ERROR',
      data: null,
    });
  }
  req.validatedBody = result.data;
  next();
};

module.exports = {
  validateEvent,
  validateUpdateEvent,
};
