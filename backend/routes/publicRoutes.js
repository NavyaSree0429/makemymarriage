const express = require('express');
const router = express.Router();
const { getPublicWeddingBySlug } = require('../controllers/publicController');

// Unauthenticated public route for guests to view wedding websites
router.get('/weddings/:slug', getPublicWeddingBySlug);

module.exports = router;
