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
  validateEvent,
  validateUpdateEvent,
} = require('../validators/eventValidator');
const {
  validateGuest,
  validateUpdateGuest,
} = require('../validators/guestValidator');

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
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const {
  createGuest,
  getGuests,
  updateGuest,
  deleteGuest,
} = require('../controllers/guestController');

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

// MOD-04 Event Management routes
router.post('/:id/events', validateEvent, createEvent);
router.get('/:id/events', getEvents);
router.put('/:id/events/:eventId', validateUpdateEvent, updateEvent);
router.delete('/:id/events/:eventId', deleteEvent);

// MOD-05 Guest List & Digital Invitations routes
router.post('/:id/guests', validateGuest, createGuest);
router.get('/:id/guests', getGuests);
router.put('/:id/guests/:guestId', validateUpdateGuest, updateGuest);
router.delete('/:id/guests/:guestId', deleteGuest);

module.exports = router;
