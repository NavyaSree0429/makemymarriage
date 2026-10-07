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
  createWedding,
  getMyWeddings,
  getWeddingById,
  invitePartner,
  acceptPartnerInvite,
} = require('../controllers/weddingController');

// All wedding management routes are protected
router.use(protect);

router.post('/', validate(createWeddingSchema), createWedding);
router.get('/my-weddings', getMyWeddings);
router.post('/accept-partner-invite', validate(acceptPartnerInviteSchema), acceptPartnerInvite);
router.get('/:id', getWeddingById);
router.post('/:id/invite-partner', invitePartner);

module.exports = router;
