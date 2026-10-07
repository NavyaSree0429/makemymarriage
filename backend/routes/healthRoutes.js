const express = require('express');
const router = express.Router();
const { sendSuccess } = require('../utils/apiResponse');

router.get('/health', (req, res) => {
  return sendSuccess(res, 200, 'MakeMyMarriage API Service is active', {
    status: 'UP',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
