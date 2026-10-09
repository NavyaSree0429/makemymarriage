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
  validateTask,
  validateUpdateTask,
} = require('../validators/taskValidator');
const {
  validateVendor,
  validateUpdateVendor,
} = require('../validators/vendorValidator');
const {
  validatePhoto,
  validateUpdatePhoto,
} = require('../validators/photoValidator');

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
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const {
  createVendor,
  getVendors,
  updateVendor,
  deleteVendor,
} = require('../controllers/vendorController');
const {
  createPhoto,
  getPhotos,
  updatePhoto,
  deletePhoto,
  toggleLikePhoto,
} = require('../controllers/photoController');

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

// MOD-07 Task Planner & Assignment routes
router.post('/:id/tasks', validateTask, createTask);
router.get('/:id/tasks', getTasks);
router.put('/:id/tasks/:taskId', validateUpdateTask, updateTask);
router.delete('/:id/tasks/:taskId', deleteTask);

// MOD-08 Vendor & Budget Tracking routes
router.post('/:id/vendors', validateVendor, createVendor);
router.get('/:id/vendors', getVendors);
router.put('/:id/vendors/:vendorId', validateUpdateVendor, updateVendor);
router.delete('/:id/vendors/:vendorId', deleteVendor);

// MOD-09 Photo Gallery & Shared Memories routes
router.post('/:id/photos', validatePhoto, createPhoto);
router.get('/:id/photos', getPhotos);
router.put('/:id/photos/:photoId', validateUpdatePhoto, updatePhoto);
router.delete('/:id/photos/:photoId', deletePhoto);
router.post('/:id/photos/:photoId/like', toggleLikePhoto);

module.exports = router;

