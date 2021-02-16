const express = require('express');
const router = express.Router();

const {
  renderLogin,
  loginIncharge,
  logoutIncharge,
  getIncharge,
  deleteIncharge,
  assignStudentToUser,
  deallocateStudentToUser,
} = require('../controllers/inchargeController');

const { authorizeIncharge, isLoggedIn, authorize } = require('../middleware/auth');

// Auth Routes
router.route('/login').get(renderLogin).post(loginIncharge);
router.route('/logout').get(logoutIncharge);

router.route('/:id').get(authorizeIncharge, getIncharge).delete(isLoggedIn, authorize('Admin'), deleteIncharge);

// Assign and Deallocate Student Routes
router.route('/:interviewerId/assign_student').post(authorizeIncharge, assignStudentToUser);
router.route('/:interviewerId/deallocate_student/:studentId').put(authorizeIncharge, deallocateStudentToUser);

module.exports = router;
