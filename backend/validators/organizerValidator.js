const { z } = require('zod');

const permissionsSchema = z.object({
  canManageEvents: z.boolean().default(true),
  canManageGuests: z.boolean().default(true),
  canManageInvitations: z.boolean().default(true),
  canManageTasks: z.boolean().default(true),
  canManageVendors: z.boolean().default(true),
  canManageBudget: z.boolean().default(false),
  canManageGallery: z.boolean().default(false),
  canManageWebsite: z.boolean().default(true),
});

const inviteOrganizerSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Organizer email is required' }).email('Valid email address required'),
    fullName: z.string().min(2, 'Name is required').optional(),
    title: z.string().optional(),
    permissions: permissionsSchema.optional(),
  })
});

const updatePermissionsSchema = z.object({
  body: z.object({
    permissions: permissionsSchema,
  })
});

module.exports = {
  inviteOrganizerSchema,
  updatePermissionsSchema,
};
