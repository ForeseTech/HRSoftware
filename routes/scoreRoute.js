const express = require('express');
const router = express.Router();

const { renderScores } = require('../controllers/scoreController');

const { isLoggedIn, authorize } = require('../middleware/auth');

router.route('/').get(isLoggedIn, authorize('Admin'), renderScores);

module.exports = router;
