const { z } = require('zod');

const vendorSchema = z.object({
  vendorName: z
    .string({ required_error: 'Vendor name is required' })
    .min(2, 'Vendor name must be at least 2 characters')
    .max(150, 'Vendor name cannot exceed 150 characters'),
  category: z
    .enum(['VENUE', 'CATERING', 'PHOTOGRAPHY', 'DECOR', 'MUSIC', 'MAKEUP', 'OTHER'])
    .optional()
    .default('OTHER'),
  contactPerson: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  email: z.string().optional().default(''),
  estimatedBudget: z.number().min(0, 'Budget cannot be negative').optional().default(0),
  actualCost: z.number().min(0, 'Actual cost cannot be negative').optional().default(0),
  paidAmount: z.number().min(0, 'Paid amount cannot be negative').optional().default(0),
  paymentStatus: z
    .enum(['UNPAID', 'PARTIALLY_PAID', 'FULLY_PAID'])
    .optional()
    .default('UNPAID'),
  notes: z.string().optional().default(''),
});

const updateVendorSchema = vendorSchema.partial();

const validateVendor = (req, res, next) => {
  const result = vendorSchema.safeParse(req.body);
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

const validateUpdateVendor = (req, res, next) => {
  const result = updateVendorSchema.safeParse(req.body);
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
  validateVendor,
  validateUpdateVendor,
};
