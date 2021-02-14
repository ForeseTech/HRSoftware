const express = require('express');
const router = express.Router();

const {
  renderLogin,
  loginIncharge,
  logoutIncharge,
  getIncharge,
  deallocateStudentToUser,
} = require('../controllers/inchargeController');

const { authorizeIncharge } = require('../middleware/auth');

// Auth Routes
router.route('/login').get(renderLogin).post(loginIncharge);
router.route('/logout').get(logoutIncharge);

router.route('/:id').get(authorizeIncharge, getIncharge);

router.route('/:interviewerId/deallocate_student/:studentId').put(authorizeIncharge, deallocateStudentToUser);

module.exports = router;
