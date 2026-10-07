const express = require('express');
const router = express.Router();
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const weddingRoutes = require('./weddingRoutes');

router.use('/system', healthRoutes);
router.use('/auth', authRoutes);
router.use('/weddings', weddingRoutes);

module.exports = router;
