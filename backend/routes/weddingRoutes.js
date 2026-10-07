const express = require('express');
const router = express.Router();

const validate = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  createWeddingSchema,
  updateWeddingSchema,
  acceptPartnerInviteSchema,
} = require('../validators/weddingValidator');
const {
  inviteOrganizerSchema,
  updatePermissionsSchema,
} = require('../validators/organizerValidator');
const {
  createWedding,
  getMyWeddings,
  getWeddingById,
  invitePartner,
  acceptPartnerInvite,
} = require('../controllers/weddingController');
const {
  inviteOrganizer,
  getOrganizers,
  updateOrganizerPermissions,
  revokeOrganizer,
} = require('../controllers/organizerController');

// All wedding management routes are protected
router.use(protect);

// Workspace routes
router.post('/', validate(createWeddingSchema), createWedding);
router.get('/my-weddings', getMyWeddings);
router.post('/accept-partner-invite', validate(acceptPartnerInviteSchema), acceptPartnerInvite);
router.get('/:id', getWeddingById);
router.post('/:id/invite-partner', invitePartner);

// MOD-03 Organizer & Permission routes
router.post('/:id/invite-organizer', validate(inviteOrganizerSchema), inviteOrganizer);
router.get('/:id/organizers', getOrganizers);
router.put('/:id/organizers/:membershipId/permissions', validate(updatePermissionsSchema), updateOrganizerPermissions);
router.delete('/:id/organizers/:membershipId', revokeOrganizer);

module.exports = router;
