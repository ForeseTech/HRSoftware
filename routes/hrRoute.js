const express = require('express');
const router = express.Router();

const { renderHr, createHr, updateHr, deleteHr } = require('../controllers/hrController');

router.route('/').get(renderHr).post(createHr);
router.route('/:id').put(updateHr).delete(deleteHr);

module.exports = router;
