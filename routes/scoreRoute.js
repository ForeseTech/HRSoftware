const express = require('express');
const router = express.Router();

const { renderScores } = require('../controllers/scoreController');

router.route('/').get(renderScores);

module.exports = router;
