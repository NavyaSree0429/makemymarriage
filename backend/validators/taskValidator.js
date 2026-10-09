const { z } = require('zod');

const taskSchema = z.object({
  title: z
    .string({ required_error: 'Task title is required' })
    .min(2, 'Task title must be at least 2 characters')
    .max(150, 'Task title cannot exceed 150 characters'),
  category: z
    .enum(['DECOR', 'CATERING', 'MUSIC', 'LOGISTICS', 'OUTFITS', 'PHOTOGRAPHY', 'GENERAL'])
    .optional()
    .default('GENERAL'),
  priority: z
    .enum(['URGENT', 'HIGH', 'MEDIUM', 'LOW'])
    .optional()
    .default('MEDIUM'),
  status: z
    .enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    .optional()
    .default('PENDING'),
  dueDate: z.string().optional().nullable(),
  assigneeName: z.string().optional().default('Unassigned'),
  assigneeId: z.string().optional().nullable(),
  notes: z.string().optional().default(''),
});

const updateTaskSchema = taskSchema.partial();

const validateTask = (req, res, next) => {
  const result = taskSchema.safeParse(req.body);
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

const validateUpdateTask = (req, res, next) => {
  const result = updateTaskSchema.safeParse(req.body);
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
  validateTask,
  validateUpdateTask,
};
