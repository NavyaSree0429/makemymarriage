const express = require('express');
const router = express.Router();
const {
  getPublicRsvpByToken,
  submitPublicRsvp,
} = require('../controllers/guestController');

// Public Guest RSVP Endpoints (No Authentication Required)
router.get('/:token', getPublicRsvpByToken);
router.post('/:token', submitPublicRsvp);

module.exports = router;
