const express = require('express');
const router = express.Router();

const { renderLogin, loginIncharge, logoutIncharge } = require('../controllers/inchargeController');

const { authorizeIncharge } = require('../middleware/auth');

// Auth Routes
router.route('/login').get(renderLogin).post(loginIncharge);
router.route('/logout').get(logoutIncharge);

router.route('/:id').get(getIncharge);

module.exports = router;
