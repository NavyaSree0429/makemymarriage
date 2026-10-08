const { z } = require('zod');

const guestSchema = z.object({
  fullName: z.string().min(2, 'Guest name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional().default(''),
  category: z.enum(['BRIDE_FAMILY', 'GROOM_FAMILY', 'FRIENDS', 'VIP', 'PLANNERS', 'GENERAL']).optional().default('GENERAL'),
  invitedEvents: z.array(z.string()).optional().default([]),
  allocatedAttendees: z.number().int().min(1).optional().default(1),
  dietaryPreference: z.enum(['VEG', 'NON_VEG', 'VEGAN', 'JAIN', 'EGGITARIAN', 'NO_PREFERENCE']).optional().default('VEG'),
  rsvpStatus: z.enum(['PENDING', 'CONFIRMED', 'DECLINED']).optional().default('PENDING'),
  notes: z.string().optional().default(''),
});

const updateGuestSchema = guestSchema.partial();

const validateGuest = (req, res, next) => {
  const result = guestSchema.safeParse(req.body);
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

const validateUpdateGuest = (req, res, next) => {
  const result = updateGuestSchema.safeParse(req.body);
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
  validateGuest,
  validateUpdateGuest,
};
