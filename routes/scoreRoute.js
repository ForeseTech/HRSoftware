const express = require('express');
const router = express.Router();

const { renderScores, deleteScore } = require('../controllers/scoreController');

const { isLoggedIn, authorize } = require('../middleware/auth');

router.route('/').get(isLoggedIn, authorize('Admin'), renderScores);
router.route('/:id').delete(isLoggedIn, authorize('Admin'), deleteScore);

module.exports = router;
