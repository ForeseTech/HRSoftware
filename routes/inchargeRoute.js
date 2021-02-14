const express = require('express');
const router = express.Router();

const { renderLogin, loginIncharge, logoutIncharge } = require('../controllers/inchargeController');

router.route('/login').get(renderLogin).post(loginIncharge);
router.route('/logout').get(logoutIncharge);

module.exports = router;
