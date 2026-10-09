const express = require('express');
const router = express.Router();
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const weddingRoutes = require('./weddingRoutes');
const rsvpRoutes = require('./rsvpRoutes');

router.use('/system', healthRoutes);
router.use('/auth', authRoutes);
router.use('/weddings', weddingRoutes);
router.use('/rsvp', rsvpRoutes);

module.exports = router;
