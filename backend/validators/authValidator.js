const { z } = require('zod');

const signupSchema = z.object({
  body: z.object({
    fullName: z.string({ required_error: 'Full name is required' })
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name cannot exceed 100 characters'),
    email: z.string({ required_error: 'Email is required' })
      .email('Please enter a valid email address'),
    password: z.string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional(),
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' })
      .email('Please enter a valid email address'),
    password: z.string({ required_error: 'Password is required' }),
  })
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' })
      .email('Please enter a valid email address'),
  })
});

const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' })
      .email('Please enter a valid email address'),
    otp: z.string({ required_error: 'OTP is required' })
      .length(6, 'OTP must be 6 digits'),
    newPassword: z.string({ required_error: 'New password is required' })
      .min(6, 'Password must be at least 6 characters'),
  })
});

const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).max(100).optional(),
    phone: z.string().optional(),
    profilePicture: z.string().optional(),
  })
});

module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
};
