const { z } = require('zod');

const createWeddingSchema = z.object({
  body: z.object({
    partner1Name: z.string({ required_error: 'Partner 1 name is required' }).min(2),
    partner2Name: z.string({ required_error: 'Partner 2 name is required' }).min(2),
    weddingDate: z.string({ required_error: 'Wedding date is required' }),
    city: z.string().optional(),
    venueName: z.string().optional(),
    description: z.string().optional(),
    theme: z.enum(['TRADITIONAL', 'MODERN', 'FLORAL', 'ROYAL', 'MINIMAL']).optional(),
  })
});

const updateWeddingSchema = z.object({
  body: z.object({
    partner1Name: z.string().min(2).optional(),
    partner2Name: z.string().min(2).optional(),
    weddingDate: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    venueName: z.string().optional(),
    address: z.string().optional(),
    description: z.string().optional(),
    theme: z.enum(['TRADITIONAL', 'MODERN', 'FLORAL', 'ROYAL', 'MINIMAL']).optional(),
    status: z.enum(['PLANNING', 'ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
  })
});

const acceptPartnerInviteSchema = z.object({
  body: z.object({
    inviteCode: z.string({ required_error: 'Partner invite code is required' }).min(6),
  })
});

module.exports = {
  createWeddingSchema,
  updateWeddingSchema,
  acceptPartnerInviteSchema,
};
